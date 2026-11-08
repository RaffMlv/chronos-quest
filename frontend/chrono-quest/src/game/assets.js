// Assets em pixel art desenhados por código (sem arquivos de imagem).
// Cada textura é pintada num <canvas> e registrada no Phaser pelo nome.
//
// Convenção de nomes:
//   hero_<classe>_<pose>      pose: idle0 idle1 walk0 walk1 attack
//   enemy_<epoca>_<0|1>
//   <epoca>_ground0..2, <epoca>_wall, <epoca>_deco0..1
//   shadow
//
// Para trocar por arte própria depois, basta carregar PNGs com esses mesmos
// nomes no preload (public/assets/characters e public/assets/cenarios).

import { CLASSES } from './classes.js';
import { ERAS } from './eras.js';

export const TILE = 16;

// ---------- utilidades ----------

export function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function hashString(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function px(ctx, color, x, y, w = 1, h = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function addTexture(scene, key, width, height, draw) {
    if (scene.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    scene.textures.addCanvas(key, canvas);
}

// ---------- heróis ----------

const ACCESSORIES = {
    guardiao(c, p, dy, ox) {
        px(c, '#9aa7b8', 5, 1 + dy, 6, 2); // elmo
        px(c, '#9aa7b8', 0 + ox, 7 + dy, 4, 6); // escudo
        px(c, p.accent, 1 + ox, 8 + dy, 2, 4);
    },
    rastreador(c, p, dy, ox) {
        px(c, '#3f7a4a', 4, 1 + dy, 8, 2); // capuz
        px(c, '#7a4a24', 13 + ox, 4 + dy, 1, 9); // arco
        px(c, '#e8e0c8', 14 + ox, 5 + dy, 1, 7); // corda
    },
    cronomante(c, p, dy, ox) {
        px(c, p.body, 5, 0 + dy, 6, 1); // chapéu
        px(c, '#7a4a24', 13 + ox, 4 + dy, 1, 11); // cajado
        px(c, '#7fe9ff', 12 + ox, 2 + dy, 3, 3); // orbe
        px(c, '#ffffff', 13 + ox, 3 + dy, 1, 1);
    },
    bioengenheiro(c, p, dy, ox) {
        px(c, '#ffffff', 13 + ox, 7 + dy, 2, 1); // frasco
        px(c, '#7fe9ff', 13 + ox, 8 + dy, 2, 3);
        px(c, p.accent, 7, 7 + dy, 2, 4); // faixa do jaleco
    },
    paradoxista(c, p, dy, ox) {
        px(c, p.accent, 13 + ox, 3 + dy, 1, 1); // losango flutuante
        px(c, p.accent, 12 + ox, 4 + dy, 3, 1);
        px(c, p.accent, 13 + ox, 5 + dy, 1, 1);
    },
    artifice(c, p, dy, ox) {
        px(c, '#ffb347', 5, 3 + dy, 6, 1); // óculos
        px(c, '#10131f', 6, 3 + dy, 1, 1);
        px(c, '#10131f', 9, 3 + dy, 1, 1);
        px(c, '#c0c7d0', 13 + ox, 8 + dy, 1, 5); // chave inglesa
        px(c, '#c0c7d0', 12 + ox, 7 + dy, 3, 1);
    }
};

function drawHero(ctx, cls, pose) {
    const p = cls.palette;
    const dy = pose === 'idle1' ? 1 : 0;
    const ox = pose === 'attack' ? 2 : 0;

    // pernas
    const leftH = pose === 'walk1' ? 2 : 3;
    const rightH = pose === 'walk0' ? 2 : 3;
    px(ctx, p.pants, 5, 12, 2, leftH);
    px(ctx, p.boots, 5, 12 + leftH, 2, 1);
    px(ctx, p.pants, 9, 12, 2, rightH);
    px(ctx, p.boots, 9, 12 + rightH, 2, 1);

    // corpo
    px(ctx, p.body, 4, 7 + dy, 8, 5);
    if (p.body2) px(ctx, p.body2, 8, 7 + dy, 4, 5);
    px(ctx, p.accent, 4, 10 + dy, 8, 1);

    // braços
    px(ctx, p.body, 3, 7 + dy, 1, 4);
    px(ctx, p.body, 12, 7 + dy, 1, 4);
    px(ctx, p.skin, 3, 11 + dy, 1, 1);
    px(ctx, p.skin, 12, 11 + dy, 1, 1);

    // cabeça
    px(ctx, p.skin, 5, 2 + dy, 6, 5);
    px(ctx, p.hair, 5, 1 + dy, 6, 2);
    px(ctx, p.hair, 4, 2 + dy, 1, 3);
    px(ctx, p.hair, 11, 2 + dy, 1, 3);
    px(ctx, '#10131f', 6, 4 + dy, 1, 1);
    px(ctx, '#10131f', 9, 4 + dy, 1, 1);

    ACCESSORIES[cls.key](ctx, p, dy, ox);

    if (pose === 'attack') {
        px(ctx, '#ffffff', 14, 6, 2, 1);
        px(ctx, '#ffffff', 15, 8, 1, 1);
    }
}

// ---------- inimigos ----------

function drawGoblin(c, f) {
    const dy = f;
    px(c, '#3f6b2a', 5, 13, 2, 2);
    px(c, '#3f6b2a', 9, 13, 2, 2);
    px(c, '#5a3b1e', 4, 8 + dy, 8, 5);
    px(c, '#3e2a14', 4, 11 + dy, 8, 1);
    px(c, '#6fae3d', 4, 2 + dy, 8, 6);
    px(c, '#6fae3d', 2, 3 + dy, 2, 2);
    px(c, '#6fae3d', 12, 3 + dy, 2, 2);
    px(c, '#ff3b3b', 5, 4 + dy, 2, 1);
    px(c, '#ff3b3b', 9, 4 + dy, 2, 1);
    px(c, '#10131f', 6, 6 + dy, 4, 1);
    px(c, '#ffffff', 6, 6 + dy, 1, 1);
    px(c, '#ffffff', 9, 6 + dy, 1, 1);
    px(c, '#c0c7d0', 13, 6 + dy, 1, 5);
    px(c, '#7a4a24', 13, 11 + dy, 1, 2);
}

function drawAutomaton(c, f) {
    const dy = f;
    px(c, '#3c424b', 5, 13, 2, 2);
    px(c, '#3c424b', 9, 13, 2, 2);
    px(c, '#59606b', 4, 6 + dy, 8, 7);
    px(c, '#3c424b', 4, 6 + dy, 8, 1);
    px(c, '#b5651d', 5, 8 + dy, 6, 2);
    px(c, '#ffb347', 6, 8 + dy, 4, 1);
    px(c, '#3c424b', 2, 7 + dy, 2, 5);
    px(c, '#3c424b', 12, 7 + dy, 2, 5);
    px(c, '#8a929e', 5, 1 + dy, 6, 5);
    px(c, '#8a929e', 4, 2 + dy, 8, 3);
    px(c, '#ff7a1a', 7, 3 + dy, 2, 2);
    px(c, '#3c424b', 11, 0 + dy, 2, 2);
    if (f === 0) px(c, '#c9cdd3', 12, 0, 1, 1);
}

function drawDrone(c, f) {
    const dy = f;
    px(c, '#1d2b4d', 5, 3 + dy, 6, 1);
    px(c, '#1d2b4d', 4, 4 + dy, 8, 7);
    px(c, '#1d2b4d', 3, 5 + dy, 10, 5);
    px(c, '#1d2b4d', 5, 11 + dy, 6, 1);
    px(c, '#7fe9ff', 3, 7 + dy, 10, 1);
    px(c, '#ff3b6b', 7, 5 + dy, 2, 2);
    px(c, '#ffffff', 7, 5 + dy, 1, 1);
    px(c, '#7fe9ff', 5, 12 + dy, 1, 2 + f);
    px(c, '#7fe9ff', 10, 12 + dy, 1, 2 + f);
    px(c, '#7fe9ff', 8, 1 + dy, 1, 2);
    px(c, '#ff3b6b', 8, 0 + dy, 1, 1);
}

const ENEMY_DRAW = { medieval: drawGoblin, industrial: drawAutomaton, future: drawDrone };

// ---------- cenários ----------

function speckle(ctx, rand, colors, count) {
    for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(rand() * colors.length)];
        px(ctx, color, Math.floor(rand() * TILE), Math.floor(rand() * TILE));
    }
}

function drawGround(ctx, era, variant) {
    const rand = mulberry32(hashString(era) + variant * 101);

    if (era === 'medieval') {
        px(ctx, '#4f8a3a', 0, 0, TILE, TILE);
        speckle(ctx, rand, ['#437a31', '#63a04a', '#3a6c2a'], 22);
        if (variant === 2) {
            px(ctx, '#8a6a3a', 3, 5, 8, 5);
            px(ctx, '#7a5c30', 5, 7, 5, 2);
        }
    } else if (era === 'industrial') {
        px(ctx, '#5b5650', 0, 0, TILE, TILE);
        px(ctx, '#47433e', 0, 0, TILE, 1);
        px(ctx, '#47433e', 0, 8, TILE, 1);
        const shift = variant * 3;
        px(ctx, '#47433e', (4 + shift) % TILE, 0, 1, 8);
        px(ctx, '#47433e', (11 + shift) % TILE, 8, 1, 8);
        speckle(ctx, rand, ['#6c665e', '#4f4a44'], 14);
    } else {
        px(ctx, '#141d36', 0, 0, TILE, TILE);
        px(ctx, '#1f2c54', 0, 0, TILE, 1);
        px(ctx, '#1f2c54', 0, 0, 1, TILE);
        px(ctx, '#1a2547', 8, 8, 8, 1);
        px(ctx, '#1a2547', 8, 8, 1, 8);
        if (variant === 1) px(ctx, '#4fd8ff', 4, 4, 1, 1);
        if (variant === 2) {
            px(ctx, '#2aa9d6', 11, 11, 2, 1);
            px(ctx, '#4fd8ff', 11, 11, 1, 1);
        }
    }
}

function drawWall(ctx, era) {
    const rand = mulberry32(hashString(era) + 7);

    if (era === 'medieval') {
        px(ctx, '#7d8794', 0, 0, TILE, TILE);
        px(ctx, '#5f6873', 0, 5, TILE, 1);
        px(ctx, '#5f6873', 0, 10, TILE, 1);
        px(ctx, '#5f6873', 4, 0, 1, 5);
        px(ctx, '#5f6873', 11, 5, 1, 5);
        px(ctx, '#5f6873', 6, 10, 1, 6);
        px(ctx, '#9aa4b0', 0, 0, TILE, 1);
        speckle(ctx, rand, ['#8b95a2', '#6c7683'], 10);
    } else if (era === 'industrial') {
        px(ctx, '#8a4b32', 0, 0, TILE, TILE);
        px(ctx, '#5a2f1e', 0, 4, TILE, 1);
        px(ctx, '#5a2f1e', 0, 9, TILE, 1);
        px(ctx, '#5a2f1e', 0, 14, TILE, 1);
        px(ctx, '#5a2f1e', 5, 0, 1, 4);
        px(ctx, '#5a2f1e', 11, 5, 1, 4);
        px(ctx, '#5a2f1e', 4, 10, 1, 4);
        px(ctx, '#c9a36a', 1, 1, 1, 1);
        px(ctx, '#c9a36a', 14, 1, 1, 1);
        px(ctx, '#c9a36a', 1, 14, 1, 1);
        px(ctx, '#c9a36a', 14, 14, 1, 1);
    } else {
        px(ctx, '#2a4a8a', 0, 0, TILE, TILE);
        px(ctx, '#4fd8ff', 0, 0, TILE, 1);
        px(ctx, '#4fd8ff', 0, 15, TILE, 1);
        px(ctx, '#1d3466', 2, 2, 12, 12);
        px(ctx, '#7fe9ff', 3, 7, 10, 1);
        px(ctx, '#2aa9d6', 3, 8, 10, 1);
    }
}

function drawDeco(ctx, era, variant) {
    if (era === 'medieval') {
        if (variant === 0) {
            px(ctx, '#6b4423', 7, 10, 2, 5);
            px(ctx, '#2f6b2a', 3, 2, 10, 9);
            px(ctx, '#2f6b2a', 5, 1, 6, 1);
            px(ctx, '#3f8a35', 4, 3, 6, 5);
            px(ctx, '#56a64a', 5, 4, 2, 2);
        } else {
            px(ctx, '#6c7683', 3, 8, 10, 6);
            px(ctx, '#8b95a2', 4, 7, 8, 2);
            px(ctx, '#9aa4b0', 5, 8, 3, 1);
        }
    } else if (era === 'industrial') {
        if (variant === 0) {
            px(ctx, '#8a5a2b', 4, 5, 8, 10);
            px(ctx, '#c9a36a', 4, 7, 8, 1);
            px(ctx, '#c9a36a', 4, 12, 8, 1);
            px(ctx, '#6e4620', 4, 5, 8, 1);
        } else {
            px(ctx, '#7a5a34', 2, 6, 12, 9);
            px(ctx, '#9a7444', 3, 7, 10, 7);
            px(ctx, '#5f4526', 7, 6, 2, 9);
            px(ctx, '#5f4526', 2, 10, 12, 1);
        }
    } else {
        if (variant === 0) {
            px(ctx, '#2aa9d6', 5, 5, 6, 9);
            px(ctx, '#4fd8ff', 7, 2, 2, 12);
            px(ctx, '#7fe9ff', 7, 3, 1, 4);
            px(ctx, '#ffffff', 7, 3, 1, 2);
        } else {
            px(ctx, '#2b3556', 3, 4, 10, 10);
            px(ctx, '#0b1230', 4, 5, 8, 5);
            px(ctx, '#4fd8ff', 5, 6, 6, 1);
            px(ctx, '#2aa9d6', 5, 8, 4, 1);
            px(ctx, '#ff3b6b', 10, 12, 2, 1);
        }
    }
}

// ---------- API pública ----------

export function generateAssets(scene) {
    CLASSES.forEach((cls) => {
        ['idle0', 'idle1', 'walk0', 'walk1', 'attack'].forEach((pose) => {
            addTexture(scene, `hero_${cls.key}_${pose}`, TILE, TILE, (ctx) => drawHero(ctx, cls, pose));
        });
    });

    ERAS.forEach((era) => {
        [0, 1].forEach((f) => {
            addTexture(scene, `enemy_${era.id}_${f}`, TILE, TILE, (ctx) => ENEMY_DRAW[era.id](ctx, f));
        });
        [0, 1, 2].forEach((v) => {
            addTexture(scene, `${era.id}_ground${v}`, TILE, TILE, (ctx) => drawGround(ctx, era.id, v));
        });
        addTexture(scene, `${era.id}_wall`, TILE, TILE, (ctx) => drawWall(ctx, era.id));
        [0, 1].forEach((v) => {
            addTexture(scene, `${era.id}_deco${v}`, TILE, TILE, (ctx) => drawDeco(ctx, era.id, v));
        });
    });

    addTexture(scene, 'shadow', 12, 5, (ctx) => {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(6, 2.5, 6, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

export function createAnimations(scene) {
    CLASSES.forEach((cls) => {
        const k = (pose) => ({ key: `hero_${cls.key}_${pose}` });

        if (!scene.anims.exists(`${cls.key}-idle`)) {
            scene.anims.create({ key: `${cls.key}-idle`, frames: [k('idle0'), k('idle1')], frameRate: 3, repeat: -1 });
        }
        if (!scene.anims.exists(`${cls.key}-walk`)) {
            scene.anims.create({ key: `${cls.key}-walk`, frames: [k('walk0'), k('idle0'), k('walk1'), k('idle0')], frameRate: 8, repeat: -1 });
        }
    });

    ERAS.forEach((era) => {
        if (!scene.anims.exists(`${era.id}-enemy`)) {
            scene.anims.create({
                key: `${era.id}-enemy`,
                frames: [{ key: `enemy_${era.id}_0` }, { key: `enemy_${era.id}_1` }],
                frameRate: 3,
                repeat: -1
            });
        }
    });
}
