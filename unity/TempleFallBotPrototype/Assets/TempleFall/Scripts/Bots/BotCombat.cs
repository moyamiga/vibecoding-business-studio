using TempleFall.Weapons;
using UnityEngine;

namespace TempleFall.Bots
{
    public sealed class BotCombat : MonoBehaviour
    {
        [SerializeField] private Transform muzzlePoint;
        [SerializeField] private LayerMask hitMask = ~0;

        private float nextFireTime;

        public bool TryFireAt(BotBlackboard blackboard, TempleFallBotProfile profile)
        {
            if (!blackboard.CanFight || blackboard.CurrentTarget == null)
            {
                return false;
            }

            var weapon = blackboard.EquippedWeapon;
            if (Time.time < nextFireTime)
            {
                return false;
            }

            if (blackboard.DistanceToEnemy > weapon.effectiveRange * 1.25f)
            {
                return false;
            }

            var origin = muzzlePoint != null ? muzzlePoint.position : transform.position + Vector3.up * 1.4f;
            var targetPoint = blackboard.CurrentTarget.position + Vector3.up * 1.2f;
            var direction = (targetPoint - origin).normalized;
            direction = ApplyInaccuracy(direction, weapon, profile);

            if (Physics.Raycast(origin, direction, out var hit, weapon.effectiveRange, hitMask))
            {
                var damageable = hit.collider.GetComponentInParent<IDamageable>();
                damageable?.TakeDamage(weapon.damage, gameObject);
            }

            blackboard.AmmoInWeapon--;
            nextFireTime = Time.time + weapon.fireInterval;
            return true;
        }

        public bool ShouldReload(BotBlackboard blackboard)
        {
            if (!blackboard.HasWeapon || blackboard.IsReloading)
            {
                return false;
            }

            return blackboard.AmmoInWeapon <= 0 && blackboard.ReserveAmmo > 0;
        }

        public void StartReload(BotBlackboard blackboard, MonoBehaviour runner)
        {
            if (!ShouldReload(blackboard))
            {
                return;
            }

            runner.StartCoroutine(ReloadRoutine(blackboard));
        }

        private System.Collections.IEnumerator ReloadRoutine(BotBlackboard blackboard)
        {
            blackboard.IsReloading = true;
            yield return new WaitForSeconds(blackboard.EquippedWeapon.reloadDuration);

            var needed = blackboard.EquippedWeapon.magazineSize - blackboard.AmmoInWeapon;
            var loaded = Mathf.Min(needed, blackboard.ReserveAmmo);
            blackboard.AmmoInWeapon += loaded;
            blackboard.ReserveAmmo -= loaded;
            blackboard.IsReloading = false;
        }

        private static Vector3 ApplyInaccuracy(Vector3 direction, WeaponDefinition weapon, TempleFallBotProfile profile)
        {
            var accuracy = Mathf.Clamp01(profile.aimAccuracy);
            var spread = weapon.spreadDegrees * (1f - accuracy);
            var yaw = Random.Range(-spread, spread);
            var pitch = Random.Range(-spread, spread);
            return Quaternion.Euler(pitch, yaw, 0f) * direction;
        }
    }

    public interface IDamageable
    {
        void TakeDamage(float amount, GameObject source);
    }
}

