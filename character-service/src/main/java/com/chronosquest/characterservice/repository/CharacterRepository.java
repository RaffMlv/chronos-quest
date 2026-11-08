package com.chronosquest.characterservice.repository;

import com.chronosquest.characterservice.model.CharacterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CharacterRepository
        extends JpaRepository<CharacterEntity, Long> {

    List<CharacterEntity> findAllByUserId(Long userId);

    Optional<CharacterEntity> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndName(Long userId, String name);
}
