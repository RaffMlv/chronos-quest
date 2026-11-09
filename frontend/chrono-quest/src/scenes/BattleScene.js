import Phaser from 'phaser';
import { classByName } from '../game/classes.js';
import { createBattle, playerAction } from '../services/battleLocal.js';
import { createRemoteBattle, remoteAction } from '../services/battleRemote.js';
import { isOffline } from '../services/api.js';
import { addButton } from '../game/ui.js';

const tweenP = (scene, config) =>
    new Promise((resolve) => scene.tweens.add({ ...config, onComplete: () => resolve() }));

const wait = (scene, ms) =>
    new Promise((resolve) => scene.time.delayedCall(ms, resolve));

// Batalha por turnos, exibida por cima da ExplorationScene (que fica pausada).
//
// Com login, os cálculos vêm do Battle Service (services/battleRemote.js).
// No MODO TESTE (sem login, só em desenvolvimento) usa services/battleLocal.js.
// Em ambos os casos esta cena só apresenta eventos e envia a ação escolhida.
export default class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }

    init(data) {
        this.payload = data;
    }

    create() {
        const { character, era, hp, mp } = this.payload;
        const w = this.scale.width;
        const h = this.scale.height;

        this.W = w;
        this.H = h;
        this.era = era;
        this.cls = classByName(character.className);
        this.online = !isOffline();
        this.battle = null;
        this.busy = true;
        this.s = Phaser.Math.Clamp(Math.floor(Math.min(w / 4.5, h / 4) / 16), 3, 8);

        const s = this.s;

        // cenário
        const groundTop = h * 0.4;
        this.add.rectangle(w / 2, h / 2, w, h, era.sky);
        this.add.tileSprite(w / 2, (groundTop + h) / 2, w, h - groundTop, `${era.id}_ground0`)
            .setTileScale(s);
        this.add.rectangle(w / 2, groundTop, w, 3, 0x000000, 0.35);

        // combatentes
        this.ex = w * 0.7;
        this.ey = h * 0.38;
        this.px = w * 0.28;
        this.py = h * 0.56;

        this.add.image(this.ex, this.ey + 8 * s, 'shadow').setScale(s * 1.2);
        this.add.image(this.px, this.py + 8 * s, 'shadow').setScale(s * 1.2);

        this.enemySpr = this.add.sprite(this.ex, this.ey, `enemy_${era.id}_0`).setScale(s).setFlipX(true);
        this.enemySpr.anims.play(`${era.id}-enemy`);

        this.playerSpr = this.add.sprite(this.px, this.py, `hero_${this.cls.key}_idle0`).setScale(s);
        this.playerSpr.anims.play(`${this.cls.key}-idle`);

        // barras e rótulos
        this.gfx = this.add.graphics();
        this.eTop = this.ey - 8 * s;
        this.pTop = this.py - 8 * s;

        const estiloNome = { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', align: 'center', stroke: '#000000', strokeThickness: 3 };

        this.enemyLabel = this.add.text(this.ex, this.eTop - 34, '', estiloNome).setOrigin(0.5, 1);
        this.playerLabel = this.add.text(this.px, this.pTop - 34, '', estiloNome).setOrigin(0.5, 1);

        // texto de log
        this.log = this.add.text(w / 2, h * 0.76, 'Escolha sua ação.', {
            fontSize: '15px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
            wordWrap: { width: w - 40 }
        }).setOrigin(0.5, 0);

        const aviso = this.online
            ? 'Batalha processada pelo Battle Service'
            : 'Modo teste: batalha local, sem backend';

        this.add.text(w / 2, 10, aviso, {
            fontSize: '11px',
            color: '#c9d2e3',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3,
            wordWrap: { width: w - 24 }
        }).setOrigin(0.5, 0);

        // botões de ação
        const bw = Math.min(170, (w - 40) / 3);
        const by = h - 50;
        const skill = this.cls.skill;

        this.btnAttack = addButton(this, w / 2 - (bw + 8), by, bw, 56, 'ATACAR', () => this.act('attack'), { fontSize: '15px' });
        const rotuloSkill = this.online ? skill.name : `${skill.name}\n${skill.cost} MP`;

        this.btnSkill = addButton(this, w / 2, by, bw, 56, rotuloSkill, () => this.act('skill'), { fontSize: '12px' });
        this.btnDefend = addButton(this, w / 2 + (bw + 8), by, bw, 56, 'DEFENDER', () => this.act('defend'), { fontSize: '15px' });

        this.setButtons(false);

        if (this.online) {
            this.iniciarRemota();
        } else {
            this.battle = createBattle({ character, hp, mp }, era.enemy);
            this.busy = false;
            this.drawBars();
            this.setButtons(true);
        }
    }

    // Abre a batalha no Battle Service (POST /battles/start).
    async iniciarRemota() {
        this.log.setText('Iniciando batalha...');

        try {
            this.battle = await createRemoteBattle({ character: this.payload.character, era: this.era });
        } catch (erro) {
            if (!this.sys.isActive()) return;
            this.mostrarErro(`${erro.message}\nToque para voltar.`, true);
            return;
        }

        if (!this.sys.isActive()) return;

        this.busy = false;
        this.log.setText('Escolha sua ação.');
        this.drawBars();
        this.setButtons(true);
    }

    // Erro de comunicação. Se `sair` for true, o toque devolve o jogador à exploração.
    mostrarErro(texto, sair) {
        this.log.setColor('#ff8080').setText(texto);

        if (sair) {
            this.log.setInteractive({ useHandCursor: true });
            this.log.once('pointerdown', () => {
                this.battle = { over: true, won: false, xp: 0, aborted: true };
                this.encerrar();
            });
        }
    }

    // ---------- interface ----------

    drawBars(snapshot) {
        const b = this.battle;
        const st = snapshot || { pHp: b.player.hp, pMp: b.player.mp, eHp: b.enemy.hp };
        const bw = Math.min(130, this.W * 0.34);
        const g = this.gfx;

        g.clear();

        const bar = (cx, y, ratio, color) => {
            g.fillStyle(0x000000, 0.65);
            g.fillRect(cx - bw / 2 - 1, y - 1, bw + 2, 10);
            g.fillStyle(color, 1);
            g.fillRect(cx - bw / 2, y, bw * Phaser.Math.Clamp(ratio, 0, 1), 8);
        };

        bar(this.ex, this.eTop - 30, st.eHp / b.enemy.maxHp, 0xd9534f);
        bar(this.px, this.pTop - 30, st.pHp / b.player.maxHp, 0x5cd97a);

        // O Battle Service não tem MP, então a barra azul só existe no modo teste.
        if (!b.remote) bar(this.px, this.pTop - 18, st.pMp / b.player.maxMp, 0x4f8cff);

        this.enemyLabel.setText(`${b.enemy.name}\nHP ${st.eHp}/${b.enemy.maxHp}`);
        this.playerLabel.setText(
            b.remote
                ? `${b.player.name}\nHP ${st.pHp}/${b.player.maxHp}`
                : `${b.player.name}\nHP ${st.pHp}/${b.player.maxHp} • MP ${st.pMp}/${b.player.maxMp}`
        );
    }

    setButtons(enabled) {
        const semMp = !this.battle || this.battle.remote;
        const canSkill = enabled && (semMp || this.battle.player.mp >= this.cls.skill.cost);

        this.btnAttack.setEnabled(enabled);
        this.btnDefend.setEnabled(enabled);
        this.btnSkill.setEnabled(canSkill);
    }

    floatText(sprite, text, color) {
        const t = this.add.text(sprite.x, sprite.y - this.s * 6, text, {
            fontSize: `${14 + this.s * 2}px`,
            color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(50);

        tweenP(this, { targets: t, y: t.y - 40, alpha: 0, duration: 700 }).then(() => t.destroy());
    }

    // ---------- fluxo do turno ----------

    async act(action) {
        if (this.busy || !this.battle || this.battle.over) return;

        this.busy = true;
        this.setButtons(false);

        let result;

        if (this.online) {
            try {
                result = await remoteAction(this.battle, action);
            } catch (erro) {
                if (!this.sys.isActive()) return;
                this.log.setColor('#ff8080').setText(erro.message);
                this.busy = false;
                this.setButtons(true);
                return;
            }
            if (!this.sys.isActive()) return;
            this.log.setColor('#ffffff');
        } else {
            result = playerAction(this.battle, action);

            if (result.error) {
                this.log.setText(result.error);
                this.busy = false;
                this.setButtons(true);
                return;
            }
        }

        for (const ev of result.events) {
            await this.playEvent(ev);
            if (!this.sys.isActive()) return;
        }

        if (this.battle.over) {
            await this.showResult();
            return;
        }

        this.busy = false;
        this.setButtons(true);
    }

    async playEvent(ev) {
        const fromPlayer = ev.actor === 'player';
        const actor = fromPlayer ? this.playerSpr : this.enemySpr;
        const target = fromPlayer ? this.enemySpr : this.playerSpr;
        const dir = fromPlayer ? 1 : -1;

        this.log.setText(ev.log);

        if (ev.type === 'dead') {
            const morto = ev.actor === 'enemy' ? this.enemySpr : this.playerSpr;
            morto.anims.stop();
            await tweenP(this, { targets: morto, angle: -90, alpha: 0.35, duration: 450 });
            this.drawBars(ev.after);
            return;
        }

        if (ev.type === 'defend') {
            this.floatText(actor, 'DEFESA', '#8fd3ff');
            this.drawBars(ev.after);
            await wait(this, 500);
            return;
        }

        const baseX = actor.x;

        if (fromPlayer) {
            actor.anims.stop();
            actor.setTexture(`hero_${this.cls.key}_attack`);
        }

        await tweenP(this, { targets: actor, x: baseX + dir * this.s * 10, duration: 140, ease: 'Quad.easeOut' });

        this.floatText(target, `-${ev.dmg}`, '#ff6b6b');
        if (ev.heal) this.floatText(this.playerSpr, `+${ev.heal}`, '#5cd97a');
        this.drawBars(ev.after);

        const tx = target.x;
        await Promise.all([
            tweenP(this, { targets: target, alpha: 0.3, duration: 70, yoyo: true, repeat: 2 }),
            tweenP(this, { targets: target, x: tx + dir * 8, duration: 70, yoyo: true, repeat: 2 })
        ]);

        await tweenP(this, { targets: actor, x: baseX, duration: 140 });

        if (fromPlayer) actor.anims.play(`${this.cls.key}-idle`);

        await wait(this, 200);
    }

    async showResult() {
        const b = this.battle;
        const w = this.W;
        const h = this.H;

        await wait(this, 500);
        if (!this.sys.isActive()) return;

        this.add.rectangle(w / 2, h * 0.36, Math.min(320, w - 32), 160, 0x080d1a, 0.93)
            .setStrokeStyle(2, 0xd8b76a)
            .setDepth(100);

        this.add.text(w / 2, h * 0.36 - 40, b.won ? 'VITÓRIA!' : 'DERROTA', {
            fontSize: '30px',
            color: b.won ? '#5cd97a' : '#ff6b6b',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(101);

        this.add.text(
            w / 2,
            h * 0.36 + 2,
            b.won ? `+${b.xp} XP (somente nesta sessão)` : 'Você voltará ao início do mapa.',
            { fontSize: '14px', color: '#ffffff', align: 'center', wordWrap: { width: 280 } }
        ).setOrigin(0.5).setDepth(101);

        const botao = addButton(this, w / 2, h * 0.36 + 50, 160, 40, 'CONTINUAR', () => this.encerrar(), {
            fill: 0xd8b76a,
            color: '#080d1a',
            fontSize: '15px'
        });
        botao.bg.setDepth(101);
        botao.txt.setDepth(102);
    }

    encerrar() {
        const b = this.battle;
        const { character, hp, mp } = this.payload;
        let resultado;

        if (b.aborted) {
            // a batalha nem chegou a começar (serviço indisponível): nada muda
            resultado = { aborted: true, won: false, hp, mp, xp: 0 };
        } else if (b.remote) {
            // O backend ainda não conhece a vida do personagem, então a vida final
            // volta para o jogo como proporção da vida máxima.
            const maxHp = character.sheet.maxHealthPoints;
            const vida = Math.round((maxHp * b.player.hp) / b.player.maxHp);
            resultado = { won: b.won, hp: b.won ? Math.max(1, vida) : 0, mp, xp: b.xp };
        } else {
            resultado = { won: b.won, hp: b.player.hp, mp: b.player.mp, xp: b.xp };
        }

        const exploracao = this.scene.get('ExplorationScene');

        this.scene.stop();
        this.scene.resume('ExplorationScene');
        exploracao.events.emit('battle-end', resultado);
    }
}
