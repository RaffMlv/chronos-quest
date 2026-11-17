// Camada de comunicação com os microsserviços.
//
// Só existem aqui os endpoints que estão implementados no backend:
//   user-service       POST /users, POST /auth/login, GET /users/me
//   character-service  POST /characters, GET /characters, GET /characters/{id}
//   battle-service     POST /battles/start, POST /battles/{id}/actions, GET /battles/{id}
//   store-inventory    GET /store/items, GET /store/wallet, POST /store/purchase,
//                      GET /inventory/{characterId}, GET /inventory/{characterId}/power,
//                      DELETE /inventory/{characterId}/items/{itemId},
//                      POST /inventory/{characterId}/items/{itemId}/use
//   notification       GET /notifications, PATCH /notifications/{id}/read,
//                      PATCH /notifications/read-all, DELETE /notifications/{id}
//                      (código na branch discovery; na master o serviço ainda é só o esqueleto)
//
// Só adicione rotas aqui depois de conferir que existem no backend.

import { classById } from '../game/classes.js';

const BASE = import.meta.env.VITE_API_BASE || '/api';
const TOKEN_KEY = 'chronos.accessToken';

// Modo teste (só em desenvolvimento): personagens ficam na memória do navegador
// e nenhuma requisição é feita. Serve para testar o jogo sem o backend.
let offline = false;
const offlineCharacters = [];

export function enableOfflineMode() {
    if (import.meta.env.DEV) offline = true;
}

