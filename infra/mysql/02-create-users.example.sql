CREATE USER IF NOT EXISTS 'chronos_user_app'@'localhost'
  IDENTIFIED BY 'SUA_SENHA_AQUI';

CREATE USER IF NOT EXISTS 'chronos_battle_app'@'localhost'
  IDENTIFIED BY 'SUA_SENHA_AQUI';

CREATE USER IF NOT EXISTS 'chronos_store_app'@'localhost'
  IDENTIFIED BY 'SUA_SENHA_AQUI';

CREATE USER IF NOT EXISTS 'chronos_notification_app'@'localhost'
  IDENTIFIED BY 'SUA_SENHA_AQUI';

GRANT ALL PRIVILEGES ON chronos_user.* TO 'chronos_user_app'@'localhost';
GRANT ALL PRIVILEGES ON chronos_battle.* TO 'chronos_battle_app'@'localhost';
GRANT ALL PRIVILEGES ON chronos_store.* TO 'chronos_store_app'@'localhost';
GRANT ALL PRIVILEGES ON chronos_notification.* TO 'chronos_notification_app'@'localhost';

FLUSH PRIVILEGES;