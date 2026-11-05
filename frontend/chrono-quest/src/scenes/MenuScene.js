import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#080d1a');

        this.add.text(largura / 2, altura * 0.25, 'CHRONOS QUEST', {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#d8b76a'
        }).setOrigin(0.5);

        this.add.text(largura / 2, altura * 0.34,
            'O tempo está em suas mãos.', {
            fontSize: '20px',
            color: '#aab8cc'
        }).setOrigin(0.5);

        this.criarBotao(
            largura / 2,
            altura * 0.55,
            'INICIAR JORNADA',
            () => this.scene.start('LoginScene')
        );

        this.criarBotao(
            largura / 2,
            altura * 0.65,
            'CONFIGURAÇÕES',
            () => console.log('Configurações')
        );
    }

    criarBotao(x, y, texto, acao) {
        const fundo = this.add.rectangle(
            x, y, 250, 48, 0x17243a
        ).setStrokeStyle(1, 0xd8b76a);

        fundo.setInteractive({ useHandCursor: true });

        const titulo = this.add.text(x, y, texto, {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        fundo.on('pointerover', () => fundo.setFillStyle(0x263c5c));
        fundo.on('pointerout', () => fundo.setFillStyle(0x17243a));
        fundo.on('pointerdown', acao);
    }
}