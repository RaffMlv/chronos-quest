package com.chronosquest.characterservice.builder;

import com.chronosquest.characterservice.model.CharacterClass;


public class SpecialCharacterSheetBuilder extends CharacterSheetBuilder {
    public SpecialCharacterSheetBuilder buildSpecialSheet(
            CharacterClass characterClass
    ) {
        String primary = characterClass.getPrimaryAttribute();
        String secondary = characterClass.getSecondaryAttribute();

        setLevel(1);
        setExperience(0L);

        setStrength(getAttributeValue(primary, secondary, "STRENGTH"));
        setDexterity(getAttributeValue(primary, secondary, "DEXTERITY"));
        setConstitution(getAttributeValue(primary, secondary, "CONSTITUTION"));
        setIntelligence(getAttributeValue(primary, secondary, "INTELLIGENCE"));
        setWisdom(getAttributeValue(primary, secondary, "WISDOM"));
        setCharisma(getAttributeValue(primary, secondary, "CHARISMA"));

        setHealthPoints(100);
        setMaxHealthPoints(100);

        setManaPoints(50);
        setMaxManaPoints(50);

        return this;
    }

    private Integer getAttributeValue(
            String primary,
            String secondary,
            String attribute
    ) {

        if (attribute.equals(primary)) {
            return 15;
        }

        if (attribute.equals(secondary)) {
            return 13;
        }

        return 10;
    }

}
