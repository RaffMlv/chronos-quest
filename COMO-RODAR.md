# Como rodar (Chronos Quest)

## Portas
discovery 8761 · gateway 8080 · user 8081 · character 8082 · store-inventory 8083 · notification 8084 · battle 8085 · front (Vite) 5173

## 1. Banco (MySQL 8) — um banco por microsserviço
| Serviço | Banco | Usuário |
|---|---|---|
| user-service | `chronos_user` | `chronos_user_app` |
| character-service | `chronos_character` | `chronos_character_app` |
| battle-service | `chronos_battle` | `chronos_battle_app` |
| store-inventory-service (loja + inventário) | `chronos_store` | `chronos_store_app` |
| notification-service | `chronos_notification` | `chronos_notification_app` |
discovery-service e api-gateway não usam banco.

Rode como root, nesta ordem (troque SUA_SENHA_AQUI pela mesma senha nos scripts 02 e 04):
1. `infra/mysql/01-create-databases.sql`
2. `infra/mysql/02-create-users.example.sql`
3. `infra/mysql/chronos-user/03-user-tables.sql`
4. `infra/mysql/chronos-character/04-character-database-tables.sql` (cria o banco/usuário do character se ainda não existirem)
5. `infra/mysql/chronos-notification/05-notifications-table.sql`
6. `infra/mysql/chronos-character/06-skills-table.sql`
7. `infra/mysql/chronos-battle/07-battle-tables.sql`
8. `infra/mysql/chronos-store/08-store-tables.sql`

## 2. Chaves JWT e variáveis de ambiente
Copie `infra/env/variaveis-ambiente.example.ps1` para `infra/env/variaveis-ambiente.ps1` (ignorado pelo Git), preencha e execute em CADA janela do PowerShell antes de subir um serviço: `. .\infra\env\variaveis-ambiente.ps1`
O próprio arquivo explica como gerar as chaves (openssl, que vem com o Git for Windows, ou `GenerateRsaKeys` no user-service). Nunca commite os .pem.

| Variável | Usada por |
|---|---|
| `CHRONOS_DB_PASSWORD` | user, character, battle, store-inventory, notification |
| `JWT_PRIVATE_KEY_PATH`, `JWT_PUBLIC_KEY_PATH` | user-service |
| `JWT_PUBLIC_KEY_LOCATION` (`file:C:/.../public.pem`) | character, notification, gateway, battle, store-inventory |
| `CHRONOS_CHARACTER_URL` (opcional, padrão http://localhost:8082) | battle |

## 3. Pré-requisitos
JDK 27, Maven (ou o `mvnw` de cada serviço), Node 20+ e MySQL 8.

## 4. Subir (mvn spring-boot:run em cada pasta)
discovery-service → user-service → character-service → battle-service → store-inventory-service → notification-service → api-gateway

## 5. Front
`cd frontend/chrono-quest && npm install && npm run dev` → http://localhost:5173
O Vite faz proxy direto para os serviços (/api/user→8081, /api/character→8082, /api/shop→8083, /api/notification→8084, /api/battle→8085); o gateway não é obrigatório.
No menu, MODO TESTE roda sem backend. No Mapa Temporal há os botões LOJA, INVENTÁRIO e NOTIFICAÇÕES.

## Store / Inventário (via gateway: /api/store e /api/inventory)
- `GET /store/items` · `GET /store/wallet` · `POST /store/purchase` `{"characterId":1,"itemId":1,"quantity":1}`
- `GET /inventory/{characterId}` · `/power` · `POST .../items` · `DELETE .../items/{itemId}` · `POST .../items/{itemId}/use`
Cada jogador começa com 100 moedas; 4 itens são criados na primeira subida. Padrões: Facade (compra), Adapter (auditoria), Decorator (poder de ataque).

## Battle (via gateway: /api/battles)
`POST /battles/start` `{"characterId":1,"era":"medieval"}` · `POST /battles/{id}/actions` `{"action":"ATTACK|SKILL|DEFEND"}` · `GET /battles/{id}`
Lê o personagem real no character-service (repassa o token). Eras: medieval, industrial, future.

## Pendências conhecidas
- character-service sem endpoint para gravar XP (o XP da batalha só aparece na tela)
- o bônus de ataque das armas e as poções ainda não entram no cálculo da batalha do backend
- o inventário não confere se o personagem existe no character-service (é separado pelo usuário do token)
- Nada disso foi compilado com Maven pelo autor das correções: rode `mvn clean test` em cada serviço
