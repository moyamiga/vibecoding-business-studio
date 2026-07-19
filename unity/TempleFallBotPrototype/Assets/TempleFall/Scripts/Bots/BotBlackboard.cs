using TempleFall.World;
using TempleFall.Weapons;
using UnityEngine;

namespace TempleFall.Bots
{
    public sealed class BotBlackboard
    {
        public BotState CurrentState { get; set; } = BotState.Spawning;
        public string LastDecisionReason { get; set; } = "Initial spawn";

        public Transform Self { get; set; }
        public Transform CurrentTarget { get; set; }
        public Transform CurrentLootTarget { get; set; }
        public Transform CurrentCoverPoint { get; set; }
        public Transform CurrentTempleObjective { get; set; }

        public WeaponDefinition EquippedWeapon { get; set; }
        public SafeZoneInfo SafeZone { get; set; }

        public float Health01 { get; set; } = 1f;
        public float Shield01 { get; set; } = 0f;
        public int AmmoInWeapon { get; set; }
        public int ReserveAmmo { get; set; }
        public bool HasHealingItem { get; set; }
        public bool IsInsideSafeZone { get; set; } = true;
        public bool CanSeeEnemy { get; set; }
        public bool HeardCombatRecently { get; set; }
        public bool HasUsefulLootNearby { get; set; }
        public bool HasTempleObjectiveNearby { get; set; }
        public bool IsReloading { get; set; }
        public bool IsEliminated { get; set; }

        public float DistanceToSafeZone { get; set; }
        public float DistanceToEnemy { get; set; } = float.MaxValue;
        public float TimeSinceLastSawEnemy { get; set; } = float.MaxValue;
        public float TimeInCurrentState { get; set; }

        public Vector3 LastKnownEnemyPosition { get; set; }
        public Vector3 DesiredMovePosition { get; set; }

        public bool HasWeapon => EquippedWeapon != null;
        public bool NeedsAmmo => HasWeapon && AmmoInWeapon <= 0 && ReserveAmmo > 0;
        public bool IsLowHealth(float threshold) => Health01 <= threshold;
        public bool CanFight => HasWeapon && AmmoInWeapon > 0 && !IsReloading;

        public void Tick(float deltaTime)
        {
            TimeInCurrentState += deltaTime;
            TimeSinceLastSawEnemy += deltaTime;
        }

        public void ChangeState(BotDecision decision)
        {
            if (CurrentState == decision.NextState)
            {
                LastDecisionReason = decision.Reason;
                return;
            }

            CurrentState = decision.NextState;
            LastDecisionReason = decision.Reason;
            TimeInCurrentState = 0f;
        }
    }
}

