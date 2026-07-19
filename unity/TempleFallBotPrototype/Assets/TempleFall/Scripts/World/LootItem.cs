using TempleFall.Weapons;
using UnityEngine;

namespace TempleFall.World
{
    public enum LootKind
    {
        Weapon,
        Ammo,
        Healing,
        Shield,
        Coins,
        TempleKey,
        ObjectiveItem
    }

    public sealed class LootItem : MonoBehaviour
    {
        public LootKind kind = LootKind.Weapon;
        public WeaponDefinition weapon;
        public int amount = 1;
        public bool isClaimed;

        public float ScoreForBot(bool botHasWeapon, bool botNeedsHealing, bool botNeedsAmmo)
        {
            if (isClaimed)
            {
                return -1f;
            }

            switch (kind)
            {
                case LootKind.Weapon:
                    return botHasWeapon ? 0.45f : 1f;
                case LootKind.Ammo:
                    return botNeedsAmmo ? 0.9f : 0.35f;
                case LootKind.Healing:
                    return botNeedsHealing ? 0.95f : 0.4f;
                case LootKind.Shield:
                    return 0.55f;
                case LootKind.TempleKey:
                    return 0.85f;
                case LootKind.ObjectiveItem:
                    return 0.75f;
                default:
                    return 0.25f;
            }
        }
    }
}

