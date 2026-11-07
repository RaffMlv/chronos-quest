import Phaser from 'phaser';
import { login } from '../services/api.js';
import { INPUT_STYLE, PRIMARY_BTN_STYLE, GHOST_BTN_STYLE } from '../game/ui.js';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.cameras.main.setBackgroundColor('#080d1a');

        this.add.text(largura / 2, altura * 0.16, 'CHRONOS QUEST', {
            fontSize: '38px',
            fontStyle: 'bold',
            color: '#d8b76a'
        }).setOrigin(0.5);

        this.add.text(largura / 2, altura * 0.25, 'ACESSAR CONTA', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const formulario = `
            <form id="login-form" style="width:300px;display:flex;flex-direction:column;gap:15px;font-family:Arial;">
                <input id="identifier" type="text" autocomplete="username"
                    placeholder="Usuário ou e-mail" required style="${INPUT_STYLE}">
                <input id="senha" type="password" autocomplete="current-password"
                    placeholder="Sua senha" required style="${INPUT_STYLE}">
                <button id="entrar" type="submit" style="${PRIMARY_BTN_STYLE}">ENTRAR</button>
                <button id="cadastro" type="button" style="${GHOST_BTN_STYLE}">CRIAR CONTA</button>
            </form>
        `;

        const elemento = this.add.dom(largura / 2, altura * 0.5).createFromHTML(formulario);

        this.mensagem = this.add.text(largura / 2, altura * 0.72, '', {
            fontSize: '14px',
            color: '#ff8080',
            align: 'center',
            wordWrap: { width: Math.min(320, largura - 32) }
        }).setOrigin(0.5);

        elemento.addListener('submit');
        elemento.on('submit', async (event) => {
            event.preventDefault();

            const identifier = elemento.getChildByID('identifier').value.trim();
            const senha = elemento.getChildByID('senha').value;
            const botao = elemento.getChildByID('entrar');

            if (!identifier || !senha) return;

            botao.disabled = true;
            this.mensagem.setColor('#d8b76a').setText('Entrando...');

            try {
                await login(identifier, senha);
                this.scene.start('CharacterSelectScene');
            } catch (erro) {
                if (!this.sys.isActive()) return;
                this.mensagem.setColor('#ff8080').setText(erro.message);
                botao.disabled = false;
            }
        });

        elemento.addListener('click');
        elemento.on('click', (event) => {
            if (event.target.id === 'cadastro') {
                this.scene.start('RegisterScene');
            }
        });

        this.add.text(largura / 2, altura * 0.92, 'VOLTAR AO MENU', {
            fontSize: '16px',
            color: '#aab8cc'
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MenuScene'));
    }
}
