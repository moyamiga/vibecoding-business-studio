using UnityEngine;

namespace TempleFall.Weapons
{
    public enum WeaponRarity
    {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary,
        Mythic
    }

    public enum WeaponRole
    {
        Pistol,
        AssaultRifle,
        Shotgun,
        MythicRifle,
        Utility
    }

    [CreateAssetMenu(menuName = "TempleFall/Weapons/Weapon Definition")]
    public sealed class WeaponDefinition : ScriptableObject
    {
        public string displayName = "Pistol";
        public WeaponRole role = WeaponRole.Pistol;
        public WeaponRarity rarity = WeaponRarity.Common;

        [Header("Combat")]
        [Min(1f)] public float damage = 22f;
        [Min(0.01f)] public float fireInterval = 0.32f;
        [Min(1f)] public float effectiveRange = 25f;
        [Min(1)] public int magazineSize = 12;
        [Min(0.1f)] public float reloadDuration = 1.4f;
        [Range(0f, 10f)] public float spreadDegrees = 2.5f;

        [Header("Bot Use")]
        [Min(1f)] public float idealBotDistance = 18f;
        [Range(0f, 1f)] public float botConfidenceBonus = 0.1f;

        public float ScoreForDistance(float distance)
        {
            var distanceError = Mathf.Abs(distance - idealBotDistance);
            var distanceScore = Mathf.Clamp01(1f - distanceError / Mathf.Max(idealBotDistance, 1f));
            var rarityBonus = (int)rarity * 0.08f;
            return distanceScore + rarityBonus + botConfidenceBonus;
        }
    }
}

