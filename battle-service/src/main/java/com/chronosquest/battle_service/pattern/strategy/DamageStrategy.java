package com.chronosquest.battle_service.pattern.strategy;

import com.chronosquest.battle_service.model.CharacterSheet;

public interface DamageStrategy {
    int calculateDamage(CharacterSheet attackerSheet, int targetDefense);
}