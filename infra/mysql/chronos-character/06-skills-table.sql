CREATE TABLE character_skills (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  character_id BIGINT NOT NULL,
                                  name VARCHAR(80) NOT NULL,
                                  description VARCHAR(500),
                                  power INT NOT NULL,
                                  damage_type VARCHAR(20) NOT NULL,

                                  CONSTRAINT fk_skill_character
                                      FOREIGN KEY (character_id)
                                          REFERENCES characters(id)
                                          ON DELETE CASCADE
);