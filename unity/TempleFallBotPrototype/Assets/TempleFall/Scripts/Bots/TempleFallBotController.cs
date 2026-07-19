using UnityEngine;

namespace TempleFall.Bots
{
    [RequireComponent(typeof(BotPerception))]
    [RequireComponent(typeof(BotMovement))]
    [RequireComponent(typeof(BotCombat))]
    [RequireComponent(typeof(BotLooting))]
    [RequireComponent(typeof(BotSafeZoneAwareness))]
    public sealed class TempleFallBotController : MonoBehaviour
    {
        [SerializeField] private TempleFallBotProfile profile;
        [SerializeField, Min(1)] private int playerLevelForOfflineMatch = 1;
        [SerializeField] private Transform templeObjective;
        [SerializeField] private float patrolRadius = 28f;
        [SerializeField] private bool debugState;

        private readonly BotBlackboard blackboard = new BotBlackboard();
        private BotPerception perception;
        private BotMovement movement;
        private BotCombat combat;
        private BotLooting looting;
        private BotSafeZoneAwareness safeZoneAwareness;
        private Vector3 patrolPoint;

        public BotState CurrentState => blackboard.CurrentState;
        public string LastDecisionReason => blackboard.LastDecisionReason;

        private void Awake()
        {
            perception = GetComponent<BotPerception>();
            movement = GetComponent<BotMovement>();
            combat = GetComponent<BotCombat>();
            looting = GetComponent<BotLooting>();
            safeZoneAwareness = GetComponent<BotSafeZoneAwareness>();

            if (profile == null)
            {
                profile = BotDifficultyScaler.CreateRuntimeProfileForPlayerLevel(playerLevelForOfflineMatch);
            }

            blackboard.Self = transform;
            movement.Configure(profile);
            patrolPoint = transform.position;
        }

        private void Update()
        {
            blackboard.Tick(Time.deltaTime);

            if (blackboard.IsEliminated)
            {
                blackboard.ChangeState(new BotDecision(BotState.Eliminated, "Bot eliminated"));
                movement.Stop();
                return;
            }

            perception.Sense(blackboard, profile);
            looting.Scan(blackboard);
            safeZoneAwareness.Sense(blackboard);

            blackboard.ChangeState(Decide());
            ExecuteState();
        }

        private BotDecision Decide()
        {
            if (!blackboard.IsInsideSafeZone && blackboard.DistanceToSafeZone > 0.1f)
            {
                return new BotDecision(BotState.MovingToSafeZone, "Vegetation is unsafe");
            }

            if (blackboard.IsLowHealth(profile.retreatHealthThreshold))
            {
                if (blackboard.HasHealingItem)
                {
                    return new BotDecision(BotState.Healing, "Critical health and healing available");
                }

                return new BotDecision(BotState.Retreating, "Critical health without healing");
            }

            if (blackboard.CanSeeEnemy)
            {
                if (blackboard.IsLowHealth(profile.healingHealthThreshold) && profile.coverPreference > 0.35f)
                {
                    return new BotDecision(BotState.TakingCover, "Enemy visible and health is low");
                }

                return new BotDecision(BotState.EngagingEnemy, "Enemy visible");
            }

            if (!blackboard.HasWeapon || blackboard.HasUsefulLootNearby && Random.value < profile.lootGreed)
            {
                return new BotDecision(BotState.SearchingLoot, "Needs or wants loot");
            }

            if (templeObjective != null && Random.value < profile.templeObjectiveInterest * Time.deltaTime)
            {
                blackboard.CurrentTempleObjective = templeObjective;
                return new BotDecision(BotState.PushingTempleObjective, "Interested in temple objective");
            }

            return new BotDecision(BotState.Patrolling, "No urgent threat");
        }

