-- Rode depois de 01 e 02 (como root).
USE chronos_battle;

CREATE TABLE IF NOT EXISTS tb_battle_session (
    id                BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT       NOT NULL,
    character_id      BIGINT       NOT NULL,
    enemy_name        VARCHAR(255),
    era               VARCHAR(255),
    player_class      VARCHAR(255),
    strength          INT          NOT NULL,
    dexterity         INT          NOT NULL,
    intelligence      INT          NOT NULL,
    player_hp         INT          NOT NULL,
    player_max_hp     INT          NOT NULL,
    enemy_hp          INT          NOT NULL,
    enemy_max_hp      INT          NOT NULL,
    current_turn      VARCHAR(255),
    status            VARCHAR(255),
    last_damage_dealt INT          NOT NULL DEFAULT 0
);
