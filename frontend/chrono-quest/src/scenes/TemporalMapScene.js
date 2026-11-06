import Phaser from 'phaser';

export default class TemporalMapScene extends Phaser.Scene {
    constructor() {
        super('TemporalMapScene');
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#080812');

        const personagem = this.registry.get(
            'personagemSelecionado'
        );

        this.add.text(
            largura / 2,
            65,
            'MAPA TEMPORAL',
            {
                fontSize: '34px',
                color: '#d8b76a',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        this.add.text(
            largura / 2,
            110,
            `Viajante: ${personagem?.nome || 'Desconhecido'}`,
            {
                fontSize: '18px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        const epocas = [
            {
                ano: '2147',
                nome: 'O FUTURO',
                descricao: 'Uma civilização tecnológica.',
                cor: 0x174c80
            },
            {
                ano: '1247',
                nome: 'ERA MEDIEVAL',
                descricao: 'Reinos e antigas batalhas.',
                cor: 0x66502b
            },
            {
                ano: '1890',
                nome: 'ERA INDUSTRIAL',
                descricao: 'Máquinas e revolução.',
                cor: 0x40504a
            }
        ];

        const larguraCard = Math.min(250, (largura - 100) / 3);
        const espacamento = 20;
        const total = larguraCard * 3 + espacamento * 2;
        const inicio = (largura - total) / 2;
        let epocaSelecionada = null;
        let cardSelecionado = null;

       const textoSelecao = this.add.text(
       largura / 2,
        altura - 65,
       'ESCOLHA UMA ÉPOCA',
         {
        fontSize: '18px',
        color: '#d8b76a'
        }
          ).setOrigin(0.5);

        epocas.forEach((epoca, i) => {
            const x = inicio + i * (larguraCard + espacamento);
            const y = altura / 2;

            const card = this.add.rectangle(
                x + larguraCard / 2,
                y,
                larguraCard,
                240,
                epoca.cor
            );

            card.setStrokeStyle(2, 0xd8b76a);
            card.setInteractive({ useHandCursor: true });

            this.add.text(
                x + larguraCard / 2,
                y - 55,
                epoca.ano,
                {
                    fontSize: '35px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

            this.add.text(
                x + larguraCard / 2,
                y + 5,
                epoca.nome,
                {
                    fontSize: '18px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

            this.add.text(
                x + larguraCard / 2,
                y + 55,
                epoca.descricao,
                {
                    fontSize: '13px',
                    color: '#eeeeee',
                    align: 'center'
                }
            ).setOrigin(0.5);

            card.on('pointerdown', () => {
    if (cardSelecionado) {
        cardSelecionado.setStrokeStyle(2, 0xd8b76a);
    }

    epocaSelecionada = epoca;
    cardSelecionado = card;

    card.setStrokeStyle(4, 0xffffff);

    this.registry.set('epocaSelecionada', epoca);

    textoSelecao.setText(
        `ÉPOCA SELECIONADA: ${epoca.ano}`
    );
});
        });
        const botaoViajar = this.add.text(
    largura / 2,
    altura - 35,
    'INICIAR VIAGEM',
    {
        fontSize: '19px',
        color: '#080812',
        backgroundColor: '#d8b76a',
        padding: { x: 25, y: 12 },
        fontStyle: 'bold'
    }
).setOrigin(0.5);

botaoViajar.setInteractive({ useHandCursor: true });

botaoViajar.on('pointerdown', () => {
    if (!epocaSelecionada) {
        textoSelecao.setText('SELECIONE UMA ÉPOCA PRIMEIRO!');
        return;
    }

    this.scene.start('ExplorationScene');
});
    }
}