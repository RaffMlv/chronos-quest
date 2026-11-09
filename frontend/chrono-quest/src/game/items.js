// Ícones e rótulos dos itens da loja (texturas geradas em game/assets.js).

export function iconFor(item) {
    const nome = (item.name || '').toLowerCase();
    if (nome.includes('espada')) return 'icon_sword';
    if (nome.includes('fogo')) return 'icon_fire';
    if (nome.includes('superior')) return 'icon_potion2';
    return item.type === 'WEAPON' ? 'icon_sword' : 'icon_potion';
}

export function effectText(item) {
    if (item.type === 'WEAPON') return `+${item.attackBonus} de ataque`;
    return `+${item.healAmount} de vida`;
}
