// Batalha processada pelo Battle Service.
//
// O backend decide dano, vida, turno e resultado. Este arquivo só traduz a
// resposta (BattleResponse) para os eventos que a BattleScene sabe animar,
// com o mesmo formato usado por battleLocal.js.
//
// Limites do backend atual, que o front não esconde nem inventa:
//   - a vida inicial é fixa (jogador 100, inimigo 80) e não vem do character-service;
//   - não existe MP, XP nem recompensa na resposta;
//   - a resposta traz só o dano do jogador (lastDamageDealt). O dano do inimigo
//     é calculado aqui pela diferença da vida do jogador antes e depois.

import { startBattle, sendBattleAction } from './api.js';
import { classByName } from '../game/classes.js';

const ACTIONS = { attack: 'ATTACK', skill: 'SKILL', defend: 'DEFEND' };

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
            mp: 0,
            maxMp: 0
        },
        enemy: {
            name: data.enemyName || era.enemy.name,
            hp: data.enemyHp,
            maxHp: data.enemyMaxHp,
            xp: era.enemy.xp
        }
    };
}

function snap(pHp, eHp) {
    return { pHp, pMp: 0, eHp };
}

// action: 'attack' | 'skill' | 'defend'
// Retorna { events } no mesmo formato de battleLocal.playerAction.
export async function remoteAction(b, action) {
    if (b.over) return { events: [] };

    const data = await sendBattleAction(b.id, ACTIONS[action] || 'ATTACK');

    const events = [];
    const prevPlayerHp = b.player.hp;
    const dmg = data.lastDamageDealt;
    const skill = b.cls.skill;

    // 1) ação do jogador: o inimigo já aparece com a vida nova, o jogador ainda com a antiga
    if (action === 'defend') {
        events.push({
            actor: 'player', type: 'defend',
            log: `${b.player.name} se prepara para o impacto.`,
            after: snap(prevPlayerHp, data.enemyHp)
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
            after: snap(prevPlayerHp, data.enemyHp)
        });
    }

    b.enemy.hp = data.enemyHp;

    if (data.status === 'VICTORY') {
        // o backend encerra a batalha sem contra-ataque
        events.push({
            actor: 'enemy', type: 'dead',
            log: `${b.enemy.name} foi derrotado!`,
            after: snap(prevPlayerHp, data.enemyHp)
        });

        b.over = true;
        b.won = true;
        b.xp = data.xpReward ?? b.enemy.xp; // XP vem do Battle Service (só exibição: ninguém grava XP no personagem ainda)
        return { events };
    }

    // 2) contra-ataque do inimigo (diferença da vida do jogador)
    const enemyDmg = Math.max(0, prevPlayerHp - data.playerHp);
    b.player.hp = data.playerHp;

    events.push({
        actor: 'enemy', type: 'attack',
        dmg: enemyDmg,
        log: `${b.enemy.name} ataca: ${enemyDmg} de dano.`,
        after: snap(data.playerHp, data.enemyHp)
    });

    if (data.status === 'DEFEAT') {
        events.push({
            actor: 'player', type: 'dead',
            log: `${b.player.name} caiu...`,
            after: snap(data.playerHp, data.enemyHp)
        });

        b.over = true;
        b.won = false;
    }

    return { events };
}
