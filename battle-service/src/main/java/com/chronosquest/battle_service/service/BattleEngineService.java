package com.chronosquest.battle_service.service;

import com.chronosquest.battle_service.client.CharacterClient;
import com.chronosquest.battle_service.client.CharacterData;
import com.chronosquest.battle_service.client.CharacterSheetData;
import com.chronosquest.battle_service.dto.BattleResponse;
import com.chronosquest.battle_service.dto.StartBattleRequest;
import com.chronosquest.battle_service.model.BattleSession;
import com.chronosquest.battle_service.model.CharacterSheet;
import com.chronosquest.battle_service.pattern.observer.BattleEventPublisher;
import com.chronosquest.battle_service.pattern.state.BattleState;
import com.chronosquest.battle_service.pattern.state.PlayerTurnState;
import com.chronosquest.battle_service.repository.BattleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Random;

@Service
public class BattleEngineService {

    private static final String IN_PROGRESS = "IN_PROGRESS";

    private final BattleRepository battleRepository;
    private final CharacterClient characterClient;
    private final BattleEventPublisher eventPublisher;
    private final Random random = new Random();

    public BattleEngineService(BattleRepository battleRepository,
                               CharacterClient characterClient,
                               BattleEventPublisher eventPublisher) {
        this.battleRepository = battleRepository;
        this.characterClient = characterClient;
        this.eventPublisher = eventPublisher;
    }

    public BattleResponse startBattle(Long userId, String bearerToken, StartBattleRequest request) {
        if (request.getCharacterId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "characterId é obrigatório");
        }
        CombatRules.Enemy enemy = CombatRules.enemyFor(request.getEra());
        if (enemy == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Era inválida. Use: medieval, industrial ou future");
        }

        // O character-service só devolve o personagem se ele for do dono do token.
        CharacterData character = characterClient.getCharacter(request.getCharacterId(), bearerToken);
        CharacterSheetData sheet = character.sheet();

        int maxHp = sheet.maxHealthPoints() > 0 ? sheet.maxHealthPoints() : 100;
        int hp = sheet.healthPoints() > 0 ? Math.min(sheet.healthPoints(), maxHp) : maxHp;

        BattleSession session = new BattleSession();
        session.setUserId(userId);
        session.setCharacterId(request.getCharacterId());
        session.setEra(request.getEra().toLowerCase());
        session.setEnemyName(enemy.name());
        session.setPlayerClass(character.className() == null ? "" : character.className());
        session.setStrength(sheet.strength());
        session.setDexterity(sheet.dexterity());
        session.setIntelligence(sheet.intelligence());
        session.setPlayerHp(hp);
        session.setPlayerMaxHp(maxHp);
        session.setEnemyHp(enemy.maxHp());
        session.setEnemyMaxHp(enemy.maxHp());
        session.setStatus(IN_PROGRESS);
        session.setLastDamageDealt(0);
        new PlayerTurnState().handleTurn(session);

        battleRepository.save(session);
        return new BattleResponse(session);
    }

    public BattleResponse processTurn(Long battleId, Long userId, String action) {
        BattleSession session = loadOwned(battleId, userId);

        if (!IN_PROGRESS.equals(session.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Batalha já encerrada");
        }
        if (!CombatRules.isValidAction(action)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ação inválida. Use: ATTACK, SKILL ou DEFEND");
        }

        CombatRules.Enemy enemy = CombatRules.enemyFor(session.getEra());
        CharacterSheet sheet = new CharacterSheet(
                session.getStrength(), session.getDexterity(), session.getIntelligence());

        // Turno do jogador
        BattleState state = new PlayerTurnState();
        state.handleTurn(session);

        int damage = CombatRules.playerDamage(session.getPlayerClass(), sheet, enemy, action, random);
        session.setLastDamageDealt(damage);
        session.setEnemyHp(Math.max(0, session.getEnemyHp() - damage));

        if (session.getEnemyHp() == 0) {
            session.setStatus("VICTORY");
            session.setCurrentTurn("NONE");
            battleRepository.save(session);
            eventPublisher.notifyListeners(session.getId(), userId, true);
            return new BattleResponse(session, enemy.xpReward());
        }

        // Turno do inimigo
        state = state.next();
        state.handleTurn(session);

        int enemyDamage = CombatRules.enemyDamage(enemy, action, random);
        session.setPlayerHp(Math.max(0, session.getPlayerHp() - enemyDamage));

        if (session.getPlayerHp() == 0) {
            session.setStatus("DEFEAT");
            session.setCurrentTurn("NONE");
            battleRepository.save(session);
            eventPublisher.notifyListeners(session.getId(), userId, false);
            return new BattleResponse(session);
        }

        state.next().handleTurn(session); // volta para o jogador
        battleRepository.save(session);
        return new BattleResponse(session);
    }

    public BattleResponse getBattleState(Long battleId, Long userId) {
        return new BattleResponse(loadOwned(battleId, userId));
    }

    private BattleSession loadOwned(Long battleId, Long userId) {
        BattleSession session = battleRepository.findById(battleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batalha não encontrada"));
        if (!session.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esta batalha pertence a outro jogador");
        }
        return session;
    }
}
