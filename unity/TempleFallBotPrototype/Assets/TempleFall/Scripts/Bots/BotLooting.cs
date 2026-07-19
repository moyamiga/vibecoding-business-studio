using TempleFall.World;
using UnityEngine;

namespace TempleFall.Bots
{
    public sealed class BotLooting : MonoBehaviour
    {
        [SerializeField] private float scanRadius = 28f;
        [SerializeField] private LayerMask lootMask = ~0;

        private readonly Collider[] hits = new Collider[32];

        public void Scan(BotBlackboard blackboard)
        {
            blackboard.HasUsefulLootNearby = false;
            blackboard.CurrentLootTarget = null;

            var count = Physics.OverlapSphereNonAlloc(transform.position, scanRadius, hits, lootMask);
            LootItem bestLoot = null;
            var bestScore = float.MinValue;

            for (var i = 0; i < count; i++)
            {
                var loot = hits[i].GetComponentInParent<LootItem>();
                if (loot == null)
                {
                    continue;
                }

                var score = loot.ScoreForBot(
                    blackboard.HasWeapon,
                    blackboard.Health01 < 0.65f,
                    blackboard.ReserveAmmo <= 10
                );

                var distancePenalty = Vector3.Distance(transform.position, loot.transform.position) * 0.015f;
                score -= distancePenalty;

                if (score > bestScore)
                {
                    bestScore = score;
                    bestLoot = loot;
                }
            }

            if (bestLoot == null || bestScore <= 0f)
            {
                return;
            }

            blackboard.HasUsefulLootNearby = true;
            blackboard.CurrentLootTarget = bestLoot.transform;
        }

        public void ClaimLoot(BotBlackboard blackboard)
        {
            if (blackboard.CurrentLootTarget == null)
            {
                return;
            }

            var loot = blackboard.CurrentLootTarget.GetComponent<LootItem>();
            if (loot == null || loot.isClaimed)
            {
                return;
            }

            loot.isClaimed = true;

            switch (loot.kind)
            {
                case LootKind.Weapon:
                    if (loot.weapon != null)
                    {
                        blackboard.EquippedWeapon = loot.weapon;
                        blackboard.AmmoInWeapon = loot.weapon.magazineSize;
                    }
                    break;
                case LootKind.Ammo:
                    blackboard.ReserveAmmo += Mathf.Max(loot.amount, 1);
                    break;
                case LootKind.Healing:
                    blackboard.HasHealingItem = true;
                    break;
                case LootKind.Shield:
                    blackboard.Shield01 = Mathf.Clamp01(blackboard.Shield01 + 0.25f);
                    break;
            }
        }
    }
}

