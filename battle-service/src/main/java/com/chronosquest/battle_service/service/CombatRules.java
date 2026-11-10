package com.chronosquest.battle_service.service;

import com.chronosquest.battle_service.model.CharacterSheet;
import com.chronosquest.battle_service.pattern.strategy.AgileDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.DamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.PhysicalDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.TemporalDamageStrategy;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Random;

/**
 * Regras de combate sem dependência do Spring (fácil de testar).
 * Usa o padrão Strategy para escolher a fórmula de dano pela classe do personagem.
 */
public final class CombatRules {

    public static final String ATTACK = "ATTACK";
    public static final String SKILL = "SKILL";
    public static final String DEFEND = "DEFEND";

    public record Enemy(String name, int maxHp, int defense, int minDamage, int maxDamage, int xpReward) {}

    private static final DamageStrategy PHYSICAL = new PhysicalDamageStrategy();
    private static final DamageStrategy AGILE = new AgileDamageStrategy();
    private static final DamageStrategy TEMPORAL = new TemporalDamageStrategy();

    private CombatRules() {}

    /** Inimigo da era. Retorna null se a era não existir. */
    public static Enemy enemyFor(String era) {
        if (era == null) return null;
        return switch (era.toLowerCase(Locale.ROOT)) {
            case "medieval" -> new Enemy("Goblin de Guerra", 80, 3, 6, 11, 20);
            case "industrial" -> new Enemy("Autômato a Vapor", 95, 5, 7, 12, 25);
            case "future" -> new Enemy("Drone Sentinela", 100, 4, 8, 13, 30);
            default -> null;
        };
    }

    /** Guardião → físico; Rastreador → ágil; demais classes → temporal. */
    public static DamageStrategy strategyFor(String className) {
        String n = normalize(className);
        if (n.startsWith("guardi")) return PHYSICAL;
        if (n.startsWith("rastreador")) return AGILE;
        return TEMPORAL;
    }

    public static boolean isValidAction(String action) {
        return ATTACK.equalsIgnoreCase(action)
                || SKILL.equalsIgnoreCase(action)
                || DEFEND.equalsIgnoreCase(action);
    }

    public static int playerDamage(String className, CharacterSheet sheet, Enemy enemy, String action, Random rnd) {
        if (DEFEND.equalsIgnoreCase(action)) return 0;
        // +2 fixo: deixa as 3 fórmulas (físico/ágil/temporal) com dano parecido no nível 1
        int base = strategyFor(className).calculateDamage(sheet, enemy.defense()) + 2;
        double mult = SKILL.equalsIgnoreCase(action) ? 1.3 : 1.0;
        double variation = 0.85 + rnd.nextDouble() * 0.30;
        return Math.max(1, (int) Math.round(base * mult * variation));
    }

    public static int enemyDamage(Enemy enemy, String playerAction, Random rnd) {
        int base = enemy.minDamage() + rnd.nextInt(enemy.maxDamage() - enemy.minDamage() + 1);
        double mult = DEFEND.equalsIgnoreCase(playerAction) ? 0.5 : 1.0;
        return Math.max(1, (int) Math.round(base * mult));
    }

    private static String normalize(String s) {
        if (s == null) return "";
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }
}
