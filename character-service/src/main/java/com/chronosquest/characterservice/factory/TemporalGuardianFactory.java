package com.chronosquest.characterservice.factory;

import com.chronosquest.characterservice.model.CharacterClass;
import com.chronosquest.characterservice.model.CharacterEntity;

public class TemporalGuardianFactory extends CharacterFactory {
    @Override
    public CharacterEntity createCharacter(
            String name,
            Long userId,
            CharacterClass characterClass
    ) {
        validateClass(characterClass, "Guardião Temporal");

        CharacterEntity character = new CharacterEntity();
        character.setName(name);
        character.setUserId(userId);
        character.setCharacterClass(characterClass);

        return character;
    }
}
