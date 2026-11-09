package com.chronosquest.characterservice.dto;

import com.chronosquest.characterservice.model.DamageType;

public class CharacterSkillResponse {
    private String name;
    private String description;
    private Integer power;
    private DamageType damageType;

    public CharacterSkillResponse(){
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPower() {
        return power;
    }

    public void setPower(Integer power) {
        this.power = power;
    }

    public DamageType getDamageType() {
        return damageType;
    }

    public void setDamageType(DamageType damageType) {
        this.damageType = damageType;
    }
}
