import { GameObjects, Scene } from 'phaser';

export class MainMenu extends Scene
{
    private started = false;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.started = false;

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;

        this.cameras.main.setBackgroundColor('#154c2a');
        this.drawJungleBackground(width, height);
        this.drawTemple(width, height);
        this.drawExplorer(centerX, height);
        this.drawTitle(centerX, height);
        this.drawStartPanel(width, height);
    }

    private drawJungleBackground (width: number, height: number)
    {
        this.add.rectangle(width / 2, height / 2, width, height, 0x154c2a);
        this.add.rectangle(width / 2, height * 0.76, width, height * 0.52, 0x236637);

        for (let i = 0; i < 26; i++)
        {
            const x = (i * 47) % Math.max(width, 1);
            const y = height * 0.10 + (i * 89) % Math.max(height * 0.70, 1);
            const radius = 18 + (i % 4) * 9;
            const color = i % 3 === 0 ? 0x2f8f44 : i % 3 === 1 ? 0x45b85a : 0x24743b;
            this.add.circle(x, y, radius, color).setAlpha(0.62);
        }

        const snake = this.add.graphics();
        snake.lineStyle(11, 0x42a750, 1);
        snake.beginPath();
        snake.moveTo(width * 0.02, height * 0.11);
        snake.splineTo([
            new Phaser.Math.Vector2(width * 0.25, height * 0.08),
            new Phaser.Math.Vector2(width * 0.50, height * 0.13),
            new Phaser.Math.Vector2(width * 0.72, height * 0.09),
            new Phaser.Math.Vector2(width * 0.98, height * 0.14)
        ]);
        snake.strokePath();
        this.add.circle(width * 0.98, height * 0.14, 16, 0x49bd58);
        this.add.circle(width * 0.99, height * 0.13, 3, 0xfff3a0);
    }

    private drawTemple (width: number, height: number)
    {
        const centerX = width / 2;
        const baseY = height * 0.55;

        this.add.rectangle(centerX, baseY, width * 0.62, height * 0.17, 0x6d5734).setAlpha(0.95);
        this.add.triangle(
            centerX,
            baseY - height * 0.18,
            centerX - width * 0.33,
            baseY - height * 0.06,
            centerX,
            baseY - height * 0.26,
            centerX + width * 0.33,
            baseY - height * 0.06,
            0xa88445
        );
        this.add.rectangle(centerX, baseY + height * 0.03, width * 0.16, height * 0.11, 0x271e16);
        this.add.rectangle(centerX, baseY - height * 0.03, width * 0.72, 6, 0xe1b84a).setAlpha(0.72);
    }

    private drawExplorer (centerX: number, height: number)
    {
        const y = height * 0.68;

        this.add.ellipse(centerX, y + 86, 130, 24, 0x000000).setAlpha(0.28);
        this.add.circle(centerX, y - 70, 32, 0xf1c27d).setStrokeStyle(4, 0x2a1b10);
        this.add.rectangle(centerX, y - 20, 64, 82, 0xe1b84a).setStrokeStyle(4, 0x2a1b10);
        this.add.rectangle(centerX - 44, y - 18, 26, 78, 0x245b2f).setAngle(-13);
        this.add.rectangle(centerX + 44, y - 18, 26, 78, 0x245b2f).setAngle(13);
        this.add.rectangle(centerX - 20, y + 52, 24, 70, 0x253a2c);
        this.add.rectangle(centerX + 20, y + 52, 24, 70, 0x253a2c);
        this.add.rectangle(centerX + 48, y - 46, 72, 14, 0x2a2a2a).setAngle(-8);
        this.add.rectangle(centerX + 86, y - 50, 26, 10, 0x111111).setAngle(-8);
    }

    private drawTitle (centerX: number, height: number)
    {
        this.add.text(centerX, height * 0.21, 'TEMPLEFALL', {
            fontFamily: 'Arial Black',
            fontSize: Math.min(46, this.cameras.main.width * 0.125),
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, height * 0.275, 'BATTLE ROYALE DE SELVA', {
            fontFamily: 'Arial Black',
            fontSize: Math.min(16, this.cameras.main.width * 0.044),
            color: '#e1b84a',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
    }

    private drawStartPanel (width: number, height: number)
    {
        const centerX = width / 2;
        const buttonY = height - 102;

        this.add.rectangle(centerX, height - 102, width, 204, 0x103c22).setAlpha(0.86);
        this.add.text(centerX, height - 168, 'Loot + bots + templo + zona viva', {
            fontFamily: 'Arial',
            fontSize: 15,
            color: '#d8f5c8',
            align: 'center'
        }).setOrigin(0.5);

        const button = this.add.rectangle(centerX, buttonY, width * 0.82, 66, 0xe1b84a)
            .setStrokeStyle(4, 0xffffff)
            .setInteractive({ useHandCursor: true });
        const label = this.add.text(centerX, buttonY, 'COMENZAR', {
            fontFamily: 'Arial Black',
            fontSize: Math.min(28, width * 0.075),
            color: '#103c22',
            align: 'center'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.add.text(centerX, height - 45, 'Toca el boton amarillo', {
            fontFamily: 'Arial',
            fontSize: 13,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.bindStart(button);
        this.bindStart(label);
        this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
        this.input.keyboard?.once('keydown-SPACE', () => this.startGame());
    }

    private bindStart (object: GameObjects.GameObject)
    {
        object.on('pointerdown', () => this.startGame());
        object.on('pointerup', () => this.startGame());
    }

    private startGame ()
    {
        if (this.started)
        {
            return;
        }

        this.started = true;
        this.scene.start('Game');
    }
}
