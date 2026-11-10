-- Rode depois de 01 e 02 (como root). Loja e inventário usam o mesmo banco: chronos_store.
USE chronos_store;

CREATE TABLE IF NOT EXISTS tb_item (
    id           BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(80)  NOT NULL UNIQUE,
    description  VARCHAR(255),
    type         VARCHAR(20)  NOT NULL,   -- WEAPON | POTION
    price        INT          NOT NULL,
    attack_bonus INT          NOT NULL DEFAULT 0,
    heal_amount  INT          NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tb_inventory_entry (
    id           BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    item_id      BIGINT NOT NULL,
    quantity     INT    NOT NULL,
    CONSTRAINT uk_inventory UNIQUE (user_id, character_id, item_id)
);

CREATE TABLE IF NOT EXISTS tb_wallet (
    user_id BIGINT NOT NULL PRIMARY KEY,
    coins   INT    NOT NULL
);
-- O catálogo (4 itens) é criado pelo serviço na primeira subida (DataSeeder).
