import { GameObjects, Math as PhaserMath, Scene } from 'phaser';

type BotDifficulty = 'facil' | 'normal' | 'dificil';
type WeaponKind = 'none' | 'pistol' | 'rifle' | 'shotgun' | 'mythic';
type LootKind = Exclude<WeaponKind, 'none'> | 'medkit' | 'shield' | 'relic';

type Bot = {
    body: GameObjects.Arc;
    hp: number;
    speed: number;
    touchDamage: number;
    difficulty: BotDifficulty;
    target: PhaserMath.Vector2;
};

type Loot = {
    body: GameObjects.Rectangle;
    kind: LootKind;
};

type TempleObjective = {
    body: GameObjects.Star;
    active: boolean;
};

export class Game extends Scene
{
    private player!: GameObjects.Arc;
    private safeZone!: GameObjects.Graphics;
    private hud!: GameObjects.Text;
    private message!: GameObjects.Text;
    private secretRoom?: GameObjects.Rectangle;
    private vendingMachine?: GameObjects.Rectangle;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<string, Phaser.Input.Keyboard.Key>;

    private bots: Bot[] = [];
    private loot: Loot[] = [];
    private objectives: TempleObjective[] = [];
    private moveTarget?: PhaserMath.Vector2;
    private safeCenter = new PhaserMath.Vector2(0, 0);

