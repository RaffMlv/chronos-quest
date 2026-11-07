// Classes jogáveis, conforme o script infra/mysql/04-character-database-tables.sql.
//
// ATENÇÃO: o character-service ainda não tem endpoint para listar classes.
// Os ids abaixo seguem a ordem do INSERT do script SQL (AUTO_INCREMENT 1..6).
// A resposta de /characters traz className, e o frontend usa o NOME para achar
// a aparência. Se um dia existir GET de classes, troque esta lista por ele.

export const ATTR_LABELS = {
    strength: 'FOR',
    dexterity: 'DES',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'SAB',
    charisma: 'CAR'
};

export const CLASSES = [
    {
        id: 1,
        key: 'guardiao',
        name: 'Guardião Temporal',
        role: 'Defesa e resistência',
        description: 'Especialista em defesa e resistência, capaz de suportar os efeitos das rupturas temporais.',
        primary: 'constitution',
        secondary: 'strength',
        skill: { name: 'Muralha do Tempo', mult: 1.5, cost: 10 },
        color: 0x3f7cff,
        palette: { skin: '#f0c8a0', hair: '#9aa7b8', body: '#3f5fa8', accent: '#d8b76a', pants: '#2b3a66', boots: '#1d2540' }
    },
    {
        id: 2,
        key: 'rastreador',
        name: 'Rastreador',
        role: 'Ataque à distância',
        description: 'Combatente ágil e preciso, especializado em rastreamento e ataques à distância.',
        primary: 'dexterity',
        secondary: 'wisdom',
        skill: { name: 'Flecha Precisa', mult: 1.7, cost: 10 },
        color: 0x28bd83,
        palette: { skin: '#e8b88a', hair: '#5b3a1e', body: '#3f7a4a', accent: '#c9a36a', pants: '#4a3a22', boots: '#2a2012' }
    },
    {
        id: 3,
        key: 'cronomante',
        name: 'Cronomante',
        role: 'Magia temporal',
        description: 'Manipulador da energia temporal, capaz de utilizar habilidades especiais.',
        primary: 'intelligence',
        secondary: 'wisdom',
        skill: { name: 'Pulso Cronal', mult: 2.0, cost: 14 },
        color: 0x9b59ff,
        palette: { skin: '#f0c8a0', hair: '#e8e0ff', body: '#6b3fb8', accent: '#7fe9ff', pants: '#3a2766', boots: '#201440' }
    },
    {
        id: 4,
        key: 'bioengenheiro',
        name: 'Bioengenheiro',
        role: 'Regeneração',
        description: 'Especialista em biotecnologia, regeneração e aprimoramentos biológicos.',
        primary: 'intelligence',
        secondary: 'constitution',
        skill: { name: 'Surto Regenerativo', mult: 1.4, cost: 12, heal: 12 },
        color: 0x2ec4b6,
        palette: { skin: '#d9a87c', hair: '#1b1f2a', body: '#e8f4f2', accent: '#2ec4b6', pants: '#4b6a68', boots: '#2a3a39' }
    },
    {
        id: 5,
        key: 'paradoxista',
        name: 'Paradoxista',
        role: 'Ilusões e paradoxos',
        description: 'Manipulador de paradoxos, ilusões e distorções da realidade.',
        primary: 'charisma',
        secondary: 'intelligence',
        skill: { name: 'Eco Paradoxal', mult: 1.8, cost: 12 },
        color: 0xd94fd0,
        palette: { skin: '#f0c8a0', hair: '#10131f', body: '#d94fd0', body2: '#1b1030', accent: '#ffffff', pants: '#2a1040', boots: '#10131f' }
    },
    {
        id: 6,
        key: 'artifice',
        name: 'Artífice',
        role: 'Engenhocas e tecnologia',
        description: 'Inventor e especialista em dispositivos tecnológicos e equipamentos avançados.',
        primary: 'intelligence',
        secondary: 'dexterity',
        skill: { name: 'Engenhoca', mult: 1.8, cost: 12 },
        color: 0xff9a3c,
        palette: { skin: '#e8b88a', hair: '#7a4a24', body: '#c9702a', accent: '#c0c7d0', pants: '#3a3a44', boots: '#1f1f26' }
    }
];

export function classByName(name) {
    return CLASSES.find((c) => c.name === name) || CLASSES[0];
}

export function classById(id) {
    return CLASSES.find((c) => c.id === id) || CLASSES[0];
}
