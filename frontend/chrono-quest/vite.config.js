import { defineConfig } from 'vite';

// O backend ainda não tem CORS configurado. Em desenvolvimento, o Vite repassa
// as chamadas /api/<servico> para cada microsserviço (mesma origem para o navegador).
//
// Quando o api-gateway (8080) tiver rotas, basta apontar tudo para ele aqui
// e remover as entradas abaixo.
export default defineConfig({
    server: {
        proxy: {
            '/api/user': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/user/, '')
            },
            '/api/character': {
                target: 'http://localhost:8082',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/character/, '')
            }
        }
    }
});
