package com.chronosquest.storeinventoryservice.patterns.decorator;

import java.util.List;

/** Padrão Decorator: poder de ataque do personagem somando o equipamento. */
public interface Combatant {
    int getAttackPower();

    List<String> getEquipment();
}
