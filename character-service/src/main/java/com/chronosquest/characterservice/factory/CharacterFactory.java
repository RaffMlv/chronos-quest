package com.chronosquest.characterservice.factory;

import com.chronosquest.characterservice.model.CharacterClass;
import com.chronosquest.characterservice.model.CharacterEntity;

public abstract class CharacterFactory {
    public abstract CharacterEntity createCharacter(
            String name,
            Long userId,
            CharacterClass characterClass
    );

    protected void validateClass(
            CharacterClass characterClass,
            String expectedClass
    ) {
        if(characterClass == null ||
            !expectedClass.equals(characterClass.getName())){
                throw new IllegalArgumentException(
                        "Esta fábrica não pode criar a classe selecionada"
                );
        }
    }
}
