using UnityEngine;

namespace TempleFall.Bots
{
    public readonly struct BotDifficultyMix
    {
        public BotDifficultyMix(float easy, float normal, float hard)
        {
            Easy = Mathf.Clamp01(easy);
            Normal = Mathf.Clamp01(normal);
            Hard = Mathf.Clamp01(hard);
        }

        public float Easy { get; }
        public float Normal { get; }
        public float Hard { get; }

        public BotDifficulty Pick()
        {
            var total = Mathf.Max(Easy + Normal + Hard, 0.001f);
            var roll = Random.value * total;

            if (roll <= Easy)
            {
                return BotDifficulty.Easy;
            }

            if (roll <= Easy + Normal)
            {
                return BotDifficulty.Normal;
            }

            return BotDifficulty.Hard;
        }
    }

    public static class BotDifficultyScaler
    {
        public static BotDifficultyMix GetMixForPlayerLevel(int playerLevel)
        {
            if (playerLevel <= 3)
            {
                return new BotDifficultyMix(0.70f, 0.30f, 0.00f);
            }

            if (playerLevel <= 8)
            {
                return new BotDifficultyMix(0.40f, 0.50f, 0.10f);
            }

            if (playerLevel <= 15)
            {
                return new BotDifficultyMix(0.20f, 0.55f, 0.25f);
            }

            return new BotDifficultyMix(0.10f, 0.45f, 0.45f);
        }

        public static TempleFallBotProfile CreateRuntimeProfileForPlayerLevel(int playerLevel)
        {
            var difficulty = GetMixForPlayerLevel(playerLevel).Pick();
            return TempleFallBotProfile.RuntimeDefault(difficulty);
        }
    }
}

