package com.chronosquest.battle_service.service;

import com.chronosquest.battle_service.model.CharacterSheet;
import com.chronosquest.battle_service.pattern.observer.BattleEventPublisher;
import com.chronosquest.battle_service.pattern.strategy.AgileDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.DamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.PhysicalDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.TemporalDamageStrategy;
import org.springframework.stereotype.Service;

@Service
public class BattleEngineService {

    private final BattleEventPublisher eventPublisher;

    public BattleEngineService(BattleEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public int processAttack(String attackType, CharacterSheet attackerSheet, int targetDefense) {
        DamageStrategy strategy;

        if ("TEMPORAL".equalsIgnoreCase(attackType)) {
            strategy = new TemporalDamageStrategy();
        } else if ("AGILE".equalsIgnoreCase(attackType)) {
            strategy = new AgileDamageStrategy();
        } else {
            strategy = new PhysicalDamageStrategy();
        }

        return strategy.calculateDamage(attackerSheet, targetDefense);
    }

    public void concludeBattle(Long battleId, Long userId, boolean victory) {
        eventPublisher.notifyListeners(battleId, userId, victory);
    }
}