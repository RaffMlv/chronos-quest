import Phaser from 'phaser';

export default class RegisterScene extends Phaser.Scene {
    constructor() {
        super('RegisterScene');
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

        this.add.text(largura / 2, altura * 0.29, 'CRIAR CONTA', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const formulario = `
            <form id="register-form" style="
                width: 300px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                font-family: Arial;
            ">
                <input id="nome" type="text"
                    placeholder="Nome do jogador" required
                    style="padding:14px; background:#17243a;
                    color:white; border:1px solid #d8b76a;
                    border-radius:6px; font-size:16px;">

                <input id="email" type="email"
                    placeholder="Seu e-mail" required
                    style="padding:14px; background:#17243a;
                    color:white; border:1px solid #d8b76a;
                    border-radius:6px; font-size:16px;">

                <input id="senha" type="password"
                    placeholder="Crie uma senha" required
                    style="padding:14px; background:#17243a;
                    color:white; border:1px solid #d8b76a;
                    border-radius:6px; font-size:16px;">

                <input id="confirmar" type="password"
                    placeholder="Confirme sua senha" required
                    style="padding:14px; background:#17243a;
                    color:white; border:1px solid #d8b76a;
                    border-radius:6px; font-size:16px;">

                <button type="submit" style="
                    padding:14px; background:#d8b76a;
                    color:#080d1a; border:none;
                    border-radius:6px; font-weight:bold;
                    cursor:pointer;">
                    CADASTRAR
                </button>

                <button id="voltar-login" type="button" style="
                    padding:12px; background:transparent;
                    color:white; border:1px solid #d8b76a;
                    border-radius:6px; cursor:pointer;">
                    JÁ TENHO CONTA
                </button>
            </form>
        `;

        const elemento = this.add.dom(
            largura / 2,
            altura * 0.55
        ).createFromHTML(formulario);

        elemento.addListener('submit');

        elemento.on('submit', (event) => {
            event.preventDefault();

            const senha = elemento.getChildByID('senha').value;
            const confirmar = elemento.getChildByID('confirmar').value;

            if (senha !== confirmar) {
                this.mensagem.setText('As senhas não coincidem!');
                return;
            }

            this.mensagem.setText(
                'Cadastro pronto para integração com o servidor.'
            );
        });

        elemento.addListener('click');

        elemento.on('click', (event) => {
            if (event.target.id === 'voltar-login') {
                this.scene.start('LoginScene');
            }
        });

        this.mensagem = this.add.text(
            largura / 2,
            altura * 0.85,
            '',
            {
                fontSize: '14px',
                color: '#d8b76a'
            }
        ).setOrigin(0.5);
    }
}