export function isOffline() {
    return offline;
}

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export function getToken() {
    try {
        return sessionStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function hasToken() {
    return offline || Boolean(getToken());
}

export function clearToken() {
    offline = false;
    try {
        sessionStorage.removeItem(TOKEN_KEY);
    } catch {
        /* sem armazenamento disponível */
    }
}

function saveToken(token) {
    try {
        sessionStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* sem armazenamento disponível */
    }
}

// user-service responde { erro }, character-service responde { error }.
function extractMessage(data, status) {
    if (data && typeof data === 'object') {
        if (data.erro) return data.erro;
        if (data.message) return data.message;
        if (data.error) return data.error;
    }
    if (status === 401) return 'Credenciais inválidas ou sessão expirada.';
    if (status === 403) return 'Acesso negado.';
    if (status === 404) return 'Recurso não encontrado.';
    if (status >= 500) return 'Erro no servidor. Tente novamente.';
    return 'Não foi possível concluir a operação.';
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${BASE}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch {
        throw new ApiError(0, 'Servidor indisponível. Verifique se os serviços estão rodando.');
    }

    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        throw new ApiError(response.status, extractMessage(data, response.status));
    }

    return data;
}
// ---- user-service ----

export function registerUser({ username, email, password, displayName }) {
    return request('/users', {
        method: 'POST',
        auth: false,
        body: { username, email, password, displayName }
    });
}

// identifier = username ou e-mail (campo do LoginRequest)
export async function login(identifier, password) {
    const data = await request('/auth/login', {
        method: 'POST',
        auth: false,
        body: { identifier, password }
    });

    saveToken(data.accessToken);
    return data;
}

// ---- character-service ----

export function listCharacters() {
    if (offline) return Promise.resolve([...offlineCharacters]);
    return request('/characters');
}

export function getCharacter(id) {
    if (offline) return Promise.resolve(offlineCharacters.find((c) => c.id === id));
    return request(`/characters/${id}`);
}

export function createCharacter({ name, classId }) {
    if (offline) {
        const cls = classById(classId);
        const personagem = {
            id: offlineCharacters.length + 1,
            name,
            classId: cls.id,
            className: cls.name,
            createdAt: new Date().toISOString(),
            sheet: {
                level: 1, experience: 0,
                strength: 10, dexterity: 10, constitution: 10,
                intelligence: 10, wisdom: 10, charisma: 10,
                healthPoints: 100, maxHealthPoints: 100,
                manaPoints: 50, maxManaPoints: 50
            }
        };
        offlineCharacters.push(personagem);
        return Promise.resolve(personagem);
    }

    return request('/characters', {
        method: 'POST',
        body: { name, classId }
    });
}
// ---- battle-service ----

// Resposta das três rotas (BattleResponse):
//   battleId, characterId, enemyName, playerHp, playerMaxHp, enemyHp,
//   enemyMaxHp, currentTurn, status (IN_PROGRESS | VICTORY | DEFEAT), lastDamageDealt

export function startBattle({ characterId, enemyName, era }) {
    return request('/battles/start', {
        method: 'POST',
        body: { characterId, enemyName, era }
    });
}

export function sendBattleAction(battleId, action) {
    return request(`/battles/${battleId}/actions`, {
        method: 'POST',
        body: { action }
    });
}

export function getBattle(battleId) {
    return request(`/battles/${battleId}`);
}

// ---- store-inventory-service (proxy /api/shop) ----
//
// Cada jogador começa com 100 moedas. O inventário é por personagem.

const OFFLINE_ITEMS = [
    { id: 1, name: 'Espada Mágica', description: 'Lâmina que ecoa através do tempo.', type: 'WEAPON', price: 50, attackBonus: 15, healAmount: 0 },
    { id: 2, name: 'Encantamento de Fogo', description: 'Chamas temporais na arma.', type: 'WEAPON', price: 40, attackBonus: 8, healAmount: 0 },
    { id: 3, name: 'Poção de Cura', description: 'Recupera 30 de vida.', type: 'POTION', price: 10, attackBonus: 0, healAmount: 30 },
    { id: 4, name: 'Poção Superior', description: 'Recupera 70 de vida.', type: 'POTION', price: 25, attackBonus: 0, healAmount: 70 }
];
let offlineCoins = 100;
const offlineInventory = new Map(); // `${characterId}:${itemId}` -> quantidade

const offlineItem = (id) => OFFLINE_ITEMS.find((i) => i.id === id);

function offlineEntries(characterId) {
    const list = [];
    for (const [key, quantity] of offlineInventory) {
        const [cid, iid] = key.split(':').map(Number);
        if (cid !== characterId) continue;
        const item = offlineItem(iid);
        list.push({
            itemId: item.id, name: item.name, type: item.type, quantity,
            attackBonus: item.attackBonus, healAmount: item.healAmount
        });
    }
    return list;
}

export function listStoreItems() {
    if (offline) return Promise.resolve(OFFLINE_ITEMS.map((i) => ({ ...i })));
    return request('/store/items');
}

export function getWallet() {
    if (offline) return Promise.resolve({ coins: offlineCoins });
    return request('/store/wallet');
}

export function purchaseItem({ characterId, itemId, quantity = 1 }) {
    if (offline) {
        const item = offlineItem(itemId);
        const total = item.price * quantity;
        if (offlineCoins < total) {
            return Promise.reject(new ApiError(400, `Moedas insuficientes: custa ${total} e você tem ${offlineCoins}`));
        }
        offlineCoins -= total;
        const key = `${characterId}:${itemId}`;
        offlineInventory.set(key, (offlineInventory.get(key) || 0) + quantity);
        return Promise.resolve({ itemName: item.name, quantity, totalSpent: total, coinsLeft: offlineCoins });
    }
    return request('/store/purchase', {
        method: 'POST',
        body: { characterId, itemId, quantity }
    });
}

export function listInventory(characterId) {
    if (offline) return Promise.resolve(offlineEntries(characterId));
    return request(`/inventory/${characterId}`);
}

// Poder de ataque somando as armas do inventário (padrão Decorator no backend)
export function getAttackPower(characterId) {
    if (offline) {
        const armas = offlineEntries(characterId).filter((e) => e.type === 'WEAPON');
        return Promise.resolve({
            attackPower: 10 + armas.reduce((t, e) => t + e.attackBonus, 0),
            equipment: armas.map((e) => `${e.name} (+${e.attackBonus})`)
        });
    }
    return request(`/inventory/${characterId}/power`);
}

export function useInventoryItem(characterId, itemId) {
    if (offline) {
        const item = offlineItem(itemId);
        const key = `${characterId}:${itemId}`;
        if (!offlineInventory.has(key)) return Promise.reject(new ApiError(404, 'Item não encontrado no inventário'));
        if (item.type !== 'POTION') {
            return Promise.reject(new ApiError(400, `${item.name} não é consumível (armas somam ataque automaticamente)`));
        }
        const remaining = offlineInventory.get(key) - 1;
        remaining > 0 ? offlineInventory.set(key, remaining) : offlineInventory.delete(key);
        return Promise.resolve({
            message: `${item.name} usada: +${item.healAmount} de vida`,
            healAmount: item.healAmount,
            remaining: Math.max(0, remaining)
        });
    }
    return request(`/inventory/${characterId}/items/${itemId}/use`, {
        method: 'POST'
    });
}

export function removeInventoryItem(characterId, itemId) {
    if (offline) {
        offlineInventory.delete(`${characterId}:${itemId}`);
        return Promise.resolve(null);
    }
    return request(`/inventory/${characterId}/items/${itemId}`, {
        method: 'DELETE'
    });
}

// ---- notification-service (proxy /api/notification) ----
//
// NotificationResponse: id, recipientName, notificationType (BATTLE | REWARD | MISSION |
// TEMPORAL_FRAGMENT), message, status (PENDING | SENT | READ), createdAt, sentAt

const offlineNotifications = [
    { id: 1, notificationType: 'MISSION', message: 'Bem-vindo ao Chronos Quest! Escolha uma época no Mapa Temporal.', status: 'SENT', createdAt: new Date().toISOString() },
    { id: 2, notificationType: 'REWARD', message: 'Você recebeu 100 moedas de boas-vindas. Visite a loja!', status: 'SENT', createdAt: new Date().toISOString() },
    { id: 3, notificationType: 'TEMPORAL_FRAGMENT', message: 'Um fragmento temporal foi detectado na era medieval.', status: 'SENT', createdAt: new Date().toISOString() }
];

export function listNotifications() {
    if (offline) return Promise.resolve(offlineNotifications.map((n) => ({ ...n })));
    return request('/notifications');
}

export function createNotification(payload) {
    return request('/notifications', {
        method: 'POST',
        body: payload
    });
}


export function markNotificationRead(id) {
    if (offline) {
        const n = offlineNotifications.find((x) => x.id === id);
        if (n) n.status = 'READ';
        return Promise.resolve(n ? { ...n } : null);
    }
    return request(`/notifications/${id}/read`, { method: 'PATCH' });
}

export function markAllNotificationsRead() {
    if (offline) {
        offlineNotifications.forEach((n) => { n.status = 'READ'; });
        return Promise.resolve(null);
    }
    return request('/notifications/read-all', { method: 'PATCH' });
}

export function deleteNotification(id) {
    if (offline) {
        const i = offlineNotifications.findIndex((x) => x.id === id);
        if (i >= 0) offlineNotifications.splice(i, 1);
        return Promise.resolve(null);
    }
    return request(`/notifications/${id}`, { method: 'DELETE' });
}
