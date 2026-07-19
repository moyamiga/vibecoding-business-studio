using UnityEngine;

namespace TempleFall.Bots
{
    [CreateAssetMenu(menuName = "TempleFall/Bots/Bot Profile")]
    public sealed class TempleFallBotProfile : ScriptableObject
    {
        [Header("Identity")]
        public string botName = "Explorer Bot";
        public BotDifficulty difficulty = BotDifficulty.Normal;

        [Header("Perception")]
        [Min(1f)] public float viewDistance = 45f;
        [Range(10f, 180f)] public float fieldOfView = 95f;
        [Min(0.1f)] public float reactionTime = 0.45f;

        [Header("Movement")]
        [Min(0.1f)] public float walkSpeed = 3.5f;
        [Min(0.1f)] public float runSpeed = 6.5f;
        [Min(0.1f)] public float safeZoneUrgencyDistance = 35f;

        [Header("Combat")]
        [Range(0f, 1f)] public float aimAccuracy = 0.55f;
        [Range(0f, 1f)] public float aggression = 0.5f;
        [Range(0f, 1f)] public float coverPreference = 0.45f;
        [Min(0.1f)] public float preferredCombatDistance = 18f;

        [Header("Survival")]
        [Range(0f, 1f)] public float healingHealthThreshold = 0.35f;
        [Range(0f, 1f)] public float retreatHealthThreshold = 0.2f;

        [Header("Objectives")]
        [Range(0f, 1f)] public float templeObjectiveInterest = 0.35f;
        [Range(0f, 1f)] public float lootGreed = 0.6f;

        public static TempleFallBotProfile RuntimeDefault(BotDifficulty difficulty)
        {
            var profile = CreateInstance<TempleFallBotProfile>();
            profile.difficulty = difficulty;

            switch (difficulty)
            {
                case BotDifficulty.Easy:
                    profile.botName = "Easy Explorer";
                    profile.aimAccuracy = 0.28f;
                    profile.aggression = 0.25f;
                    profile.reactionTime = 0.9f;
                    profile.coverPreference = 0.2f;
                    break;
                case BotDifficulty.Hard:
                    profile.botName = "Hard Explorer";
                    profile.aimAccuracy = 0.72f;
                    profile.aggression = 0.72f;
                    profile.reactionTime = 0.25f;
                    profile.coverPreference = 0.65f;
                    profile.templeObjectiveInterest = 0.65f;
                    break;
                default:
                    profile.botName = "Normal Explorer";
                    break;
            }

            return profile;
        }
    }
}

