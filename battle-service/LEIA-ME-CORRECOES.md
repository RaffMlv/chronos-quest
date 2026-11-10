## O que foi corrigido
- pom.xml: conflito de merge resolvido; adicionado driver H2 (o yaml usa H2 em memória).
- application.yaml: porta 8083, nome `battle-service`, Eureka, caminho da chave JWT por variável de ambiente.
- JwtConfig: removido o caminho fixo do PC da Ana (`C:/Users/anaca/...`).
- Padrão State: não compilava (`setCurrentActor`/`setState` não existiam). Agora `handleTurn` + `next()`.
- Batalha usa o personagem REAL: lê `GET /characters/{id}` no character-service (repassa o JWT), usa HP e atributos da ficha.
- Padrão Strategy agora é usado de verdade (classe -> fórmula de dano). Padrão Observer é chamado ao fim da batalha.
- Inimigo por era (medieval / industrial / future); DEFEND reduz o dano recebido; resposta traz `xpReward` na vitória.
- Segurança: só o dono da batalha pode agir/consultar (403); erros viram 400/404/409 (antes eram 500).
- Testes duplicados que quebravam removidos; adicionado CombatRulesTest.

## Variáveis de ambiente
- `CHRONOS_JWT_PUBLIC_KEY` = caminho do public.pem do user-service (obrigatória)
- `CHRONOS_CHARACTER_URL` = padrão http://localhost:8082

## Ainda NÃO feito (depende do time)
- Rotas do battle/notification no api-gateway.
- character-service não tem endpoint para gravar XP, então o XP é só exibido.
- Não compilei com Maven/Spring aqui (sem acesso ao Maven Central): rode `mvn clean test` e `mvn spring-boot:run`.
