package com.chronosquest.battle_service.service;

import com.chronosquest.battle_service.model.CharacterSheet;
import com.chronosquest.battle_service.pattern.strategy.AgileDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.PhysicalDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.TemporalDamageStrategy;
import org.junit.jupiter.api.Test;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

class CombatRulesTest {

    private final CharacterSheet sheet = new CharacterSheet(10, 10, 10);

    @Test
    void enemyPorEra() {
        assertEquals("Goblin de Guerra", CombatRules.enemyFor("medieval").name());
        assertEquals("Autômato a Vapor", CombatRules.enemyFor("industrial").name());
        assertEquals("Drone Sentinela", CombatRules.enemyFor("future").name());
        assertNull(CombatRules.enemyFor("jurassic"));
        assertNull(CombatRules.enemyFor(null));
    }

    @Test
    void estrategiaPorClasse() {
        assertInstanceOf(PhysicalDamageStrategy.class, CombatRules.strategyFor("Guardião Temporal"));
        assertInstanceOf(AgileDamageStrategy.class, CombatRules.strategyFor("Rastreador"));
        assertInstanceOf(TemporalDamageStrategy.class, CombatRules.strategyFor("Cronomante"));
        assertInstanceOf(TemporalDamageStrategy.class, CombatRules.strategyFor(null));
    }

    @Test
    void acoesValidas() {
        assertTrue(CombatRules.isValidAction("attack"));
        assertTrue(CombatRules.isValidAction("SKILL"));
        assertTrue(CombatRules.isValidAction("Defend"));
        assertFalse(CombatRules.isValidAction("fly"));
        assertFalse(CombatRules.isValidAction(null));
    }

    @Test
    void defesaNaoCausaDanoEReduzDanoRecebido() {
        CombatRules.Enemy e = CombatRules.enemyFor("medieval");
        Random rnd = new Random(1);
        assertEquals(0, CombatRules.playerDamage("Cronomante", sheet, e, "DEFEND", rnd));
        for (int i = 0; i < 200; i++) {
            int normal = CombatRules.enemyDamage(e, "ATTACK", rnd);
            int defended = CombatRules.enemyDamage(e, "DEFEND", rnd);
            assertTrue(normal >= e.minDamage() && normal <= e.maxDamage());
            assertTrue(defended >= 1 && defended <= (e.maxDamage() + 1) / 2);
        }
    }

    @Test
    void habilidadeCausaMaisDanoQueAtaque() {
        CombatRules.Enemy e = CombatRules.enemyFor("future");
        double atk = 0, skl = 0;
        Random rnd = new Random(7);
        for (int i = 0; i < 500; i++) {
            atk += CombatRules.playerDamage("Cronomante", sheet, e, "ATTACK", rnd);
            skl += CombatRules.playerDamage("Cronomante", sheet, e, "SKILL", rnd);
        }
        assertTrue(skl > atk);
    }
}