    private playerHp = 100;
    private playerShield = 50;
    private playerLevel = 1;
    private weapon: WeaponKind = 'none';
    private ammo = 0;
    private relics = 0;
    private eliminations = 0;
    private safeRadius = 150;
    private maxSafeRadius = 150;
    private elapsedSeconds = 0;
    private vendingCooldown = 0;
    private secretRoomOpen = false;
    private gameEnded = false;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.resetMatch();
        this.drawMap();
        this.createPlayer();
        this.createLoot();
        this.createObjectives();
        this.createBots();
        this.createHud();
        this.registerInput();
        this.updateHud('Toca el piso para moverte. Toca bots para disparar.');
    }

    update (_time: number, deltaMs: number)
    {
        if (this.gameEnded)
        {
            return;
        }

        const delta = deltaMs / 1000;
        this.elapsedSeconds += delta;
        this.vendingCooldown = Math.max(0, this.vendingCooldown - delta);
        this.safeRadius = Math.max(this.maxSafeRadius * 0.32, this.maxSafeRadius - this.elapsedSeconds * 1.9);

        this.movePlayer(delta);
        this.updateBots(delta);
        this.pickupLoot();
        this.updateTempleObjectives();
        this.updateVendingMachine();
        this.applyVegetationDamage(delta);
        this.drawSafeZone();
        this.checkEndState();
        this.updateHud();
    }

    private resetMatch ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.safeCenter.set(width / 2, height * 0.48);
        this.maxSafeRadius = Math.min(width, height) * 0.46;
        this.safeRadius = this.maxSafeRadius;
        this.bots = [];
        this.loot = [];
        this.objectives = [];
        this.moveTarget = undefined;
        this.playerHp = 100;
        this.playerShield = 50;
        this.weapon = 'none';
        this.ammo = 0;
        this.relics = 0;
        this.eliminations = 0;
        this.elapsedSeconds = 0;
        this.vendingCooldown = 0;
        this.secretRoomOpen = false;
        this.gameEnded = false;
    }

    private drawMap ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;

        this.cameras.main.setBackgroundColor('#184a29');
        this.add.rectangle(centerX, height / 2, width, height, 0x184a29);

        for (let i = 0; i < 34; i++)
        {
            const x = 18 + (i * 47) % Math.max(width - 36, 1);
            const y = 70 + (i * 83) % Math.max(height - 160, 1);
            this.add.circle(x, y, 12 + (i % 4) * 7, 0x2f7a40).setAlpha(0.46);
        }

        const templeY = height * 0.43;
        this.add.rectangle(centerX, templeY + 55, width * 0.52, 132, 0x6b5737);
        this.add.triangle(
            centerX,
            templeY - 72,
            centerX - width * 0.25,
            templeY + 20,
            centerX,
            templeY - 120,
            centerX + width * 0.25,
            templeY + 20,
            0x9a7b45
        );
        this.secretRoom = this.add.rectangle(centerX, templeY + 78, width * 0.18, 74, 0x2a1f17)
            .setStrokeStyle(3, 0x111111);
        this.add.text(centerX, templeY + 145, 'TEMPLO', {
            fontFamily: 'Arial Black',
            fontSize: Math.min(18, width * 0.05),
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.vendingMachine = this.add.rectangle(width * 0.82, height * 0.66, 40, 62, 0x2f85ff)
            .setStrokeStyle(3, 0xffffff);
        this.add.text(width * 0.82, height * 0.72, '30 REL', {
            fontFamily: 'Arial Black',
            fontSize: 12,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.safeZone = this.add.graphics();
        this.drawSafeZone();
    }

    private createPlayer ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.player = this.add.circle(width / 2, height - 76, 16, 0xe1b84a)
            .setStrokeStyle(4, 0xffffff);
    }

    private createLoot ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.spawnLoot(width * 0.28, height * 0.80, 'pistol', 0xffffff);
        this.spawnLoot(width * 0.72, height * 0.77, 'rifle', 0x3d8bff);
        this.spawnLoot(width * 0.25, height * 0.56, 'shotgun', 0x9b59ff);
        this.spawnLoot(width * 0.72, height * 0.39, 'shield', 0x45d9ff);
        this.spawnLoot(width * 0.30, height * 0.36, 'medkit', 0xff5252);
        this.spawnLoot(width * 0.78, height * 0.54, 'relic', 0xe1b84a);
    }

    private spawnLoot (x: number, y: number, kind: LootKind, color: number)
    {
        const body = this.add.rectangle(x, y, 25, 17, color)
            .setStrokeStyle(2, 0x111111);
        this.loot.push({ body, kind });
    }

    private createObjectives ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const templeY = height * 0.43;

        [
            [centerX - width * 0.25, templeY + 15],
            [centerX + width * 0.25, templeY + 15],
            [centerX - width * 0.18, templeY + 115],
            [centerX + width * 0.18, templeY + 115],
            [centerX, templeY - 55]
        ].forEach(([x, y]) => {
            const body = this.add.star(x, y, 5, 7, 17, 0xffef77)
                .setStrokeStyle(2, 0x3d2f22);
            this.objectives.push({ body, active: true });
        });
    }

    private createBots ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const positions = [
            [0.18, 0.20],
            [0.52, 0.18],
            [0.82, 0.23],
            [0.18, 0.45],
            [0.82, 0.45],
            [0.20, 0.68],
            [0.50, 0.66],
            [0.82, 0.78],
            [0.50, 0.31]
        ];

        positions.forEach(([px, py], index) => {
            const difficulty = this.pickBotDifficulty(index);
            const color = difficulty === 'dificil' ? 0xff3030 : difficulty === 'normal' ? 0xff8a3d : 0xffc15a;
            const x = width * px;
            const y = height * py;
            const body = this.add.circle(x, y, 14, color).setStrokeStyle(3, 0x220000);
            this.bots.push({
                body,
                hp: difficulty === 'dificil' ? 105 : difficulty === 'normal' ? 85 : 65,
                speed: difficulty === 'dificil' ? 74 : difficulty === 'normal' ? 61 : 48,
                touchDamage: difficulty === 'dificil' ? 18 : difficulty === 'normal' ? 13 : 8,
                difficulty,
                target: new PhaserMath.Vector2(x, y)
            });
        });
    }

    private pickBotDifficulty (index: number): BotDifficulty
    {
        if (this.playerLevel <= 3)
        {
            return index < 6 ? 'facil' : 'normal';
        }

        if (this.playerLevel <= 8)
        {
            return index < 4 ? 'facil' : index < 8 ? 'normal' : 'dificil';
        }

        return index < 2 ? 'facil' : index < 7 ? 'normal' : 'dificil';
    }

    private createHud ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.hud = this.add.text(10, 10, '', {
            fontFamily: 'Arial Black',
            fontSize: 13,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        const fireButton = this.add.circle(width - 62, height - 94, 38, 0xe1b84a)
            .setStrokeStyle(4, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.add.text(width - 62, height - 94, 'FIRE', {
            fontFamily: 'Arial Black',
            fontSize: 15,
            color: '#071f10'
        }).setOrigin(0.5);

        fireButton.on('pointerdown', () => this.shootNearestFromButton());
        fireButton.on('pointerup', () => this.shootNearestFromButton());

        this.add.text(62, height - 94, 'Toca piso\npara mover', {
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        this.message = this.add.text(width / 2, height - 24, '', {
            fontFamily: 'Arial',
            fontSize: 14,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 24 }
        }).setOrigin(0.5);
    }

    private registerInput ()
    {
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.wasd = this.input.keyboard?.addKeys('W,A,S,D,SPACE') as Record<string, Phaser.Input.Keyboard.Key>;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.gameEnded)
            {
                this.scene.start('MainMenu');
                return;
            }

            if (this.isFireButtonArea(pointer.worldX, pointer.worldY))
            {
                return;
            }

            const bot = this.findBotNear(pointer.worldX, pointer.worldY, 32);
            if (bot)
            {
                this.tryShoot(bot);
                return;
            }

            this.moveTarget = new PhaserMath.Vector2(pointer.worldX, pointer.worldY);
        });

        this.input.keyboard?.on('keydown-SPACE', () => {
            const nearest = this.findNearestBot(130);
            if (nearest)
            {
                this.tryShoot(nearest);
            }
        });
    }

    private isFireButtonArea (x: number, y: number)
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        return PhaserMath.Distance.Between(x, y, width - 62, height - 94) <= 54;
    }

    private shootNearestFromButton ()
    {
        if (this.gameEnded)
        {
            return;
        }

        const nearest = this.findNearestBot(180);
        if (!nearest)
        {
            this.updateHud('No hay bot cerca para disparar.');
            return;
        }

        this.tryShoot(nearest);
    }

    private movePlayer (delta: number)
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const speed = Math.min(width, height) * 0.48;
        const velocity = new PhaserMath.Vector2(0, 0);

        if (this.cursors?.left.isDown || this.wasd?.A.isDown) velocity.x -= 1;
        if (this.cursors?.right.isDown || this.wasd?.D.isDown) velocity.x += 1;
        if (this.cursors?.up.isDown || this.wasd?.W.isDown) velocity.y -= 1;
        if (this.cursors?.down.isDown || this.wasd?.S.isDown) velocity.y += 1;

        if (velocity.lengthSq() > 0)
        {
            this.moveTarget = undefined;
            velocity.normalize().scale(speed * delta);
            this.player.x = PhaserMath.Clamp(this.player.x + velocity.x, 18, width - 18);
            this.player.y = PhaserMath.Clamp(this.player.y + velocity.y, 54, height - 48);
            return;
        }

        if (!this.moveTarget) return;

        const toTarget = this.moveTarget.clone().subtract(new PhaserMath.Vector2(this.player.x, this.player.y));
        if (toTarget.length() < 8)
        {
            this.moveTarget = undefined;
            return;
        }

        toTarget.normalize().scale(speed * delta);
        this.player.x = PhaserMath.Clamp(this.player.x + toTarget.x, 18, width - 18);
        this.player.y = PhaserMath.Clamp(this.player.y + toTarget.y, 54, height - 48);
    }

    private updateBots (delta: number)
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        for (const bot of this.bots)
        {
            const distanceToPlayer = PhaserMath.Distance.Between(bot.body.x, bot.body.y, this.player.x, this.player.y);

            if (distanceToPlayer < 140 && this.weapon !== 'none')
            {
                bot.target.set(this.player.x, this.player.y);
            }
            else if (PhaserMath.Distance.Between(bot.body.x, bot.body.y, bot.target.x, bot.target.y) < 10)
            {
                bot.target.set(30 + Math.random() * (width - 60), 75 + Math.random() * (height - 150));
            }

            const movement = bot.target.clone().subtract(new PhaserMath.Vector2(bot.body.x, bot.body.y));
            if (movement.lengthSq() > 0)
            {
                movement.normalize().scale(bot.speed * delta);
                bot.body.x += movement.x;
                bot.body.y += movement.y;
            }

            if (distanceToPlayer < 28)
            {
                this.damagePlayer(bot.touchDamage * delta);
            }
        }
    }

    private pickupLoot ()
    {
        for (const item of [...this.loot])
        {
            const distance = PhaserMath.Distance.Between(this.player.x, this.player.y, item.body.x, item.body.y);
            if (distance > 31) continue;

            if (item.kind === 'medkit')
            {
                this.playerHp = Math.min(100, this.playerHp + 35);
                this.updateHud('Botiquin: +35 vida.');
            }
            else if (item.kind === 'shield')
            {
                this.playerShield = Math.min(100, this.playerShield + 45);
                this.updateHud('Escudo: +45.');
            }
            else if (item.kind === 'relic')
            {
                this.relics += 25;
                this.updateHud('Reliquias: +25.');
            }
            else
            {
                this.weapon = item.kind;
                this.ammo = item.kind === 'shotgun' ? 6 : item.kind === 'rifle' ? 24 : item.kind === 'mythic' ? 18 : 12;
                this.updateHud(`Arma: ${this.weaponName()}.`);
            }

            item.body.destroy();
            this.loot = this.loot.filter((loot) => loot !== item);
        }
    }

    private updateTempleObjectives ()
    {
        for (const objective of this.objectives)
        {
            if (!objective.active) continue;

            const distance = PhaserMath.Distance.Between(this.player.x, this.player.y, objective.body.x, objective.body.y);
            if (distance > 28) continue;

            objective.active = false;
            objective.body.setFillStyle(0x53624b);
            this.relics += 10;
            this.updateHud('Mision del templo activada.');
        }

        if (!this.secretRoomOpen && this.objectives.every((objective) => !objective.active))
        {
            this.openSecretRoom();
        }
    }

    private openSecretRoom ()
    {
        this.secretRoomOpen = true;
        this.secretRoom?.setFillStyle(0xe1b84a);
        this.secretRoom?.setStrokeStyle(4, 0xff3030);
        this.spawnLoot(this.cameras.main.width / 2, this.cameras.main.height * 0.52, 'mythic', 0xff3030);
        this.updateHud('Sala secreta abierta: Rifle Serpiente Solar.');
    }

    private updateVendingMachine ()
    {
        if (!this.vendingMachine || this.vendingCooldown > 0) return;

        const distance = PhaserMath.Distance.Between(this.player.x, this.player.y, this.vendingMachine.x, this.vendingMachine.y);
        if (distance > 40) return;

        if (this.relics < 30)
        {
            this.updateHud('Maquina: necesitas 30 reliquias.');
            this.vendingCooldown = 2.2;
            return;
        }

        if (this.playerShield < 100)
        {
            this.relics -= 30;
            this.playerShield = Math.min(100, this.playerShield + 40);
            this.vendingCooldown = 2.2;
            this.updateHud('Maquina: compraste escudo.');
            return;
        }

        if (this.weapon === 'none')
        {
            this.updateHud('Maquina: necesitas arma para municion.');
            this.vendingCooldown = 2.2;
            return;
        }

        this.relics -= 30;
        this.ammo += this.weapon === 'shotgun' ? 3 : 10;
        this.vendingCooldown = 2.2;
        this.updateHud('Maquina: compraste municion.');
    }

    private tryShoot (bot: Bot)
    {
        if (this.weapon === 'none')
        {
            this.updateHud('Recoge un arma primero.');
            return;
        }
        if (this.ammo <= 0)
        {
            this.updateHud('Sin municion.');
            return;
        }

        const distance = PhaserMath.Distance.Between(this.player.x, this.player.y, bot.body.x, bot.body.y);
        const range = this.weapon === 'shotgun' ? 90 : this.weapon === 'rifle' ? 155 : this.weapon === 'mythic' ? 190 : 120;
        if (distance > range)
        {
            this.updateHud('Bot fuera de rango.');
            return;
        }

        const damage = this.weapon === 'shotgun' ? 55 : this.weapon === 'rifle' ? 34 : this.weapon === 'mythic' ? 46 : 28;
        bot.hp -= damage;
        this.ammo--;

        const shot = this.add.line(0, 0, this.player.x, this.player.y, bot.body.x, bot.body.y, this.weapon === 'mythic' ? 0xff3030 : 0xe1b84a)
            .setOrigin(0, 0)
            .setLineWidth(3);
        this.time.delayedCall(90, () => shot.destroy());

        if (bot.hp <= 0)
        {
            this.spawnLoot(bot.body.x, bot.body.y, 'relic', 0xe1b84a);
            bot.body.destroy();
            this.bots = this.bots.filter((entry) => entry !== bot);
            this.eliminations++;
            this.relics += 5;
            this.updateHud('Bot eliminado.');
        }
    }

    private applyVegetationDamage (delta: number)
    {
        const playerDistance = PhaserMath.Distance.Between(this.player.x, this.player.y, this.safeCenter.x, this.safeCenter.y);
        if (playerDistance > this.safeRadius)
        {
            this.damagePlayer((2 + this.elapsedSeconds / 35) * delta);
            this.updateHud('La vegetacion te alcanza.');
        }

        for (const bot of [...this.bots])
        {
            const botDistance = PhaserMath.Distance.Between(bot.body.x, bot.body.y, this.safeCenter.x, this.safeCenter.y);
            if (botDistance <= this.safeRadius) continue;

            bot.hp -= (4 + this.elapsedSeconds / 30) * delta;
            if (bot.hp > 0) continue;

            bot.body.destroy();
            this.bots = this.bots.filter((entry) => entry !== bot);
        }
    }

    private damagePlayer (amount: number)
    {
        if (this.playerShield > 0)
        {
            const shieldDamage = Math.min(this.playerShield, amount);
            this.playerShield -= shieldDamage;
            amount -= shieldDamage;
        }

        this.playerHp = Math.max(0, this.playerHp - amount);
    }

    private drawSafeZone ()
    {
        this.safeZone.clear();
        this.safeZone.lineStyle(3, 0xa7ff7a, 0.95);
        this.safeZone.strokeCircle(this.safeCenter.x, this.safeCenter.y, this.safeRadius);
        this.safeZone.lineStyle(12, 0x4e8f39, 0.16);
        this.safeZone.strokeCircle(this.safeCenter.x, this.safeCenter.y, this.safeRadius + 12);
    }

    private checkEndState ()
    {
        if (this.playerHp <= 0)
        {
            this.endMatch('Eliminado. Toca para volver.');
            return;
        }

        if (this.bots.length === 0)
        {
            this.endMatch('Victoria. Ultimo explorador en pie.');
        }
    }

    private endMatch (text: string)
    {
        this.gameEnded = true;
        this.message.setText(text);
        this.message.setColor('#ffe66b');
    }

    private findBotNear (x: number, y: number, radius: number)
    {
        return this.bots.find((bot) => PhaserMath.Distance.Between(x, y, bot.body.x, bot.body.y) <= radius);
    }

    private findNearestBot (maxDistance: number)
    {
        let nearest: Bot | undefined;
        let nearestDistance = maxDistance;

        for (const bot of this.bots)
        {
            const distance = PhaserMath.Distance.Between(this.player.x, this.player.y, bot.body.x, bot.body.y);
            if (distance < nearestDistance)
            {
                nearest = bot;
                nearestDistance = distance;
            }
        }

        return nearest;
    }

    private updateHud (status?: string)
    {
        this.hud?.setText([
            `Vida ${Math.ceil(this.playerHp)} | Esc ${Math.ceil(this.playerShield)} | Rel ${this.relics}`,
            `${this.weaponName()} | Mun ${this.ammo} | Bots ${this.bots.length}`,
            `Misiones ${this.objectives.filter((objective) => !objective.active).length}/5 | KOs ${this.eliminations}`,
            `Zona ${Math.ceil(this.safeRadius)}m | Nv ${this.playerLevel}`
        ]);

        if (status)
        {
            this.message?.setText(status);
        }
    }

    private weaponName ()
    {
        if (this.weapon === 'pistol') return 'Pistola';
        if (this.weapon === 'rifle') return 'Rifle';
        if (this.weapon === 'shotgun') return 'Escopeta';
        if (this.weapon === 'mythic') return 'Rifle Solar';
        return 'Sin arma';
    }
}
