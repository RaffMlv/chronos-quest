import Phaser from 'phaser';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
        this.personagemSelecionado = null;
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#080812');

        this.add.text(largura / 2, 65, 'ESCOLHA SEU PERSONAGEM', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(largura / 2, 110,
            'Sua jornada pelo tempo começa aqui', {
            fontSize: '16px',
            color: '#9999bb'
        }).setOrigin(0.5);

        const personagens = [
            {
                nome: 'GUERREIRO',
                classe: 'Resistência',
                vida: 100,
                ataque: 85,
                defesa: 90,
                cor: 0x2878ff
            },
            {
                nome: 'MAGO',
                classe: 'Magia',
                vida: 65,
                ataque: 100,
                defesa: 45,
                cor: 0x9b59ff
            },
            {
                nome: 'ARQUEIRO',
                classe: 'Agilidade',
                vida: 80,
                ataque: 90,
                defesa: 65,
                cor: 0x28bd83
            }
        ];

        const larguraCard = Math.min(250, (largura - 100) / 3);
        const espacamento = 20;
        const total = larguraCard * 3 + espacamento * 2;
        const inicio = (largura - total) / 2;

        personagens.forEach((personagem, i) => {
            const x = inicio + i * (larguraCard + espacamento);
            const y = altura / 2 - 10;

            const fundo = this.add.rectangle(
                x + larguraCard / 2,
                y,
                larguraCard,
                310,
                0x151526
            );

            fundo.setStrokeStyle(2, 0x393951);

            this.add.circle(
                x + larguraCard / 2,
                y - 85,
                42,
                personagem.cor
            );

            this.add.text(
                x + larguraCard / 2,
                y - 85,
                personagem.nome[0],
                {
                    fontSize: '42px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

            this.add.text(
                x + larguraCard / 2,
                y - 20,
                personagem.nome,
                {
                    fontSize: '21px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

            this.add.text(
                x + larguraCard / 2,
                y + 12,
                personagem.classe,
                {
                    fontSize: '15px',
                    color: '#aaaaCC'
                }
            ).setOrigin(0.5);

            this.add.text(
                x + 25,
                y + 65,
                `VIDA       ${personagem.vida}\n\nATAQUE  ${personagem.ataque}\n\nDEFESA  ${personagem.defesa}`,
                {
                    fontSize: '15px',
                    color: '#dddddd',
                    lineSpacing: 5
                }
            );

            fundo.setInteractive({ useHandCursor: true });

            fundo.on('pointerdown', () => {
                this.personagemSelecionado = personagem;

                this.children.list.forEach(obj => {
                    if (obj.type === 'Rectangle' &&
                        obj.width === larguraCard) {
                        obj.setStrokeStyle(2, 0x393951);
                    }
                });

                fundo.setStrokeStyle(3, personagem.cor);

                textoConfirmar.setText(
                    `CONFIRMAR ${personagem.nome}`
                );
            });
        });

        const textoConfirmar = this.add.text(
            largura / 2,
            altura - 65,
            'SELECIONE UM PERSONAGEM',
            {
                fontSize: '19px',
                color: '#777788',
                backgroundColor: '#222233',
                padding: { x: 25, y: 15 }
            }
        ).setOrigin(0.5);

        textoConfirmar.setInteractive({ useHandCursor: true });

        textoConfirmar.on('pointerdown', () => {
    if (!this.personagemSelecionado) return;

    this.registry.set(
        'personagemSelecionado',
        this.personagemSelecionado
    );

    console.log(
        'Personagem escolhido:',
        this.personagemSelecionado
    );

    this.scene.start('TemporalMapScene');
});
    }
}