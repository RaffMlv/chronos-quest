// ============================================================================
// BATALHA LOCAL PROVISÓRIA
//
// O Battle Service ainda não tem endpoints. Este módulo só existe para o jogo
// ser jogável enquanto isso. Pela arquitetura do projeto, dano e resultado
// devem ser calculados no backend.
//
// Quando o Battle Service existir:
//   1. adicione as chamadas reais em services/api.js;
//   2. troque createBattle/playerAction por elas em scenes/BattleScene.js;
//   3. apague este arquivo.
// ============================================================================

import { classByName } from '../game/classes.js';

const rnd = (min, max) => min + Math.random() * (max - min);

function damage(atk, def, mult = 1, defending = false) {
    const raw = atk * mult * rnd(0.85, 1.15) - def * 0.5;
    const value = Math.max(1, Math.round(raw));
    return defending ? Math.max(1, Math.round(value * 0.4)) : value;
}

export function createBattle({ character, hp, mp }, enemyTemplate) {
    const cls = classByName(character.className);
    const sheet = character.sheet;
    const scale = 1 + (sheet.level - 1) * 0.15;

    return {
        cls,
        over: false,
        won: false,
        xp: 0,
        defending: false,
        player: {
            name: character.name,
            hp: hp ?? sheet.healthPoints,
            maxHp: sheet.maxHealthPoints,
            mp: mp ?? sheet.manaPoints,
            maxMp: sheet.maxManaPoints,
            atk: 6 + Math.round(sheet[cls.primary] * 0.9) + sheet.level * 2,
            def: 2 + Math.round(sheet.constitution * 0.5)
        },
        enemy: {
            name: enemyTemplate.name,
            hp: Math.round(enemyTemplate.hp * scale),
            maxHp: Math.round(enemyTemplate.hp * scale),
            atk: Math.round(enemyTemplate.atk * scale),
            def: enemyTemplate.def,
            xp: enemyTemplate.xp
        }
    };
}

function snapshot(b) {
    return { pHp: b.player.hp, pMp: b.player.mp, eHp: b.enemy.hp };
}

// action: 'attack' | 'skill' | 'defend'
// Retorna { error } ou { events }, onde cada evento descreve uma animação.
export function playerAction(b, action) {
    if (b.over) return { events: [] };

    const events = [];
    const skill = b.cls.skill;

    b.defending = false;

    if (action === 'skill') {
        if (b.player.mp < skill.cost) return { error: 'MP insuficiente.' };

        b.player.mp -= skill.cost;
        const dmg = damage(b.player.atk, b.enemy.def, skill.mult);
        b.enemy.hp = Math.max(0, b.enemy.hp - dmg);
        if (skill.heal) b.player.hp = Math.min(b.player.maxHp, b.player.hp + skill.heal);

        events.push({
            actor: 'player', type: 'skill', dmg,
            heal: skill.heal || 0,
            log: `${b.player.name} usa ${skill.name}: ${dmg} de dano!`,
            after: snapshot(b)
        });
    } else if (action === 'defend') {
        b.defending = true;
        b.player.mp = Math.min(b.player.maxMp, b.player.mp + 5);

        events.push({
            actor: 'player', type: 'defend',
            log: `${b.player.name} se prepara para o impacto.`,
            after: snapshot(b)
        });
    } else {
        const dmg = damage(b.player.atk, b.enemy.def);
        b.enemy.hp = Math.max(0, b.enemy.hp - dmg);

        events.push({
            actor: 'player', type: 'attack', dmg,
            log: `${b.player.name} ataca: ${dmg} de dano.`,
            after: snapshot(b)
        });
    }

    if (b.enemy.hp <= 0) {
        b.over = true;
        b.won = true;
        b.xp = b.enemy.xp;
        events.push({
            actor: 'enemy', type: 'dead',
            log: `${b.enemy.name} foi derrotado!`,
            after: snapshot(b)
        });
        return { events };
    }

    const dmg = damage(b.enemy.atk, b.player.def, 1, b.defending);
    b.player.hp = Math.max(0, b.player.hp - dmg);

    events.push({
        actor: 'enemy', type: 'attack', dmg,
        log: `${b.enemy.name} ataca: ${dmg} de dano.`,
        after: snapshot(b)
    });

    if (b.player.hp <= 0) {
        b.over = true;
        b.won = false;
        events.push({
            actor: 'player', type: 'dead',
            log: `${b.player.name} caiu...`,
            after: snapshot(b)
        });
    }

    return { events };
}
