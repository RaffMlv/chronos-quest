import Phaser from 'phaser';
import { listStoreItems, getWallet, purchaseItem, hasToken, clearToken } from '../services/api.js';
import { iconFor, effectText } from '../game/items.js';
import { addButton } from '../game/ui.js';

// Loja temporal: catálogo (GET /store/items), saldo (GET /store/wallet)
// e compra (POST /store/purchase) no store-inventory-service.
export default class ShopScene extends Phaser.Scene {
    constructor() {
        super('ShopScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#080812');

        this.character = this.registry.get('personagem');
        if (!hasToken() || !this.character) {
            this.scene.start('LoginScene');
            return;
        }

        this.W = this.scale.width;
        this.H = this.scale.height;
        this.coins = 0;
        this.busy = false;

        this.add.text(this.W / 2, 40, 'LOJA TEMPORAL', {
            fontSize: this.W < 500 ? '26px' : '32px', color: '#d8b76a', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.sprite(this.W / 2 - 40, 78, 'icon_coin').setScale(2);
        this.coinsText = this.add.text(this.W / 2 - 22, 78, '...', {
            fontSize: '18px', color: '#f2c94c', fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        this.status = this.add.text(this.W / 2, this.H / 2, 'Carregando a loja...', {
            fontSize: '18px', color: '#d8b76a', align: 'center',
            wordWrap: { width: Math.min(360, this.W - 32) }
        }).setOrigin(0.5);

        this.toastText = this.add.text(this.W / 2, this.H - 96, '', {
            fontSize: '15px', color: '#9be29b', align: 'center',
            wordWrap: { width: Math.min(520, this.W - 32) }
        }).setOrigin(0.5);

        this.rodape();
        this.carregar();
    }

    rodape() {
        const bw = Math.min(170, (this.W - 40) / 2);
        addButton(this, this.W / 2 - bw / 2 - 6, this.H - 48, bw, 40, 'INVENTÁRIO',
            () => this.scene.start('InventoryScene'), { fontSize: '14px' });
        addButton(this, this.W / 2 + bw / 2 + 6, this.H - 48, bw, 40, 'VOLTAR',
            () => this.scene.start('TemporalMapScene'), { fontSize: '14px' });
    }

    toast(texto, erro = false) {
        this.toastText.setColor(erro ? '#ff8a80' : '#9be29b');
        this.toastText.setText(texto);
    }

    async carregar() {
        try {
            const [itens, carteira] = await Promise.all([listStoreItems(), getWallet()]);
            if (!this.sys.isActive()) return;

            this.status.destroy();
            this.coins = carteira.coins;
            this.coinsText.setText(String(this.coins));
            this.mostrarItens(itens);
        } catch (erro) {
            if (!this.sys.isActive()) return;

            if (erro.status === 401 || erro.status === 403) {
                clearToken();
                this.scene.start('LoginScene');
                return;
            }

            this.status.setText(`${erro.message}\n\nToque para tentar de novo.`);
            this.status.setInteractive({ useHandCursor: true });
            this.status.once('pointerdown', () => this.scene.restart());
        }
    }

    mostrarItens(itens) {
        const largura = Math.min(this.W - 32, 560);
        const altura = 74;
        const x = this.W / 2;
        this.botoes = [];

        itens.forEach((item, i) => {
            const y = 130 + i * (altura + 10);

            this.add.rectangle(x, y, largura, altura, 0x151526).setStrokeStyle(2, 0x263c5c);
            this.add.sprite(x - largura / 2 + 36, y, iconFor(item)).setScale(3.5);

            this.add.text(x - largura / 2 + 72, y - 22, item.name, {
                fontSize: '17px', color: '#ffffff', fontStyle: 'bold'
            });
            this.add.text(x - largura / 2 + 72, y - 2, item.description || '', {
                fontSize: '12px', color: '#aab8cc', wordWrap: { width: largura - 230 }
            });
            this.add.text(x - largura / 2 + 72, y + 18, `${effectText(item)}  •  ${item.price} moedas`, {
                fontSize: '13px', color: '#d8b76a'
            });

            const botao = addButton(this, x + largura / 2 - 60, y, 100, 36, 'COMPRAR',
                () => this.comprar(item), { fontSize: '13px', fill: 0xd8b76a, color: '#080812' });
            this.botoes.push(botao);
        });
    }

    async comprar(item) {
        if (this.busy) return;
        this.busy = true;
        this.botoes.forEach((b) => b.setEnabled(false));
        this.toast('Comprando...');

        try {
            const r = await purchaseItem({
                characterId: this.character.id,
                itemId: item.id,
                quantity: 1
            });
            if (!this.sys.isActive()) return;

            this.coins = r.coinsLeft;
            this.coinsText.setText(String(this.coins));
            this.toast(`Comprou ${r.itemName} por ${r.totalSpent} moedas.`);
        } catch (erro) {
            if (!this.sys.isActive()) return;
            this.toast(erro.message, true);
        } finally {
            if (this.sys.isActive()) {
                this.busy = false;
                this.botoes.forEach((b) => b.setEnabled(true));
            }
        }
    }
}
