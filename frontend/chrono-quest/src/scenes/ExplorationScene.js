import Phaser from 'phaser';
import { classByName } from '../game/classes.js';
import { mulberry32, hashString, TILE } from '../game/assets.js';
import { addButton } from '../game/ui.js';

const COLS = 32;
const ROWS = 24;
const WORLD_W = COLS * TILE;
const WORLD_H = ROWS * TILE;
const SPEED = 70;
const ENEMY_COUNT = 4;

// Exploração: mapa gerado por época, movimento por teclado ou botões de toque,
// inimigos que vagam e perseguem. Encostar em um inimigo abre a BattleScene.
//
// A câmera principal mostra o mundo com zoom. Uma segunda câmera (uiCam), sem
// zoom, desenha só o HUD. Por isso cada objeto é registrado como "mundo" ou "hud".
export default class ExplorationScene extends Phaser.Scene {
    constructor() {
        super('ExplorationScene');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.character = this.registry.get('personagem');
        this.era = this.registry.get('epocaSelecionada');

        if (!this.character || !this.era) {
            this.scene.start(this.character ? 'TemporalMapScene' : 'LoginScene');
            return;
        }

        this.cls = classByName(this.character.className);

        // Estado temporário da sessão (HP/MP/XP). Não é gravado no backend.
        const sheet = this.character.sheet;
        let rt = this.registry.get('runtime');
        if (!rt || rt.id !== this.character.id) {
            rt = {
                id: this.character.id,
                hp: sheet.healthPoints,
                maxHp: sheet.maxHealthPoints,
                mp: sheet.manaPoints,
                maxMp: sheet.maxManaPoints,
                xp: 0
            };
            this.registry.set('runtime', rt);
        }
        this.rt = rt;

        this.inBattle = false;
        this.invulnUntil = 0;
        this.battleEnemyId = null;

        this.uiCam = this.cameras.add(0, 0, w, h);

        this.buildWorld();
        this.buildHud(w, h);
        this.setupCamera(w, h);
        this.setupInput(h);

        this.events.on('battle-end', this.onBattleEnd, this);
        this.events.once('shutdown', () => this.events.off('battle-end', this.onBattleEnd, this));
    }

    addWorld(obj) {
        this.uiCam.ignore(obj);
        return obj;
    }

    addHud(obj) {
        this.cameras.main.ignore(obj);
        return obj;
    }

    // ---------- mundo ----------

