package com.chronosquest.battle_service.pattern.strategy;

import com.chronosquest.battle_service.model.CharacterSheet;

public class AgileDamageStrategy implements DamageStrategy {
    @Override
    public int calculateDamage(CharacterSheet attackerSheet, int targetDefense) {
        int attackPower = attackerSheet.getDexterity();
        int damage = (int) (attackPower * 1.1) - (targetDefense / 3);
        return Math.max(damage, 1);
    }
}