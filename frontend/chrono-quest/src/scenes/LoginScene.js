import Phaser from 'phaser';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#080d1a');

        this.add.text(largura / 2, altura * 0.18, 'CHRONOS QUEST', {
            fontSize: '38px',
            fontStyle: 'bold',
            color: '#d8b76a'
        }).setOrigin(0.5);

        this.add.text(largura / 2, altura * 0.29, 'ACESSAR CONTA', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const formulario = `
            <form id="login-form" style="
                width: 300px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                font-family: Arial;
            ">
                <input
                    id="email"
                    type="email"
                    placeholder="Seu e-mail"
                    required
                    style="
                        padding: 14px;
                        border: 1px solid #d8b76a;
                        border-radius: 6px;
                        background: #17243a;
                        color: white;
                        font-size: 16px;
                    "
                >

                <input
                    id="senha"
                    type="password"
                    placeholder="Sua senha"
                    required
                    style="
                        padding: 14px;
                        border: 1px solid #d8b76a;
                        border-radius: 6px;
                        background: #17243a;
                        color: white;
                        font-size: 16px;
                    "
                >

                <button type="submit" style="
                    padding: 14px;
                    background: #d8b76a;
                    color: #080d1a;
                    border: none;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                ">
                    ENTRAR
                </button>

                <button id="cadastro" type="button" style="
                    padding: 12px;
                    background: transparent;
                    color: white;
                    border: 1px solid #d8b76a;
                    border-radius: 6px;
                    cursor: pointer;
                ">
                    CRIAR CONTA
                </button>
            </form>
        `;

        const elemento = this.add.dom(
            largura / 2,
            altura * 0.52
        ).createFromHTML(formulario);

        elemento.addListener('submit');

        elemento.on('submit', (event) => {
            event.preventDefault();

            const email = elemento.getChildByID('email').value;
            const senha = elemento.getChildByID('senha').value;

            console.log('E-mail:', email);
            console.log('Senha preenchida:', senha.length > 0);

            this.mensagem.setText('Interface funcionando! Login ainda não conectado.');
        });

        elemento.addListener('click');

        elemento.on('click', (event) => {
            if (event.target.id === 'cadastro') {
                this.scene.start('RegisterScene');
            }
        });

        this.mensagem = this.add.text(
            largura / 2,
            altura * 0.78,
            '',
            {
                fontSize: '14px',
                color: '#d8b76a',
                align: 'center'
            }
        ).setOrigin(0.5);

        this.add.text(
            largura / 2,
            altura * 0.9,
            'VOLTAR AO MENU',
            {
                fontSize: '16px',
                color: '#aab8cc'
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}