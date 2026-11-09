import Phaser from 'phaser';
import { ERAS } from '../game/eras.js';
import { classByName } from '../game/classes.js';
import { addButton } from '../game/ui.js';
import { listNotifications } from '../services/api.js';

export default class TemporalMapScene extends Phaser.Scene {
    constructor() {
        super('TemporalMapScene');
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#080812');

        const personagem = this.registry.get('personagem');

        if (!personagem) {
            this.scene.start('LoginScene');
            return;
        }

        const cls = classByName(personagem.className);

        this.add.text(largura / 2, 44, 'MAPA TEMPORAL', {
            fontSize: largura < 500 ? '28px' : '34px',
            color: '#d8b76a',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const sprite = this.add.sprite(largura / 2 - 6, 96, `hero_${cls.key}_idle0`).setScale(3);
        sprite.anims.play(`${cls.key}-idle`);

        this.add.text(largura / 2 + 22, 96, `${personagem.name}\n${personagem.className}`, {
            fontSize: '14px',
            color: '#ffffff',
            lineSpacing: 2
        }).setOrigin(0, 0.5);

        // Atalhos: loja, inventário e notificações (canto superior direito)
        const bx = largura - 86;
        addButton(this, bx, 28, 150, 28, 'LOJA', () => this.scene.start('ShopScene'), { fontSize: '12px' });
        addButton(this, bx, 62, 150, 28, 'INVENTÁRIO', () => this.scene.start('InventoryScene'), { fontSize: '12px' });
        const btnNotif = addButton(this, bx, 96, 150, 28, 'NOTIFICAÇÕES', () => this.scene.start('NotificationsScene'), { fontSize: '12px' });

        // Contador de não lidas (se o serviço de notificações não responder, fica sem número)
        listNotifications()
            .then((lista) => {
                const naoLidas = lista.filter((n) => n.status !== 'READ').length;
                if (this.sys.isActive() && naoLidas > 0) btnNotif.setLabel(`NOTIFICAÇÕES (${naoLidas})`);
            })
            .catch(() => {});

        // Em tela vertical (celular) os cards ficam empilhados.
        const vertical = largura < altura * 0.9;

        let epocaSelecionada = null;
        let cardSelecionado = null;

        const textoSelecao = this.add.text(largura / 2, altura - 104, 'ESCOLHA UMA ÉPOCA', {
            fontSize: '16px',
            color: '#d8b76a'
        }).setOrigin(0.5);

        const selecionar = (epoca, card) => {
            if (cardSelecionado) cardSelecionado.setStrokeStyle(2, 0xd8b76a);

            epocaSelecionada = epoca;
            cardSelecionado = card;
            card.setStrokeStyle(4, 0xffffff);
            this.registry.set('epocaSelecionada', epoca);
            textoSelecao.setText(`ÉPOCA SELECIONADA: ${epoca.ano}`);
        };

        ERAS.forEach((epoca, i) => {
            let cx;
            let cy;
            let cw;
            let ch;

            if (vertical) {
                cw = Math.min(largura - 32, 420);
                ch = Math.min(100, (altura - 340) / 3);
                cx = largura / 2;
                cy = 170 + i * (ch + 12) + ch / 2;
            } else {
                cw = Math.min(250, (largura - 100) / 3);
                ch = 220;
                cx = largura / 2 + (i - 1) * (cw + 20);
                cy = altura / 2 + 10;
            }

            const card = this.add.rectangle(cx, cy, cw, ch, epoca.cor)
                .setStrokeStyle(2, 0xd8b76a)
                .setInteractive({ useHandCursor: true });

            if (vertical) {
                this.add.text(cx - cw / 2 + 20, cy, epoca.ano, {
                    fontSize: '34px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0, 0.5);

                this.add.text(cx - cw / 2 + 140, cy, `${epoca.nome}\n${epoca.descricao}`, {
                    fontSize: '14px',
                    color: '#ffffff',
                    lineSpacing: 6,
                    wordWrap: { width: cw - 150 }
                }).setOrigin(0, 0.5);
            } else {
                this.add.text(cx, cy - 55, epoca.ano, {
                    fontSize: '35px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5);

                this.add.text(cx, cy + 5, epoca.nome, {
                    fontSize: '18px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5);

                this.add.text(cx, cy + 50, epoca.descricao, {
                    fontSize: '13px', color: '#eeeeee', align: 'center', wordWrap: { width: cw - 20 }
                }).setOrigin(0.5);
            }

            card.on('pointerdown', () => selecionar(epoca, card));
        });

        addButton(this, largura / 2, altura - 62, Math.min(260, largura - 32), 44, 'INICIAR VIAGEM', () => {
            if (!epocaSelecionada) {
                textoSelecao.setText('SELECIONE UMA ÉPOCA PRIMEIRO!');
                return;
            }
            this.scene.start('ExplorationScene');
        }, { fill: 0xd8b76a, color: '#080812' });

        this.add.text(largura / 2, altura - 22, 'TROCAR PERSONAGEM', {
            fontSize: '13px',
            color: '#aab8cc'
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('CharacterSelectScene'));
    }
}
