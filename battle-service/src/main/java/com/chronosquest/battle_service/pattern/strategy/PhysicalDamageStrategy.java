package com.chronosquest.battle_service.pattern.strategy;

import com.chronosquest.battle_service.model.CharacterSheet;

public class PhysicalDamageStrategy implements DamageStrategy {
    @Override
    public int calculateDamage(CharacterSheet attackerSheet, int targetDefense) {
        int attackPower = attackerSheet.getStrength();
        int damage = attackPower - (targetDefense / 2);
        return Math.max(damage, 1);
    }
}