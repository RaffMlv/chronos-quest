CREATE TABLE IF NOT EXISTS tb_battle_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    enemy_name VARCHAR(100) NOT NULL,
    era VARCHAR(50) NOT NULL,
    player_class VARCHAR(60) NOT NULL,
    strength INT NOT NULL,
    dexterity INT NOT NULL,
    intelligence INT NOT NULL,
    player_hp INT NOT NULL,
    player_max_hp INT NOT NULL,
    enemy_hp INT NOT NULL,
    enemy_max_hp INT NOT NULL,
    current_turn VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_damage_dealt INT DEFAULT 0
);
