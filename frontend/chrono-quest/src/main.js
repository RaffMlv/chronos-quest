import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import LoginScene from './scenes/LoginScene.js';
import RegisterScene from './scenes/RegisterScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import TemporalMapScene from './scenes/TemporalMapScene.js';
import ExplorationScene from './scenes/ExplorationScene.js';
import BattleScene from './scenes/BattleScene.js';
import './styles/style.css';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#080812',

    // pixel art nítida (sprites 16x16 ampliados)
    pixelArt: true,
    render: { pixelArt: true, antialias: false },

    dom: {
        createContainer: true
    },

    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [
        BootScene,
        MenuScene,
        LoginScene,
        RegisterScene,
        CharacterSelectScene,
        TemporalMapScene,
        ExplorationScene,
        BattleScene
    ]
};

const game = new Phaser.Game(config);

console.log(
    'Cenas carregadas:',
    game.scene.getScenes(false).map((cena) => cena.sys.settings.key)
);
