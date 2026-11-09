import Phaser from 'phaser';
import {
    listInventory, getAttackPower, useInventoryItem, removeInventoryItem, hasToken, clearToken
} from '../services/api.js';
import { iconFor, effectText } from '../game/items.js';
import { addButton } from '../game/ui.js';

// Inventário do personagem: lista (GET /inventory/{id}), poder de ataque (/power),
// usar poção (POST .../use) e descartar (DELETE .../items/{itemId}).
export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super('InventoryScene');
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
        this.layer = null;
        this.busy = false;

        this.add.text(this.W / 2, 40, 'INVENTÁRIO', {
            fontSize: this.W < 500 ? '26px' : '32px', color: '#d8b76a', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.W / 2, 74, this.character.name, {
            fontSize: '14px', color: '#aab8cc'
        }).setOrigin(0.5);

        this.status = this.add.text(this.W / 2, this.H / 2, 'Carregando inventário...', {
            fontSize: '18px', color: '#d8b76a', align: 'center',
            wordWrap: { width: Math.min(360, this.W - 32) }
        }).setOrigin(0.5);

        this.poderText = this.add.text(this.W / 2, this.H - 132, '', {
            fontSize: '14px', color: '#ffffff', align: 'center',
            wordWrap: { width: Math.min(560, this.W - 32) }
        }).setOrigin(0.5);

        this.toastText = this.add.text(this.W / 2, this.H - 100, '', {
            fontSize: '15px', color: '#9be29b', align: 'center',
            wordWrap: { width: Math.min(520, this.W - 32) }
        }).setOrigin(0.5);

        const bw = Math.min(170, (this.W - 40) / 2);
        addButton(this, this.W / 2 - bw / 2 - 6, this.H - 48, bw, 40, 'LOJA',
            () => this.scene.start('ShopScene'), { fontSize: '14px' });
        addButton(this, this.W / 2 + bw / 2 + 6, this.H - 48, bw, 40, 'VOLTAR',
            () => this.scene.start('TemporalMapScene'), { fontSize: '14px' });

        this.carregar(true);
    }

    toast(texto, erro = false) {
        this.toastText.setColor(erro ? '#ff8a80' : '#9be29b');
        this.toastText.setText(texto);
    }

    async carregar(primeira = false) {
        try {
            const [itens, poder] = await Promise.all([
                listInventory(this.character.id),
                getAttackPower(this.character.id)
            ]);
            if (!this.sys.isActive()) return;

            if (this.status) { this.status.destroy(); this.status = null; }
            this.itens = itens;
            this.mostrar(itens, poder);
        } catch (erro) {
            if (!this.sys.isActive()) return;

            if (erro.status === 401 || erro.status === 403) {
                clearToken();
                this.scene.start('LoginScene');
                return;
            }

            if (primeira && this.status) {
                this.status.setText(`${erro.message}\n\nToque para tentar de novo.`);
                this.status.setInteractive({ useHandCursor: true });
                this.status.once('pointerdown', () => this.scene.restart());
            } else {
                this.toast(erro.message, true);
            }
        }
    }

    mostrar(itens, poder) {
        if (this.layer) this.layer.destroy(true);
        this.layer = this.add.container(0, 0);

        const equip = poder.equipment.length ? `  (${poder.equipment.join(', ')})` : '';
        this.poderText.setText(`Poder de ataque: ${poder.attackPower}${equip}`);

        if (itens.length === 0) {
            this.layer.add(this.add.text(this.W / 2, this.H / 2 - 20,
                'Seu inventário está vazio.\nVisite a loja para comprar itens!', {
                    fontSize: '17px', color: '#aab8cc', align: 'center', lineSpacing: 6
                }).setOrigin(0.5));
            return;
        }

        const largura = Math.min(this.W - 32, 560);
        const altura = 68;
        const x = this.W / 2;
        const visiveis = itens.slice(0, Math.max(1, Math.floor((this.H - 290) / (altura + 8))));

        visiveis.forEach((item, i) => {
            const y = 120 + i * (altura + 8);

            this.layer.add(this.add.rectangle(x, y, largura, altura, 0x151526).setStrokeStyle(2, 0x263c5c));
            this.layer.add(this.add.sprite(x - largura / 2 + 36, y, iconFor(item)).setScale(3.2));
            this.layer.add(this.add.text(x - largura / 2 + 70, y - 14, `${item.name}  x${item.quantity}`, {
                fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
            }));
            this.layer.add(this.add.text(x - largura / 2 + 70, y + 8, effectText(item), {
                fontSize: '13px', color: '#d8b76a'
            }));

            if (item.type === 'POTION') {
                addButton(this, x + largura / 2 - 132, y, 76, 34, 'USAR',
                    () => this.usar(item), { container: this.layer, fontSize: '13px', fill: 0xd8b76a, color: '#080812' });
            } else {
                this.layer.add(this.add.text(x + largura / 2 - 132, y, 'EQUIPADA', {
                    fontSize: '12px', color: '#9be29b', fontStyle: 'bold'
                }).setOrigin(0.5));
            }

            addButton(this, x + largura / 2 - 42, y, 70, 34, 'DESCARTAR',
                () => this.descartar(item), { container: this.layer, fontSize: '10px' });
        });

        if (itens.length > visiveis.length) {
            this.layer.add(this.add.text(x, 120 + visiveis.length * (altura + 8), `+ ${itens.length - visiveis.length} item(ns)`, {
                fontSize: '12px', color: '#aab8cc'
            }).setOrigin(0.5));
        }
    }

    async usar(item) {
        if (this.busy) return;
        this.busy = true;
        try {
            const r = await useInventoryItem(this.character.id, item.itemId);
            if (!this.sys.isActive()) return;

            // Cura o HP da sessão (o mesmo que aparece na exploração e na batalha local).
            const rt = this.registry.get('runtime');
            if (rt && rt.id === this.character.id) {
                rt.hp = Math.min(rt.maxHp, rt.hp + r.healAmount);
            }
            this.toast(rt && rt.id === this.character.id
                ? `${r.message} (HP ${rt.hp}/${rt.maxHp})`
                : r.message);
            await this.carregar();
        } catch (erro) {
            if (this.sys.isActive()) this.toast(erro.message, true);
        } finally {
            this.busy = false;
        }
    }

    async descartar(item) {
        if (this.busy) return;
        this.busy = true;
        try {
            await removeInventoryItem(this.character.id, item.itemId);
            if (!this.sys.isActive()) return;
            this.toast(`${item.name} descartado.`);
            await this.carregar();
        } catch (erro) {
            if (this.sys.isActive()) this.toast(erro.message, true);
        } finally {
            this.busy = false;
        }
    }
}
