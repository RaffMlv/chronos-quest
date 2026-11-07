package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;

public class CharacterSkillProductImpl implements CharacterSkillProduct {

    private final String name;
    private final String description;
    private final Integer power;
    private final DamageType damageType;

    public CharacterSkillProductImpl(String name, String description, Integer power, DamageType damageType) {
        this.name = name;
        this.description = description;
        this.power = power;
        this.damageType = damageType;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public Integer getPower() {
        return power;
    }

    @Override
    public DamageType getDamageType() {
        return damageType;
    }
}
