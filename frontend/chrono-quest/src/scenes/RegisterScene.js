import Phaser from 'phaser';
import { registerUser, login } from '../services/api.js';
import { INPUT_STYLE, PRIMARY_BTN_STYLE, GHOST_BTN_STYLE } from '../game/ui.js';

export default class RegisterScene extends Phaser.Scene {
    constructor() {
        super('RegisterScene');
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#080d1a');

        this.add.text(largura / 2, altura * 0.09, 'CHRONOS QUEST', {
            fontSize: '34px',
            fontStyle: 'bold',
            color: '#d8b76a'
        }).setOrigin(0.5);

        this.add.text(largura / 2, altura * 0.16, 'CRIAR CONTA', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Campos conforme RegisterUserRequest do user-service:
        // username (3-50), email, password (8-72), displayName (até 80).
        const formulario = `
            <form id="register-form" style="width:300px;display:flex;flex-direction:column;gap:10px;font-family:Arial;">
                <input id="username" type="text" autocomplete="username" minlength="3" maxlength="50"
                    placeholder="Usuário (3 a 50 caracteres)" required style="${INPUT_STYLE}">
                <input id="displayName" type="text" maxlength="80"
                    placeholder="Nome de exibição" required style="${INPUT_STYLE}">
                <input id="email" type="email" autocomplete="email" maxlength="254"
                    placeholder="Seu e-mail" required style="${INPUT_STYLE}">
                <input id="senha" type="password" autocomplete="new-password" minlength="8" maxlength="72"
                    placeholder="Senha (mínimo 8 caracteres)" required style="${INPUT_STYLE}">
                <input id="confirmar" type="password" autocomplete="new-password"
                    placeholder="Confirme sua senha" required style="${INPUT_STYLE}">
                <button id="cadastrar" type="submit" style="${PRIMARY_BTN_STYLE}">CADASTRAR</button>
                <button id="voltar-login" type="button" style="${GHOST_BTN_STYLE}">JÁ TENHO CONTA</button>
            </form>
        `;

        const elemento = this.add.dom(largura / 2, altura * 0.54).createFromHTML(formulario);

        this.mensagem = this.add.text(largura / 2, altura * 0.95, '', {
            fontSize: '14px',
            color: '#ff8080',
            align: 'center',
            wordWrap: { width: Math.min(320, largura - 32) }
        }).setOrigin(0.5);

        elemento.addListener('submit');
        elemento.on('submit', async (event) => {
            event.preventDefault();

            const valor = (id) => elemento.getChildByID(id).value;
            const username = valor('username').trim();
            const displayName = valor('displayName').trim();
            const email = valor('email').trim();
            const senha = valor('senha');
            const confirmar = valor('confirmar');
            const botao = elemento.getChildByID('cadastrar');

            if (senha !== confirmar) {
                this.mensagem.setColor('#ff8080').setText('As senhas não coincidem.');
                return;
            }

            botao.disabled = true;
            this.mensagem.setColor('#d8b76a').setText('Criando conta...');

            try {
                await registerUser({ username, email, password: senha, displayName });
                this.mensagem.setText('Conta criada! Entrando...');
                await login(username, senha);
                this.scene.start('CharacterSelectScene');
            } catch (erro) {
                if (!this.sys.isActive()) return;
                this.mensagem.setColor('#ff8080').setText(erro.message);
                botao.disabled = false;
            }
        });

        elemento.addListener('click');
        elemento.on('click', (event) => {
            if (event.target.id === 'voltar-login') {
                this.scene.start('LoginScene');
            }
        });
    }
}
