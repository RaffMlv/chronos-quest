package com.chronosquest.battle_service.service;

import com.chronosquest.battle_service.dto.BattleResponse;
import com.chronosquest.battle_service.dto.StartBattleRequest;
import com.chronosquest.battle_service.model.BattleSession;
import com.chronosquest.battle_service.repository.BattleRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class BattleEngineService {

    private final BattleRepository battleRepository;
    private final Random random = new Random();

    public BattleEngineService(BattleRepository battleRepository) {
        this.battleRepository = battleRepository;
    }

    public BattleResponse startBattle(Long userId, StartBattleRequest request) {
        BattleSession session = new BattleSession();
        session.setUserId(userId);
        session.setCharacterId(request.getCharacterId());
        session.setEnemyName(request.getEnemyName());
        session.setEra(request.getEra());

        session.setPlayerHp(100);
        session.setPlayerMaxHp(100);
        session.setEnemyHp(80);
        session.setEnemyMaxHp(80);

        session.setCurrentTurn("PLAYER");
        session.setStatus("IN_PROGRESS");
        session.setLastDamageDealt(0);

        battleRepository.save(session);
        return new BattleResponse(session);
    }

    public BattleResponse processTurn(Long battleId, String action) {
        BattleSession session = battleRepository.findById(battleId)
                .orElseThrow(() -> new RuntimeException("Batalha nao encontrada"));

        if (!"IN_PROGRESS".equals(session.getStatus())) {
            throw new IllegalStateException("Batalha encerrada");
        }

        int damage = 0;

        if ("ATTACK".equalsIgnoreCase(action)) {
            damage = random.nextInt(15) + 10;
        } else if ("SKILL".equalsIgnoreCase(action)) {
            damage = random.nextInt(25) + 15;
        } else if ("DEFEND".equalsIgnoreCase(action)) {
            damage = 0;
        }

        session.setLastDamageDealt(damage);
        int newEnemyHp = Math.max(0, session.getEnemyHp() - damage);
        session.setEnemyHp(newEnemyHp);

        if (newEnemyHp == 0) {
            session.setStatus("VICTORY");
            session.setCurrentTurn("NONE");
            battleRepository.save(session);
            return new BattleResponse(session);
        }

        int enemyDamage = random.nextInt(10) + 5;
        int newPlayerHp = Math.max(0, session.getPlayerHp() - enemyDamage);
        session.setPlayerHp(newPlayerHp);

        if (newPlayerHp == 0) {
            session.setStatus("DEFEAT");
            session.setCurrentTurn("NONE");
        } else {
            session.setCurrentTurn("PLAYER");
        }

        battleRepository.save(session);
        return new BattleResponse(session);
    }

    public BattleResponse getBattleState(Long battleId) {
        BattleSession session = battleRepository.findById(battleId)
                .orElseThrow(() -> new RuntimeException("Batalha nao encontrada"));
        return new BattleResponse(session);
    }
}