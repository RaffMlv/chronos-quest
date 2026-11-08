package com.chronosquest.characterservice.dto;

public class CharacterSheetResponse {

    private Integer level;
    private Long experience;

    private Integer strength;
    private Integer dexterity;
    private Integer constitution;
    private Integer intelligence;
    private Integer wisdom;
    private Integer charisma;

    private Integer healthPoints;
    private Integer maxHealthPoints;
    private Integer manaPoints;
    private Integer maxManaPoints;

    public CharacterSheetResponse() {
    }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Long getExperience() { return experience; }
    public void setExperience(Long experience) { this.experience = experience; }

    public Integer getStrength() { return strength; }
    public void setStrength(Integer strength) { this.strength = strength; }

    public Integer getDexterity() { return dexterity; }
    public void setDexterity(Integer dexterity) { this.dexterity = dexterity; }

    public Integer getConstitution() { return constitution; }
    public void setConstitution(Integer constitution) { this.constitution = constitution; }

    public Integer getIntelligence() { return intelligence; }
    public void setIntelligence(Integer intelligence) { this.intelligence = intelligence; }

    public Integer getWisdom() { return wisdom; }
    public void setWisdom(Integer wisdom) { this.wisdom = wisdom; }

    public Integer getCharisma() { return charisma; }
    public void setCharisma(Integer charisma) { this.charisma = charisma; }

    public Integer getHealthPoints() { return healthPoints; }
    public void setHealthPoints(Integer healthPoints) { this.healthPoints = healthPoints; }

    public Integer getMaxHealthPoints() { return maxHealthPoints; }
    public void setMaxHealthPoints(Integer maxHealthPoints) { this.maxHealthPoints = maxHealthPoints; }

    public Integer getManaPoints() { return manaPoints; }
    public void setManaPoints(Integer manaPoints) { this.manaPoints = manaPoints; }

    public Integer getMaxManaPoints() { return maxManaPoints; }
    public void setMaxManaPoints(Integer maxManaPoints) { this.maxManaPoints = maxManaPoints; }
}
