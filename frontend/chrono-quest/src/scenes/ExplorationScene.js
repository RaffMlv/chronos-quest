import Phaser from 'phaser';

export default class ExplorationScene extends Phaser.Scene {
    constructor() {
        super('ExplorationScene');
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#101827');

        const personagem = this.registry.get(
            'personagemSelecionado'
        );

        const epoca = this.registry.get(
            'epocaSelecionada'
        );

        this.add.text(
            largura / 2,
            65,
            'EXPLORAÇÃO TEMPORAL',
            {
                fontSize: '32px',
                color: '#d8b76a',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        this.add.text(
            largura / 2,
            130,
            `Ano: ${epoca?.ano || 'Desconhecido'}`,
            {
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.add.text(
            largura / 2,
            175,
            `Personagem: ${personagem?.nome || 'Desconhecido'}`,
            {
                fontSize: '18px',
                color: '#aaaaaa'
            }
        ).setOrigin(0.5);

        this.add.text(
            largura / 2,
            altura / 2,
            'Sua aventura está prestes a começar...',
            {
                fontSize: '22px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.add.text(
            largura / 2,
            altura - 90,
            'INICIAR EXPLORAÇÃO',
            {
                fontSize: '20px',
                color: '#d8b76a',
                backgroundColor: '#222b40',
                padding: { x: 25, y: 15 }
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            console.log('Exploração iniciada!');
        });
    }
}