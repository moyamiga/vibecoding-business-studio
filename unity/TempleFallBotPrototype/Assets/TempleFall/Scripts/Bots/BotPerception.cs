using UnityEngine;

namespace TempleFall.Bots
{
    public sealed class BotPerception : MonoBehaviour
    {
        [SerializeField] private LayerMask enemyMask = ~0;
        [SerializeField] private LayerMask obstructionMask = ~0;
        [SerializeField] private Transform eyePoint;

        private readonly Collider[] hits = new Collider[24];

        public void Sense(BotBlackboard blackboard, TempleFallBotProfile profile)
        {
            blackboard.CanSeeEnemy = false;
            blackboard.CurrentTarget = null;

            var origin = eyePoint != null ? eyePoint.position : transform.position + Vector3.up * 1.6f;
            var count = Physics.OverlapSphereNonAlloc(origin, profile.viewDistance, hits, enemyMask);

            Transform bestTarget = null;
            var bestScore = float.MinValue;

            for (var i = 0; i < count; i++)
            {
                var candidate = hits[i].transform;
                if (candidate == transform)
                {
                    continue;
                }

                var toCandidate = candidate.position - origin;
                var distance = toCandidate.magnitude;
                if (distance <= 0.01f)
                {
                    continue;
                }

                var angle = Vector3.Angle(transform.forward, toCandidate.normalized);
                if (angle > profile.fieldOfView * 0.5f)
                {
                    continue;
                }

                if (Physics.Raycast(origin, toCandidate.normalized, out var rayHit, distance, obstructionMask))
                {
                    if (rayHit.transform != candidate && !rayHit.transform.IsChildOf(candidate))
                    {
                        continue;
                    }
                }

                var score = (profile.viewDistance - distance) + (profile.fieldOfView - angle) * 0.1f;
                if (score > bestScore)
                {
                    bestScore = score;
                    bestTarget = candidate;
                }
            }

            if (bestTarget == null)
            {
                return;
            }

            blackboard.CanSeeEnemy = true;
            blackboard.CurrentTarget = bestTarget;
            blackboard.LastKnownEnemyPosition = bestTarget.position;
            blackboard.DistanceToEnemy = Vector3.Distance(transform.position, bestTarget.position);
            blackboard.TimeSinceLastSawEnemy = 0f;
        }
    }
}

