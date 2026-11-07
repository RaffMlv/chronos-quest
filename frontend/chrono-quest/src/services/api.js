// Camada de comunicação com os microsserviços.
//
// Só existem aqui os endpoints que estão implementados no backend:
//   user-service       POST /users, POST /auth/login, GET /users/me
//   character-service  POST /characters, GET /characters, GET /characters/{id}
//
// Battle, Inventory e Notification ainda não têm endpoints. Não adicione rotas
// para eles aqui até existirem no backend.

const BASE = import.meta.env.VITE_API_BASE || '/api';
const TOKEN_KEY = 'chronos.accessToken';

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
    return Boolean(getToken());
}

export function clearToken() {
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
        if (data.error) return data.error;
        if (data.message) return data.message;
    }
    if (status === 401) return 'Credenciais inválidas ou sessão expirada.';
    if (status === 403) return 'Acesso negado.';
    if (status === 404) return 'Recurso não encontrado.';
    if (status >= 500) return 'Erro no servidor. Tente novamente.';
    return 'Não foi possível concluir a operação.';
}

async function request(service, path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${BASE}/${service}${path}`, {
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
    return request('user', '/users', {
        method: 'POST',
        auth: false,
        body: { username, email, password, displayName }
    });
}

// identifier = username ou e-mail (campo do LoginRequest)
export async function login(identifier, password) {
    const data = await request('user', '/auth/login', {
        method: 'POST',
        auth: false,
        body: { identifier, password }
    });
    saveToken(data.accessToken);
    return data;
}

// ---- character-service ----

export function listCharacters() {
    return request('character', '/characters');
}

export function getCharacter(id) {
    return request('character', `/characters/${id}`);
}

export function createCharacter({ name, classId }) {
    return request('character', '/characters', {
        method: 'POST',
        body: { name, classId }
    });
}
