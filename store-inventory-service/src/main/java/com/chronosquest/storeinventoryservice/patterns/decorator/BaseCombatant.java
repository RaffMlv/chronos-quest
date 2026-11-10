package com.chronosquest.storeinventoryservice.patterns.decorator;

import java.util.List;

public class BaseCombatant implements Combatant {

    public static final int BASE_ATTACK = 10;

    @Override
    public int getAttackPower() {
        return BASE_ATTACK;
    }

    @Override
    public List<String> getEquipment() {
        return List.of();
    }
}