    buildWorld() {
        const era = this.era;
        const rand = mulberry32(hashString(era.id));
        const startRow = Math.floor(ROWS / 2);

        this.grid = [];
        this.obstacles = this.physics.add.staticGroup();

        for (let r = 0; r < ROWS; r++) {
            this.grid[r] = [];

            for (let c = 0; c < COLS; c++) {
                const border = r === 0 || c === 0 || r === ROWS - 1 || c === COLS - 1;
                const nearStart = c <= 5 && Math.abs(r - startRow) <= 2;

                let kind = 0;
                if (border) kind = 1;
                else if (!nearStart && rand() < 0.09) kind = 2;

                this.grid[r][c] = kind;

                const x = c * TILE;
                const y = r * TILE;

                if (kind !== 1) {
                    this.addWorld(
                        this.add.image(x, y, `${era.id}_ground${(r * 7 + c * 3) % 3}`)
                            .setOrigin(0)
                            .setDepth(0)
                    );
                }

                if (kind === 1) {
                    this.addWorld(
                        this.obstacles.create(x + TILE / 2, y + TILE / 2, `${era.id}_wall`).setDepth(1)
                    );
                } else if (kind === 2) {
                    this.addWorld(
                        this.obstacles.create(x + TILE / 2, y + TILE / 2, `${era.id}_deco${(r + c) % 2}`)
                            .setDepth(y + TILE)
                    );
                }
            }
        }

        this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

        // jogador
        this.startPos = { x: 3 * TILE + TILE / 2, y: startRow * TILE + TILE / 2 };

        this.player = this.addWorld(
            this.physics.add.sprite(this.startPos.x, this.startPos.y, `hero_${this.cls.key}_idle0`)
        );
        this.player.body.setSize(8, 6);
        this.player.body.setOffset(4, 10);
        this.player.setCollideWorldBounds(true);
        this.player.anims.play(`${this.cls.key}-idle`);
        this.physics.add.collider(this.player, this.obstacles);

        // inimigos
        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, this.obstacles);
        this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => this.startBattle(enemy));

        this.spawnEnemies(ENEMY_COUNT);

        this.time.addEvent({ delay: 1400, loop: true, callback: () => this.wander() });
    }

    spawnEnemies(count) {
        let spawned = 0;
        let tries = 0;

        while (spawned < count && tries < 400) {
            tries++;

            const c = Phaser.Math.Between(9, COLS - 3);
            const r = Phaser.Math.Between(2, ROWS - 3);
            if (this.grid[r][c] !== 0) continue;

            const enemy = this.enemies.create(
                c * TILE + TILE / 2,
                r * TILE + TILE / 2,
                `enemy_${this.era.enemy.key}_0`
            );

            enemy.body.setSize(10, 8);
            enemy.body.setOffset(3, 7);
            enemy.setCollideWorldBounds(true);
            enemy.setBounce(1);
            enemy.setData('id', `${Date.now()}-${spawned}-${tries}`);
            enemy.anims.play(`${this.era.id}-enemy`);
            this.addWorld(enemy);

            spawned++;
        }
    }

    wander() {
        if (this.inBattle) return;

        this.enemies.getChildren().forEach((enemy) => {
            if (!enemy.active || enemy.getData('chasing')) return;

            if (Math.random() < 0.6) {
                const angle = Math.random() * Math.PI * 2;
                enemy.setVelocity(Math.cos(angle) * 22, Math.sin(angle) * 22);
            } else {
                enemy.setVelocity(0, 0);
            }
        });
    }

    // ---------- HUD ----------

    buildHud(w) {
        const pad = 10;

        this.addHud(
            this.add.rectangle(pad, pad, 196, 74, 0x080d1a, 0.8)
                .setOrigin(0)
                .setStrokeStyle(1, 0xd8b76a)
                .setDepth(1000)
        );

        this.addHud(
            this.add.text(pad + 8, pad + 6, `${this.character.name} • Nv ${this.character.sheet.level}`, {
                fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
            }).setDepth(1001)
        );

        this.hudBars = this.addHud(this.add.graphics().setDepth(1001));

        this.hudInfo = this.addHud(
            this.add.text(pad + 8, pad + 54, '', { fontSize: '11px', color: '#aab8cc' }).setDepth(1001)
        );

        this.addHud(
            this.add.text(w - pad, pad, `ANO ${this.era.ano}`, {
                fontSize: '16px', color: '#d8b76a', fontStyle: 'bold'
            }).setOrigin(1, 0).setDepth(1001)
        );

        const botaoMapa = addButton(this, w - pad - 45, pad + 46, 90, 32, 'MAPA',
            () => this.scene.start('TemporalMapScene'), { fontSize: '13px' });
        botaoMapa.bg.setDepth(1001);
        botaoMapa.txt.setDepth(1002);
        this.addHud(botaoMapa.bg);
        this.addHud(botaoMapa.txt);

        this.toast = this.addHud(
            this.add.text(w / 2, 110, '', {
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#080d1acc',
                padding: { x: 12, y: 8 },
                align: 'center'
            }).setOrigin(0.5).setDepth(1003).setAlpha(0)
        );

        this.updateHud();
    }

    updateHud() {
        const rt = this.rt;
        const g = this.hudBars;

        g.clear();

        const bar = (y, ratio, color) => {
            g.fillStyle(0x1b2236, 1);
            g.fillRect(18, y, 176, 8);
            g.fillStyle(color, 1);
            g.fillRect(18, y, 176 * Phaser.Math.Clamp(ratio, 0, 1), 8);
        };

        bar(30, rt.hp / rt.maxHp, 0xd9534f);
        bar(42, rt.mp / rt.maxMp, 0x4f8cff);

        this.hudInfo.setText(`HP ${rt.hp}/${rt.maxHp}  MP ${rt.mp}/${rt.maxMp}  XP +${rt.xp}`);
    }

    showToast(message) {
        this.tweens.killTweensOf(this.toast);
        this.toast.setText(message).setAlpha(1);
        this.tweens.add({ targets: this.toast, alpha: 0, delay: 2000, duration: 500 });
    }

    // ---------- câmera e controles ----------

    setupCamera(w, h) {
        // Zoom mínimo para o mapa sempre cobrir a tela.
        const zoom = Math.max(2, Math.ceil(Math.max(w / WORLD_W, h / WORLD_H)));
        const cam = this.cameras.main;

        cam.setZoom(zoom);
        cam.setBounds(0, 0, WORLD_W, WORLD_H);
        cam.startFollow(this.player, true, 0.12, 0.12);
        cam.setRoundPixels(true);
    }

    setupInput(h) {
        const kb = this.input.keyboard;

        this.cursors = kb ? kb.createCursorKeys() : { left: {}, right: {}, up: {}, down: {} };
        this.keys = kb ? kb.addKeys('W,A,S,D') : { W: {}, A: {}, S: {}, D: {} };
        this.pad = { up: false, down: false, left: false, right: false };

        if (this.sys.game.device.input.touch) {
            this.input.addPointer(2);

            const cx = 84;
            const cy = h - 96;
            const d = 56;

            [
                ['up', cx, cy - d, '▲'],
                ['down', cx, cy + d, '▼'],
                ['left', cx - d, cy, '◀'],
                ['right', cx + d, cy, '▶']
            ].forEach(([dir, x, y, label]) => {
                const botao = this.addHud(
                    this.add.circle(x, y, 26, 0x17243a, 0.75)
                        .setStrokeStyle(2, 0xd8b76a)
                        .setDepth(1001)
                        .setInteractive()
                );

                this.addHud(
                    this.add.text(x, y, label, { fontSize: '20px', color: '#ffffff' })
                        .setOrigin(0.5)
                        .setDepth(1002)
                );

                const ligar = () => {
                    this.pad[dir] = true;
                    botao.setFillStyle(0x263c5c, 0.9);
                };
                const desligar = () => {
                    this.pad[dir] = false;
                    botao.setFillStyle(0x17243a, 0.75);
                };

                botao.on('pointerdown', ligar);
                botao.on('pointerup', desligar);
                botao.on('pointerout', desligar);
            });
        } else {
            this.addHud(
                this.add.text(this.scale.width / 2, h - 18, 'Setas ou WASD para andar • encoste em um inimigo para lutar', {
                    fontSize: '12px', color: '#aab8cc'
                }).setOrigin(0.5).setDepth(1001)
            );
        }
    }

    update() {
        if (this.inBattle || !this.player) return;

        const c = this.cursors;
        const k = this.keys;
        const p = this.pad;

        const left = c.left.isDown || k.A.isDown || p.left;
        const right = c.right.isDown || k.D.isDown || p.right;
        const up = c.up.isDown || k.W.isDown || p.up;
        const down = c.down.isDown || k.S.isDown || p.down;

        let vx = (right ? 1 : 0) - (left ? 1 : 0);
        let vy = (down ? 1 : 0) - (up ? 1 : 0);

        if (vx || vy) {
            const len = Math.hypot(vx, vy);
            vx /= len;
            vy /= len;
        }

        this.player.setVelocity(vx * SPEED, vy * SPEED);

        if (vx || vy) {
            this.player.anims.play(`${this.cls.key}-walk`, true);
            if (vx) this.player.setFlipX(vx < 0);
        } else {
            this.player.anims.play(`${this.cls.key}-idle`, true);
        }

        this.player.setDepth(this.player.y + 8);

        this.enemies.getChildren().forEach((enemy) => {
            if (!enemy.active) return;

            enemy.setDepth(enemy.y + 8);

            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

            if (dist < 56) {
                enemy.setData('chasing', true);
                this.physics.moveToObject(enemy, this.player, 32);
                enemy.setFlipX(this.player.x < enemy.x);
            } else if (enemy.getData('chasing')) {
                enemy.setData('chasing', false);
                enemy.setVelocity(0, 0);
            }
        });
    }

    // ---------- batalha ----------

    startBattle(enemy) {
        if (this.inBattle || this.time.now < this.invulnUntil) return;

        this.inBattle = true;
        this.battleEnemyId = enemy.getData('id');

        this.player.setVelocity(0, 0);
        this.enemies.getChildren().forEach((e) => e.setVelocity(0, 0));

        this.scene.pause();
        this.scene.launch('BattleScene', {
            character: this.character,
            era: this.era,
            hp: this.rt.hp,
            mp: this.rt.mp
        });
    }

    onBattleEnd(result) {
        const rt = this.rt;
        const enemy = this.enemies.getChildren().find((e) => e.getData('id') === this.battleEnemyId);

        this.inBattle = false;
        this.invulnUntil = this.time.now + 1500;

        rt.hp = result.hp;
        rt.mp = result.mp;

        if (result.won) {
            if (enemy) enemy.destroy();

            rt.xp += result.xp;
            rt.hp = Math.min(rt.maxHp, rt.hp + Math.round(rt.maxHp * 0.2));
            this.showToast(`Vitória! +${result.xp} XP`);

            if (this.enemies.countActive(true) === 0) {
                this.time.delayedCall(2500, () => {
                    this.showToast('Novos inimigos surgiram!');
                    this.spawnEnemies(ENEMY_COUNT);
                });
            }
        } else {
            rt.hp = rt.maxHp;
            rt.mp = rt.maxMp;
            this.player.setPosition(this.startPos.x, this.startPos.y);

            if (enemy) {
                enemy.setPosition(WORLD_W - 4 * TILE, WORLD_H / 2);
                enemy.setVelocity(0, 0);
            }

            this.showToast('Você caiu e voltou ao início.');
        }

        this.updateHud();
    }
}
