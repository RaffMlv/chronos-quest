import Phaser from 'phaser';
import { generateAssets, createAnimations } from '../game/assets.js';

// Gera todas as texturas e animações antes de abrir o menu.
export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#080d1a');

        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Preparando o tempo...', {
            fontSize: '18px',
            color: '#d8b76a'
        }).setOrigin(0.5);

        generateAssets(this);
        createAnimations(this);

        this.scene.start('MenuScene');
    }
}
