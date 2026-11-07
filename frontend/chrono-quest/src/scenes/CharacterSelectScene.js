import Phaser from 'phaser';
import { CLASSES, classByName, ATTR_LABELS } from '../game/classes.js';
import { listCharacters, createCharacter, hasToken, clearToken } from '../services/api.js';
import { COLORS, addButton, INPUT_STYLE } from '../game/ui.js';

// Lista os personagens da conta (GET /characters) e cria novos (POST /characters).
export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#080812');

        if (!hasToken()) {
            this.scene.start('LoginScene');
            return;
        }

        this.W = this.scale.width;
        this.H = this.scale.height;
        this.characters = [];
        this.layer = null;
        this.dom = null;

        this.status = this.add.text(this.W / 2, this.H / 2, 'Carregando personagens...', {
            fontSize: '18px',
            color: '#d8b76a',
            align: 'center',
            wordWrap: { width: Math.min(360, this.W - 32) }
        }).setOrigin(0.5);

        this.carregar();
    }

    async carregar() {
        try {
            this.characters = await listCharacters();
        } catch (erro) {
            if (!this.sys.isActive()) return;

            if (erro.status === 401 || erro.status === 403) {
                clearToken();
                this.scene.start('LoginScene');
                return;
            }

            this.status.setText(`${erro.message}\n\nToque para tentar de novo.`);
            this.status.setInteractive({ useHandCursor: true });
            this.status.once('pointerdown', () => this.scene.restart());
            return;
        }

        if (!this.sys.isActive()) return;

        this.status.destroy();
        this.characters.length > 0 ? this.mostrarLista() : this.mostrarCriacao();
    }

    limpar() {
        if (this.layer) this.layer.destroy(true);
        if (this.dom) this.dom.destroy();
        this.layer = this.add.container(0, 0);
        this.dom = null;
    }

    titulo(texto) {
        this.layer.add(
            this.add.text(this.W / 2, 42, texto, {
                fontSize: this.W < 500 ? '24px' : '30px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5)
        );
    }

    // ---------- lista de personagens ----------

    mostrarLista() {
        this.limpar();
        this.titulo('SEUS PERSONAGENS');

        const largura = Math.min(this.W - 32, 440);
        const altura = 70;
        const visiveis = this.characters.slice(0, 5);

        visiveis.forEach((personagem, i) => {
            const cls = classByName(personagem.className);
            const sheet = personagem.sheet;
            const y = 110 + i * (altura + 10);

            const fundo = this.add.rectangle(this.W / 2, y, largura, altura, 0x151526)
                .setStrokeStyle(2, cls.color)
                .setInteractive({ useHandCursor: true });

            const sprite = this.add.sprite(this.W / 2 - largura / 2 + 40, y, `hero_${cls.key}_idle0`)
                .setScale(3.5);
            sprite.anims.play(`${cls.key}-idle`);

            const nome = this.add.text(this.W / 2 - largura / 2 + 82, y - 16, personagem.name, {
                fontSize: '18px', color: '#ffffff', fontStyle: 'bold'
            });
            const detalhe = this.add.text(
                this.W / 2 - largura / 2 + 82, y + 6,
                `${personagem.className} • Nv ${sheet.level} • HP ${sheet.healthPoints}/${sheet.maxHealthPoints}`,
                { fontSize: '13px', color: '#aaaacc' }
            );

            fundo.on('pointerover', () => fundo.setFillStyle(0x1f1f38));
            fundo.on('pointerout', () => fundo.setFillStyle(0x151526));
            fundo.on('pointerdown', () => this.escolher(personagem));

            this.layer.add([fundo, sprite, nome, detalhe]);
        });

        const yBotoes = 110 + visiveis.length * (altura + 10) + 30;

        addButton(this, this.W / 2, yBotoes, Math.min(260, this.W - 32), 48, 'NOVO PERSONAGEM',
            () => this.mostrarCriacao(), { container: this.layer });

        addButton(this, this.W / 2, yBotoes + 60, Math.min(260, this.W - 32), 40, 'SAIR DA CONTA',
            () => { clearToken(); this.scene.start('MenuScene'); },
            { container: this.layer, fontSize: '14px' });
    }

    // ---------- criação ----------

    mostrarCriacao() {
        this.limpar();
        this.titulo('NOVO PERSONAGEM');

        const larguraTotal = Math.min(this.W - 24, 560);
        const gap = 8;
        const cw = (larguraTotal - gap * 2) / 3;
        const ch = 104;
        const inicioX = (this.W - larguraTotal) / 2;
        const inicioY = 90;

        let selecionada = CLASSES[0];
        const cards = [];

        const detalhe = this.add.text(this.W / 2, inicioY + ch * 2 + gap + 22, '', {
            fontSize: '13px',
            color: '#dddddd',
            align: 'center',
            wordWrap: { width: Math.min(420, this.W - 32) }
        }).setOrigin(0.5, 0);
        this.layer.add(detalhe);

        const atualizarDetalhe = () => {
            const s = selecionada;
            detalhe.setText(
                `${s.role}\n${s.description}\n` +
                `Principal: ${ATTR_LABELS[s.primary]}  •  Secundário: ${ATTR_LABELS[s.secondary]}\n` +
                `Habilidade: ${s.skill.name} (${s.skill.cost} MP)`
            );
            cards.forEach((c) => c.fundo.setStrokeStyle(c.cls === s ? 3 : 2, c.cls === s ? s.color : 0x393951));
        };

        CLASSES.forEach((cls, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = inicioX + col * (cw + gap) + cw / 2;
            const y = inicioY + row * (ch + gap) + ch / 2;

            const fundo = this.add.rectangle(x, y, cw, ch, 0x151526)
                .setStrokeStyle(2, 0x393951)
                .setInteractive({ useHandCursor: true });

            const sprite = this.add.sprite(x, y - 18, `hero_${cls.key}_idle0`).setScale(3.5);
            sprite.anims.play(`${cls.key}-idle`);

            const nome = this.add.text(x, y + 30, cls.name, {
                fontSize: cw < 120 ? '11px' : '13px',
                color: '#ffffff',
                fontStyle: 'bold',
                align: 'center',
                wordWrap: { width: cw - 8 }
            }).setOrigin(0.5);

            fundo.on('pointerdown', () => {
                selecionada = cls;
                atualizarDetalhe();
            });

            cards.push({ fundo, cls });
            this.layer.add([fundo, sprite, nome]);
        });

        atualizarDetalhe();

        // Campo de nome (CreateCharacterRequest: 3 a 60 caracteres)
        const yCampo = inicioY + ch * 2 + gap + 130;
        this.dom = this.add.dom(this.W / 2, yCampo).createFromHTML(
            `<input id="nome-personagem" type="text" minlength="3" maxlength="60" autocomplete="off"
                placeholder="Nome do personagem (3 a 60 letras)"
                style="${INPUT_STYLE}width:${Math.min(300, this.W - 32)}px;">`
        );

        this.mensagem = this.add.text(this.W / 2, yCampo + 38, '', {
            fontSize: '14px',
            color: '#ff8080',
            align: 'center',
            wordWrap: { width: Math.min(360, this.W - 32) }
        }).setOrigin(0.5, 0);
        this.layer.add(this.mensagem);

        const botaoCriar = addButton(this, this.W / 2, yCampo + 100, Math.min(260, this.W - 32), 48,
            'CRIAR E JOGAR', async () => {
                const nome = this.dom.getChildByID('nome-personagem').value.trim();

                if (nome.length < 3 || nome.length > 60) {
                    this.mensagem.setColor('#ff8080').setText('O nome deve ter entre 3 e 60 caracteres.');
                    return;
                }

                botaoCriar.setEnabled(false);
                this.mensagem.setColor('#d8b76a').setText('Criando personagem...');

                try {
                    const criado = await createCharacter({ name: nome, classId: selecionada.id });
                    if (!this.sys.isActive()) return;
                    this.escolher(criado);
                } catch (erro) {
                    if (!this.sys.isActive()) return;
                    this.mensagem.setColor('#ff8080').setText(erro.message);
                    botaoCriar.setEnabled(true);
                }
            }, { container: this.layer, fill: COLORS.panelHi });

        if (this.characters.length > 0) {
            addButton(this, this.W / 2, yCampo + 154, Math.min(260, this.W - 32), 40, 'VOLTAR',
                () => this.mostrarLista(), { container: this.layer, fontSize: '14px' });
        }
    }

    escolher(personagem) {
        this.registry.set('personagem', personagem);
        this.registry.remove('runtime');
        this.scene.start('TemporalMapScene');
    }
}
