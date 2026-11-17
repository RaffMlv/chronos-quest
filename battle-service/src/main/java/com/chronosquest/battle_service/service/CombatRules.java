
package com.chronosquest.battle_service.service;

import com.chronosquest.battle_service.model.CharacterSheet;
import com.chronosquest.battle_service.pattern.strategy.AgileDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.DamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.PhysicalDamageStrategy;
import com.chronosquest.battle_service.pattern.strategy.TemporalDamageStrategy;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Random;

public final class CombatRules {

    public static final String ATTACK = "ATTACK";
    public static final String SKILL = "SKILL";
    public static final String DEFEND = "DEFEND";

    public record Enemy(
            String name,
            int maxHp,
            int defense,
            int minDamage,
            int maxDamage,
            int xpReward
    ) {}

    public record SkillRule(
            int mpCost,
            double multiplier
    ) {}

    private static final DamageStrategy PHYSICAL =
            new PhysicalDamageStrategy();

    private static final DamageStrategy AGILE =
            new AgileDamageStrategy();

    private static final DamageStrategy TEMPORAL =
            new TemporalDamageStrategy();

    private CombatRules() {
    }

    public static Enemy enemyFor(String era) {

        if (era == null) {
            return null;
        }

        return switch (era.toLowerCase(Locale.ROOT)) {

            case "medieval" ->
                    new Enemy("Goblin de Guerra", 80, 3, 6, 11, 20);

            case "industrial" ->
                    new Enemy("Autômato a Vapor", 95, 5, 7, 12, 25);

            case "future" ->
                    new Enemy("Drone Sentinela", 100, 4, 8, 13, 30);

            default -> null;
        };
    }

    public static DamageStrategy strategyFor(String className) {

        String n = normalize(className);

        if (n.startsWith("guardi")) {
            return PHYSICAL;
        }

        if (n.startsWith("rastreador")) {
            return AGILE;
        }

        return TEMPORAL;
    }

    public static SkillRule skillFor(String className) {

        String n = normalize(className);

        if (n.startsWith("guardi")) {
            return new SkillRule(10, 1.5);
        }

        if (n.startsWith("rastreador")) {
            return new SkillRule(10, 1.7);
        }

        if (n.startsWith("cronomante")) {
            return new SkillRule(14, 2.0);
        }

        if (n.startsWith("bioengenheiro")) {
            return new SkillRule(12, 1.4);
        }

        if (n.startsWith("paradoxista")) {
            return new SkillRule(12, 1.8);
        }

        if (n.startsWith("artifice")) {
            return new SkillRule(12, 1.8);
        }

        return new SkillRule(12, 1.3);
    }

    public static boolean isValidAction(String action) {

        return action != null
                && (ATTACK.equalsIgnoreCase(action)
                || SKILL.equalsIgnoreCase(action)
                || DEFEND.equalsIgnoreCase(action));
    }

    public static int playerDamage(
            String className,
            CharacterSheet sheet,
            Enemy enemy,
            String action,
            Random rnd
    ) {

        if (DEFEND.equalsIgnoreCase(action)) {
            return 0;
        }

        int base = strategyFor(className)
                .calculateDamage(sheet, enemy.defense()) + 2;

        double multiplier = SKILL.equalsIgnoreCase(action)
                ? skillFor(className).multiplier()
                : 1.0;

        double variation = 0.85 + rnd.nextDouble() * 0.30;

        return Math.max(
                1,
                (int) Math.round(base * multiplier * variation)
        );
    }

    public static int enemyDamage(
            Enemy enemy,
            String playerAction,
            Random rnd
    ) {

        int base = enemy.minDamage()
                + rnd.nextInt(
                enemy.maxDamage() - enemy.minDamage() + 1
        );

        double multiplier = DEFEND.equalsIgnoreCase(playerAction)
                ? 0.5
                : 1.0;

        return Math.max(
                1,
                (int) Math.round(base * multiplier)
        );
    }

    private static String normalize(String value) {

        if (value == null) {
            return "";
        }

        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }
}
