package com.chronosquest.characterservice.factory;

import com.chronosquest.characterservice.model.CharacterClass;
import com.chronosquest.characterservice.model.CharacterEntity;

public class ParadoxistFactory extends CharacterFactory {
    @Override
    public CharacterEntity createCharacter(
            String name,
            Long userId,
            CharacterClass characterClass
    ) {
        validateClass(characterClass, "Paradoxista");

        CharacterEntity character = new CharacterEntity();
        character.setName(name);
        character.setUserId(userId);
        character.setCharacterClass(characterClass);

        return character;
    }
}
