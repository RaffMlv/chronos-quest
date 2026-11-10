package com.chronosquest.storeinventoryservice.patterns.decorator;

import java.util.ArrayList;
import java.util.List;

/** Soma o bônus de ataque de uma arma (ex.: Espada Mágica +15). */
public class WeaponDecorator extends EquipmentDecorator {

    private final String name;
    private final int attackBonus;

    public WeaponDecorator(Combatant wrapped, String name, int attackBonus) {
        super(wrapped);
        this.name = name;
        this.attackBonus = attackBonus;
    }

    @Override
    public int getAttackPower() {
        return super.getAttackPower() + attackBonus;
    }

    @Override
    public List<String> getEquipment() {
        List<String> list = new ArrayList<>(super.getEquipment());
        list.add(name + " (+" + attackBonus + ")");
        return list;
    }
}
