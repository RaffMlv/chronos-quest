package com.chronosquest.characterservice.repository;

import com.chronosquest.characterservice.model.CharacterClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterClassRepository
        extends JpaRepository<CharacterClass, Long> {
}
