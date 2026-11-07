// As três épocas do jogo. O campo `enemy` é o inimigo da época; os números
// são apenas da simulação local de batalha (ver services/battleLocal.js).

export const ERAS = [
    {
        id: 'future',
        ano: '2147',
        nome: 'O FUTURO',
        descricao: 'Uma civilização tecnológica.',
        cor: 0x174c80,
        sky: 0x0b1230,
        enemy: { key: 'future', name: 'Drone Sentinela', hp: 100, atk: 18, def: 4, xp: 30 }
    },
    {
        id: 'medieval',
        ano: '1247',
        nome: 'ERA MEDIEVAL',
        descricao: 'Reinos e antigas batalhas.',
        cor: 0x66502b,
        sky: 0x6f95bd,
        enemy: { key: 'medieval', name: 'Goblin de Guerra', hp: 80, atk: 15, def: 3, xp: 20 }
    },
    {
        id: 'industrial',
        ano: '1890',
        nome: 'ERA INDUSTRIAL',
        descricao: 'Máquinas e revolução.',
        cor: 0x40504a,
        sky: 0x4a4f57,
        enemy: { key: 'industrial', name: 'Autômato a Vapor', hp: 95, atk: 16, def: 5, xp: 25 }
    }
];

export function eraById(id) {
    return ERAS.find((e) => e.id === id) || ERAS[0];
}
