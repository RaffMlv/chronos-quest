package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;

public interface CharacterSkillProduct {
    String getName();
    String getDescription();
    Integer getPower();
    DamageType getDamageType();
}
