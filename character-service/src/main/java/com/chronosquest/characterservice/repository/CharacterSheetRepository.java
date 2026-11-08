package com.chronosquest.characterservice.repository;

import com.chronosquest.characterservice.model.CharacterSheet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterSheetRepository
        extends JpaRepository<CharacterSheet, Long> {

    Optional<CharacterSheet> findByCharacterId(Long characterId);
}