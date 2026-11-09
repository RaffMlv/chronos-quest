import Phaser from 'phaser';
import {
    listNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification,
    hasToken, clearToken
} from '../services/api.js';
import { addButton } from '../game/ui.js';

const TIPOS = {
    BATTLE: { label: 'BATALHA', cor: '#ff8a80' },
    REWARD: { label: 'RECOMPENSA', cor: '#f2c94c' },
    MISSION: { label: 'MISSÃO', cor: '#7fb5ff' },
    TEMPORAL_FRAGMENT: { label: 'FRAGMENTO', cor: '#b39bff' }
};

const POR_PAGINA = 5;

function formatarData(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Notificações do jogador (notification-service): listar, marcar como lida e excluir.
export default class NotificationsScene extends Phaser.Scene {
    constructor() {
        super('NotificationsScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#080812');

        if (!hasToken()) {
            this.scene.start('LoginScene');
            return;
        }

        this.W = this.scale.width;
        this.H = this.scale.height;
        this.layer = null;
        this.pagina = 0;
        this.busy = false;
        this.lista = [];

        this.add.sprite(this.W / 2 - 112, 40, 'icon_bell').setScale(2.5);
        this.add.text(this.W / 2 - 88, 40, 'NOTIFICAÇÕES', {
            fontSize: this.W < 500 ? '24px' : '30px', color: '#d8b76a', fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        this.status = this.add.text(this.W / 2, this.H / 2, 'Carregando notificações...', {
            fontSize: '18px', color: '#d8b76a', align: 'center',
            wordWrap: { width: Math.min(380, this.W - 32) }
        }).setOrigin(0.5);

        this.toastText = this.add.text(this.W / 2, this.H - 100, '', {
            fontSize: '14px', color: '#ff8a80', align: 'center',
            wordWrap: { width: Math.min(520, this.W - 32) }
        }).setOrigin(0.5);

        const bw = Math.min(170, (this.W - 40) / 2);
        this.btnTodas = addButton(this, this.W / 2 - bw / 2 - 6, this.H - 48, bw, 40, 'MARCAR TODAS',
            () => this.marcarTodas(), { fontSize: '13px' });
        addButton(this, this.W / 2 + bw / 2 + 6, this.H - 48, bw, 40, 'VOLTAR',
            () => this.scene.start('TemporalMapScene'), { fontSize: '14px' });

        this.carregar(true);
    }

    async carregar(primeira = false) {
        try {
            const lista = await listNotifications();
            if (!this.sys.isActive()) return;

            if (this.status) { this.status.destroy(); this.status = null; }
            // mais recentes primeiro
            this.lista = [...lista].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            this.mostrar();
        } catch (erro) {
            if (!this.sys.isActive()) return;

            if (erro.status === 401 || erro.status === 403) {
                clearToken();
                this.scene.start('LoginScene');
                return;
            }

            if (primeira && this.status) {
                const indisponivel = erro.status === 404 || erro.status === 0 || erro.status >= 500;
                const dica = indisponivel
                    ? '\n\nO notification-service pode não estar no ar ou ainda não ter essas rotas.'
                    : '';
                this.status.setText(`${erro.message}${dica}\n\nToque para tentar de novo.`);
                this.status.setInteractive({ useHandCursor: true });
                this.status.once('pointerdown', () => this.scene.restart());
            } else {
                this.toastText.setText(erro.message);
            }
        }
    }

    mostrar() {
        if (this.layer) this.layer.destroy(true);
        this.layer = this.add.container(0, 0);
        this.toastText.setText('');

        const naoLidas = this.lista.filter((n) => n.status !== 'READ').length;
        this.btnTodas.setEnabled(naoLidas > 0);

        this.layer.add(this.add.text(this.W / 2, 78, naoLidas > 0 ? `${naoLidas} não lida(s)` : 'Tudo em dia', {
            fontSize: '13px', color: '#aab8cc'
        }).setOrigin(0.5));

        if (this.lista.length === 0) {
            this.layer.add(this.add.text(this.W / 2, this.H / 2 - 20, 'Nenhuma notificação por enquanto.', {
                fontSize: '17px', color: '#aab8cc'
            }).setOrigin(0.5));
            return;
        }

        const paginas = Math.ceil(this.lista.length / POR_PAGINA);
        this.pagina = Math.min(this.pagina, paginas - 1);
        const fatia = this.lista.slice(this.pagina * POR_PAGINA, (this.pagina + 1) * POR_PAGINA);

        const largura = Math.min(this.W - 32, 600);
        const altura = 70;
        const x = this.W / 2;

        fatia.forEach((n, i) => {
            const y = 124 + i * (altura + 8);
            const lida = n.status === 'READ';
            const tipo = TIPOS[n.notificationType] || { label: n.notificationType || 'AVISO', cor: '#aab8cc' };

            const fundo = this.add.rectangle(x, y, largura, altura, lida ? 0x10101c : 0x1b1b34)
                .setStrokeStyle(2, lida ? 0x263c5c : 0xd8b76a)
                .setInteractive({ useHandCursor: !lida });
            fundo.on('pointerdown', () => !lida && this.marcarLida(n));

            this.layer.add(fundo);
            this.layer.add(this.add.text(x - largura / 2 + 14, y - 26, tipo.label, {
                fontSize: '11px', color: tipo.cor, fontStyle: 'bold'
            }));
            this.layer.add(this.add.text(x - largura / 2 + 14 + 100, y - 26, formatarData(n.createdAt), {
                fontSize: '11px', color: '#7d8aa0'
            }));
            this.layer.add(this.add.text(x - largura / 2 + 14, y - 8, n.message, {
                fontSize: '14px', color: lida ? '#8a96ab' : '#ffffff',
                wordWrap: { width: largura - 90 }
            }));

            if (!lida) {
                this.layer.add(this.add.circle(x + largura / 2 - 62, y - 22, 5, 0xd8b76a));
            }

            addButton(this, x + largura / 2 - 28, y + 4, 36, 30, 'X',
                () => this.excluir(n), { container: this.layer, fontSize: '13px' });
        });

        if (paginas > 1) {
            const yPag = 124 + POR_PAGINA * (altura + 8) - 20;
            this.layer.add(this.add.text(x, yPag, `Página ${this.pagina + 1} de ${paginas}`, {
                fontSize: '12px', color: '#aab8cc'
            }).setOrigin(0.5));
            addButton(this, x - 110, yPag, 60, 26, '<', () => this.mudarPagina(-1, paginas),
                { container: this.layer, fontSize: '13px' });
            addButton(this, x + 110, yPag, 60, 26, '>', () => this.mudarPagina(1, paginas),
                { container: this.layer, fontSize: '13px' });
        }
    }

    mudarPagina(delta, paginas) {
        this.pagina = (this.pagina + delta + paginas) % paginas;
        this.mostrar();
    }

    async executar(acao) {
        if (this.busy) return;
        this.busy = true;
        try {
            await acao();
            if (!this.sys.isActive()) return;
            await this.carregar();
        } catch (erro) {
            if (this.sys.isActive()) this.toastText.setText(erro.message);
        } finally {
            this.busy = false;
        }
    }

    marcarLida(n) { return this.executar(() => markNotificationRead(n.id)); }

    marcarTodas() { return this.executar(() => markAllNotificationsRead()); }

    excluir(n) { return this.executar(() => deleteNotification(n.id)); }
}
