using UnityEngine;

namespace TempleFall.World
{
    public sealed class SafeZoneInfo : MonoBehaviour
    {
        [SerializeField] private Transform center;
        [SerializeField] private float radius = 120f;
        [SerializeField] private int phase = 1;

        public Vector3 Center => center != null ? center.position : transform.position;
        public float Radius => radius;
        public int Phase => phase;

        public bool Contains(Vector3 position)
        {
            var flatCenter = new Vector2(Center.x, Center.z);
            var flatPosition = new Vector2(position.x, position.z);
            return Vector2.Distance(flatCenter, flatPosition) <= radius;
        }

        public float DistanceOutside(Vector3 position)
        {
            var flatCenter = new Vector2(Center.x, Center.z);
            var flatPosition = new Vector2(position.x, position.z);
            return Mathf.Max(0f, Vector2.Distance(flatCenter, flatPosition) - radius);
        }

        public Vector3 ClosestSafePoint(Vector3 position)
        {
            var direction = position - Center;
            direction.y = 0f;

            if (direction.sqrMagnitude <= 0.001f)
            {
                return Center;
            }

            return Center + direction.normalized * Mathf.Min(direction.magnitude, radius * 0.85f);
        }
    }
}

