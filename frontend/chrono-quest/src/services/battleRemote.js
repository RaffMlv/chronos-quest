
import { startBattle, sendBattleAction } from './api.js';
import { classByName } from '../game/classes.js';

const ACTIONS = {
    attack: 'ATTACK',
    skill: 'SKILL',
    defend: 'DEFEND'
};

export async function createRemoteBattle({ character, era }) {
    const data = await startBattle({
        characterId: character.id,
        enemyName: era.enemy.name,
        era: era.id
    });

    return {
        remote: true,
        id: data.battleId,
        cls: classByName(character.className),
        over: data.status !== 'IN_PROGRESS',
        won: data.status === 'VICTORY',
        xp: 0,

        player: {
            name: character.name,
            hp: data.playerHp,
            maxHp: data.playerMaxHp,
            mp: data.playerMp,
            maxMp: data.playerMaxMp
        },

        enemy: {
            name: data.enemyName || era.enemy.name,
            hp: data.enemyHp,
            maxHp: data.enemyMaxHp,
            xp: era.enemy.xp
        }
    };
}

function snap(pHp, pMp, eHp) {
    return { pHp, pMp, eHp };
}

export async function remoteAction(b, action) {
    if (b.over) {
        return { events: [] };
    }

    const data = await sendBattleAction(
        b.id,
        ACTIONS[action] || 'ATTACK'
    );

    const events = [];

    const prevPlayerHp = b.player.hp;
    const prevPlayerMp = b.player.mp;

    const dmg = data.lastDamageDealt;
    const skill = b.cls.skill;

    // Ação do jogador.
    if (action === 'defend') {
        events.push({
            actor: 'player',
            type: 'defend',
            log: `${b.player.name} se prepara para o impacto.`,
            after: snap(
                prevPlayerHp,
                data.playerMp,
                data.enemyHp
            )
        });
    } else {
        events.push({
            actor: 'player',
            type: action === 'skill' ? 'skill' : 'attack',
            dmg,
            heal: 0,
            log: action === 'skill'
                ? `${b.player.name} usa ${skill.name}: ${dmg} de dano!`
                : `${b.player.name} ataca: ${dmg} de dano.`,
            after: snap(
                prevPlayerHp,
                data.playerMp,
                data.enemyHp
            )
        });
    }

    b.enemy.hp = data.enemyHp;

    if (data.status === 'VICTORY') {
        events.push({
            actor: 'enemy',
            type: 'dead',
            log: `${b.enemy.name} foi derrotado!`,
            after: snap(
                prevPlayerHp,
                data.playerMp,
                data.enemyHp
            )
        });

        b.player.mp = data.playerMp;
        b.over = true;
        b.won = true;
        b.xp = data.xpReward ?? b.enemy.xp;

        return { events };
    }

    // Contra-ataque do inimigo.
    const enemyDmg = Math.max(
        0,
        prevPlayerHp - data.playerHp
    );

    b.player.hp = data.playerHp;
    b.player.mp = data.playerMp;

    events.push({
        actor: 'enemy',
        type: 'attack',
        dmg: enemyDmg,
        log: `${b.enemy.name} ataca: ${enemyDmg} de dano.`,
        after: snap(
            data.playerHp,
            data.playerMp,
            data.enemyHp
        )
    });

    if (data.status === 'DEFEAT') {
        events.push({
            actor: 'player',
            type: 'dead',
            log: `${b.player.name} caiu...`,
            after: snap(
                data.playerHp,
                data.playerMp,
                data.enemyHp
            )
        });

        b.over = true;
        b.won = false;
    }

    return { events };
}
