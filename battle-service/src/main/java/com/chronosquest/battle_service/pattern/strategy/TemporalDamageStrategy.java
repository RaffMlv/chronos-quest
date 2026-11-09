package com.chronosquest.battle_service.pattern.strategy;

import com.chronosquest.battle_service.model.CharacterSheet;

public class TemporalDamageStrategy implements DamageStrategy {
    @Override
    public int calculateDamage(CharacterSheet attackerSheet, int targetDefense) {
        int attackPower = attackerSheet.getIntelligence();
        int reducedDefense = (int) (targetDefense * 0.7);
        int damage = (int) (attackPower * 1.3) - reducedDefense;
        return Math.max(damage, 5);
    }
}