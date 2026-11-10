# Variáveis de ambiente do Chronos Quest (PowerShell).
#
# COMO USAR
#  1. Copie este arquivo para  infra/env/variaveis-ambiente.ps1  (essa cópia é ignorada pelo Git)
#  2. Troque os valores abaixo pelos seus
#  3. Em CADA janela do PowerShell onde for rodar um serviço, execute:
#         . .\infra\env\variaveis-ambiente.ps1
#     e depois:  cd <serviço>; .\mvnw spring-boot:run
#
# CHAVES JWT (gere uma vez; nunca commite os .pem)
#     openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
#     openssl rsa -pubout -in private.pem -out public.pem
#   (o openssl vem com o Git for Windows: C:\Program Files\Git\usr\bin\openssl.exe)
#   ou rode GenerateRsaKeys no user-service passando a pasta como argumento.
# Use barras normais (/) nos caminhos.

# Senha dos usuários do MySQL (a MESMA usada no 02-create-users.example.sql e no 04)
$env:CHRONOS_DB_PASSWORD      = "SUA_SENHA_AQUI"

# user-service (assina o token)
$env:JWT_PRIVATE_KEY_PATH     = "C:/Users/SEU_USUARIO/chronos-secrets/private.pem"
$env:JWT_PUBLIC_KEY_PATH      = "C:/Users/SEU_USUARIO/chronos-secrets/public.pem"

# character, notification, gateway, battle e store (conferem o token)
$env:JWT_PUBLIC_KEY_LOCATION  = "file:C:/Users/SEU_USUARIO/chronos-secrets/public.pem"

# opcional: onde o battle encontra o character-service
# $env:CHRONOS_CHARACTER_URL  = "http://localhost:8082"
