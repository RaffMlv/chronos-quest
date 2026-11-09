USE chronos_user;

CREATE TABLE users (
                       id BIGINT NOT NULL AUTO_INCREMENT,

                       username VARCHAR(50) NOT NULL,
                       email VARCHAR(254) NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       display_name VARCHAR(80) NOT NULL,

                       created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                       updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                           ON UPDATE CURRENT_TIMESTAMP(6),

                       active BOOLEAN NOT NULL DEFAULT TRUE,

                       CONSTRAINT pk_users PRIMARY KEY (id),
                       CONSTRAINT uk_users_username UNIQUE (username),
                       CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;