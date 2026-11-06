import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import LoginScene from './scenes/LoginScene.js';
import RegisterScene from './scenes/RegisterScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import TemporalMapScene from './scenes/TemporalMapScene.js';
import ExplorationScene from './scenes/ExplorationScene.js';
import './styles/style.css';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#080812',

    dom: {
        createContainer: true
    },

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [MenuScene, LoginScene, RegisterScene, CharacterSelectScene, TemporalMapScene, ExplorationScene]
};

const game = new Phaser.Game(config);

console.log(
    'Cenas carregadas:',
    game.scene.getScenes().map(cena => cena.sys.settings.key)
);