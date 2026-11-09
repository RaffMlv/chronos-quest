package com.chronosquest.characterservice.builder;

import com.chronosquest.characterservice.model.CharacterEntity;
import com.chronosquest.characterservice.model.CharacterSheet;

public abstract class CharacterSheetBuilder {
    protected CharacterSheet sheet;
    public CharacterSheetBuilder(){
        this.sheet = new CharacterSheet();
    }

    public CharacterSheetBuilder setCharacter(
            CharacterEntity character
    ) {
        sheet.setCharacter(character);
        return this;
    }

    public CharacterSheetBuilder setLevel(Integer level) {
        sheet.setLevel(level);
        return this;
    }

    public CharacterSheetBuilder setExperience(Long experience) {
        sheet.setExperience(experience);
        return this;
    }

    public CharacterSheetBuilder setStrength(Integer strength) {
        sheet.setStrength(strength);
        return this;
    }

    public CharacterSheetBuilder setDexterity(Integer dexterity) {
        sheet.setDexterity(dexterity);
        return this;
    }

    public CharacterSheetBuilder setConstitution(Integer constitution) {
        sheet.setConstitution(constitution);
        return this;
    }

    public CharacterSheetBuilder setIntelligence(Integer intelligence) {
        sheet.setIntelligence(intelligence);
        return this;
    }

    public CharacterSheetBuilder setWisdom(Integer wisdom) {
        sheet.setWisdom(wisdom);
        return this;
    }

    public CharacterSheetBuilder setCharisma(Integer charisma) {
        sheet.setCharisma(charisma);
        return this;
    }

    public CharacterSheetBuilder setHealthPoints(Integer healthPoints) {
        sheet.setHealthPoints(healthPoints);
        return this;
    }

    public CharacterSheetBuilder setMaxHealthPoints(
            Integer maxHealthPoints
    ) {
        sheet.setMaxHealthPoints(maxHealthPoints);
        return this;
    }

    public CharacterSheetBuilder setManaPoints(Integer manaPoints) {
        sheet.setManaPoints(manaPoints);
        return this;
    }

    public CharacterSheetBuilder setMaxManaPoints(
            Integer maxManaPoints
    ) {
        sheet.setMaxManaPoints(maxManaPoints);
        return this;
    }

    public CharacterSheet build() {
        return sheet;
    }
}
