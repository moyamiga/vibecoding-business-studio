using UnityEngine;
using UnityEngine.AI;

namespace TempleFall.Bots
{
    [RequireComponent(typeof(NavMeshAgent))]
    public sealed class BotMovement : MonoBehaviour
    {
        [SerializeField] private float destinationRefreshDistance = 1.5f;

        private NavMeshAgent agent;

        public bool HasPath => agent != null && agent.hasPath;
        public float RemainingDistance => agent != null ? agent.remainingDistance : float.MaxValue;

        private void Awake()
        {
            agent = GetComponent<NavMeshAgent>();
        }

        public void Configure(TempleFallBotProfile profile)
        {
            agent.speed = profile.walkSpeed;
            agent.angularSpeed = 540f;
            agent.acceleration = 20f;
            agent.stoppingDistance = 1.2f;
        }

        public void MoveTo(Vector3 position, float speed)
        {
            if (agent == null || !agent.enabled)
            {
                return;
            }

            agent.speed = speed;

            if (!agent.hasPath || Vector3.Distance(agent.destination, position) > destinationRefreshDistance)
            {
                agent.SetDestination(position);
            }
        }

        public void Stop()
        {
            if (agent == null || !agent.enabled)
            {
                return;
            }

            agent.ResetPath();
        }

        public Vector3 PickPatrolPoint(Vector3 center, float radius)
        {
            for (var i = 0; i < 10; i++)
            {
                var random = center + Random.insideUnitSphere * radius;
                random.y = center.y;

                if (NavMesh.SamplePosition(random, out var hit, 8f, NavMesh.AllAreas))
                {
                    return hit.position;
                }
            }

            return center;
        }
    }
}

