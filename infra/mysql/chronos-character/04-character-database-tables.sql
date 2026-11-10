CREATE DATABASE IF NOT EXISTS chronos_character
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'chronos_character_app'@'localhost'
IDENTIFIED BY 'SUA_SENHA_AQUI';

GRANT SELECT, INSERT, UPDATE, DELETE,
CREATE, ALTER, INDEX, REFERENCES
ON chronos_character.*
TO 'chronos_character_app'@'localhost';

USE chronos_character;

CREATE TABLE character_classes (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   name VARCHAR(60) NOT NULL UNIQUE,
                                   description VARCHAR(500),
                                   primary_attribute VARCHAR(30) NOT NULL,
                                   secondary_attribute VARCHAR(30) NOT NULL
);

CREATE TABLE characters (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            user_id BIGINT NOT NULL,
                            class_id BIGINT NOT NULL,
                            name VARCHAR(60) NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,

                            CONSTRAINT fk_character_class
                                FOREIGN KEY (class_id)
                                    REFERENCES character_classes(id),

                            CONSTRAINT uk_user_character_name
                                UNIQUE (user_id, name),

                            INDEX idx_characters_user_id (user_id)
);

CREATE TABLE character_sheets (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  character_id BIGINT NOT NULL UNIQUE,

                                  level INT NOT NULL DEFAULT 1,
                                  experience BIGINT NOT NULL DEFAULT 0,

                                  strength INT NOT NULL DEFAULT 10,
                                  dexterity INT NOT NULL DEFAULT 10,
                                  constitution INT NOT NULL DEFAULT 10,
                                  intelligence INT NOT NULL DEFAULT 10,
                                  wisdom INT NOT NULL DEFAULT 10,
                                  charisma INT NOT NULL DEFAULT 10,

                                  health_points INT NOT NULL DEFAULT 100,
                                  max_health_points INT NOT NULL DEFAULT 100,
                                  mana_points INT NOT NULL DEFAULT 50,
                                  max_mana_points INT NOT NULL DEFAULT 50,

                                  CONSTRAINT fk_sheet_character
                                      FOREIGN KEY (character_id)
                                          REFERENCES characters(id)
                                          ON DELETE CASCADE
);

INSERT INTO character_classes
(name, description, primary_attribute, secondary_attribute)
VALUES
    (
        'Guardião Temporal',
        'Especialista em defesa e resistência, capaz de suportar os efeitos das rupturas temporais.',
        'CONSTITUTION',
        'STRENGTH'
    ),
    (
        'Rastreador',
        'Combatente ágil e preciso, especializado em rastreamento e ataques à distância.',
        'DEXTERITY',
        'WISDOM'
    ),
    (
        'Cronomante',
        'Manipulador da energia temporal, capaz de utilizar habilidades especiais.',
        'INTELLIGENCE',
        'WISDOM'
    ),
    (
        'Bioengenheiro',
        'Especialista em biotecnologia, regeneração e aprimoramentos biológicos.',
        'INTELLIGENCE',
        'CONSTITUTION'
    ),
    (
        'Paradoxista',
        'Manipulador de paradoxos, ilusões e distorções da realidade.',
        'CHARISMA',
        'INTELLIGENCE'
    ),
    (
        'Artífice',
        'Inventor e especialista em dispositivos tecnológicos e equipamentos avançados.',
        'INTELLIGENCE',
        'DEXTERITY'
    );