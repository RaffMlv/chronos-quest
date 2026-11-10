package com.chronosquest.storeinventoryservice.patterns;

import com.chronosquest.storeinventoryservice.patterns.decorator.BaseCombatant;
import com.chronosquest.storeinventoryservice.patterns.decorator.Combatant;
import com.chronosquest.storeinventoryservice.patterns.decorator.WeaponDecorator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class WeaponDecoratorTest {

    @Test
    void semArmasUsaAtaqueBase() {
        Combatant c = new BaseCombatant();
        assertEquals(10, c.getAttackPower());
        assertEquals(0, c.getEquipment().size());
    }

    @Test
    void armasSomamBonus() {
        Combatant c = new WeaponDecorator(new WeaponDecorator(new BaseCombatant(), "Espada Mágica", 15),
                "Encantamento de Fogo", 8);
        assertEquals(33, c.getAttackPower());
        assertEquals(2, c.getEquipment().size());
        assertEquals("Espada Mágica (+15)", c.getEquipment().get(0));
    }
}