        private void ExecuteState()
        {
            switch (blackboard.CurrentState)
            {
                case BotState.SearchingLoot:
                    ExecuteSearchLoot();
                    break;
                case BotState.MovingToSafeZone:
                    ExecuteMoveToSafeZone();
                    break;
                case BotState.EngagingEnemy:
                    ExecuteEngageEnemy();
                    break;
                case BotState.TakingCover:
                    ExecuteTakeCover();
                    break;
                case BotState.Healing:
                    ExecuteHealing();
                    break;
                case BotState.Retreating:
                    ExecuteRetreat();
                    break;
                case BotState.PushingTempleObjective:
                    ExecuteTempleObjective();
                    break;
                default:
                    ExecutePatrol();
                    break;
            }
        }

        private void ExecuteSearchLoot()
        {
            if (blackboard.CurrentLootTarget == null)
            {
                ExecutePatrol();
                return;
            }

            movement.MoveTo(blackboard.CurrentLootTarget.position, profile.runSpeed);

            if (Vector3.Distance(transform.position, blackboard.CurrentLootTarget.position) <= 2.2f)
            {
                looting.ClaimLoot(blackboard);
            }
        }

        private void ExecuteMoveToSafeZone()
        {
            movement.MoveTo(safeZoneAwareness.GetSafeMovePoint(), profile.runSpeed);
        }

        private void ExecuteEngageEnemy()
        {
            if (blackboard.CurrentTarget == null)
            {
                ExecutePatrol();
                return;
            }

            var targetPosition = blackboard.CurrentTarget.position;
            var distance = Vector3.Distance(transform.position, targetPosition);

            transform.rotation = Quaternion.Slerp(
                transform.rotation,
                Quaternion.LookRotation((targetPosition - transform.position).normalized),
                Time.deltaTime * 8f
            );

            if (combat.ShouldReload(blackboard))
            {
                combat.StartReload(blackboard, this);
            }

            if (distance > profile.preferredCombatDistance)
            {
                movement.MoveTo(targetPosition, profile.runSpeed);
            }
            else
            {
                movement.Stop();
            }

            combat.TryFireAt(blackboard, profile);
        }

        private void ExecuteTakeCover()
        {
            if (blackboard.CurrentCoverPoint != null)
            {
                movement.MoveTo(blackboard.CurrentCoverPoint.position, profile.runSpeed);
                return;
            }

            ExecuteRetreat();
        }

        private void ExecuteHealing()
        {
            movement.Stop();

            if (blackboard.TimeInCurrentState >= 2.2f)
            {
                blackboard.Health01 = Mathf.Clamp01(blackboard.Health01 + 0.45f);
                blackboard.HasHealingItem = false;
            }
        }

        private void ExecuteRetreat()
        {
            var away = blackboard.CanSeeEnemy
                ? (transform.position - blackboard.CurrentTarget.position).normalized
                : -transform.forward;

            var retreatPoint = transform.position + away * 18f;
            movement.MoveTo(retreatPoint, profile.runSpeed);
        }

        private void ExecuteTempleObjective()
        {
            if (blackboard.CurrentTempleObjective == null)
            {
                ExecutePatrol();
                return;
            }

            movement.MoveTo(blackboard.CurrentTempleObjective.position, profile.runSpeed);
        }

        private void ExecutePatrol()
        {
            if (Vector3.Distance(transform.position, patrolPoint) <= 2f || !movement.HasPath)
            {
                patrolPoint = movement.PickPatrolPoint(transform.position, patrolRadius);
            }

            movement.MoveTo(patrolPoint, profile.walkSpeed);
        }

        private void OnGUI()
        {
            if (!debugState)
            {
                return;
            }

            var screen = Camera.main != null
                ? Camera.main.WorldToScreenPoint(transform.position + Vector3.up * 2.2f)
                : Vector3.zero;

            if (screen.z < 0f)
            {
                return;
            }

            GUI.Label(
                new Rect(screen.x - 90f, Screen.height - screen.y, 180f, 42f),
                $"{blackboard.CurrentState}\n{blackboard.LastDecisionReason}"
            );
        }
    }
}
