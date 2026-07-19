using TempleFall.World;
using UnityEngine;

namespace TempleFall.Bots
{
    public sealed class BotSafeZoneAwareness : MonoBehaviour
    {
        [SerializeField] private SafeZoneInfo safeZone;

        public void SetSafeZone(SafeZoneInfo zone)
        {
            safeZone = zone;
        }

        public void Sense(BotBlackboard blackboard)
        {
            if (safeZone == null)
            {
                blackboard.IsInsideSafeZone = true;
                blackboard.DistanceToSafeZone = 0f;
                return;
            }

            blackboard.SafeZone = safeZone;
            blackboard.IsInsideSafeZone = safeZone.Contains(transform.position);
            blackboard.DistanceToSafeZone = safeZone.DistanceOutside(transform.position);
        }

        public Vector3 GetSafeMovePoint()
        {
            return safeZone == null ? transform.position : safeZone.ClosestSafePoint(transform.position);
        }
    }
}

