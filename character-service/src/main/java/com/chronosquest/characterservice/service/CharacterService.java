package com.chronosquest.characterservice.service;

import com.chronosquest.characterservice.dto.CharacterResponse;
import com.chronosquest.characterservice.dto.CharacterSheetResponse;
import com.chronosquest.characterservice.dto.CreateCharacterRequest;

import com.chronosquest.characterservice.model.CharacterClass;
import com.chronosquest.characterservice.model.CharacterEntity;
import com.chronosquest.characterservice.model.CharacterSheet;

import com.chronosquest.characterservice.repository.CharacterClassRepository;
import com.chronosquest.characterservice.repository.CharacterRepository;

import com.chronosquest.characterservice.exception.ConflictException;
import com.chronosquest.characterservice.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final CharacterClassRepository characterClassRepository;

    public CharacterService(
            CharacterRepository characterRepository,
            CharacterClassRepository characterClassRepository
    ) {
        this.characterRepository = characterRepository;
        this.characterClassRepository = characterClassRepository;
    }

    @Transactional
    public CharacterResponse createCharacter(
            CreateCharacterRequest request,
            Long userId
    ) {

        if (characterRepository.existsByUserIdAndName(
                userId, request.getName())) {

            throw new ConflictException(
                    "Você já possui um personagem com esse nome."
            );
        }

        CharacterClass characterClass = characterClassRepository
                .findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Classe de personagem não encontrada."
                ));

        CharacterEntity character = new CharacterEntity();

        character.setName(request.getName());
        character.setUserId(userId);
        character.setCharacterClass(characterClass);

        CharacterSheet sheet = new CharacterSheet();

        sheet.setCharacter(character);
        character.setSheet(sheet);

        CharacterEntity savedCharacter =
                characterRepository.save(character);

        return convertToResponse(savedCharacter);
    }

    @Transactional(readOnly = true)
    public List<CharacterResponse> getCharactersByUser(Long userId) {

        return characterRepository.findAllByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CharacterResponse getCharacterById(
            Long characterId,
            Long userId
    ) {

        CharacterEntity character = characterRepository
                .findByIdAndUserId(characterId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Personagem não encontrado."
                ));

        return convertToResponse(character);
    }

    private CharacterResponse convertToResponse(
            CharacterEntity character
    ) {

        CharacterResponse response = new CharacterResponse();

        response.setId(character.getId());
        response.setName(character.getName());
        response.setClassId(character.getCharacterClass().getId());
        response.setClassName(character.getCharacterClass().getName());
        response.setCreatedAt(character.getCreatedAt());

        CharacterSheet sheet = character.getSheet();

        if (sheet != null) {
            CharacterSheetResponse sheetResponse =
                    new CharacterSheetResponse();

            sheetResponse.setLevel(sheet.getLevel());
            sheetResponse.setExperience(sheet.getExperience());

            sheetResponse.setStrength(sheet.getStrength());
            sheetResponse.setDexterity(sheet.getDexterity());
            sheetResponse.setConstitution(sheet.getConstitution());
            sheetResponse.setIntelligence(sheet.getIntelligence());
            sheetResponse.setWisdom(sheet.getWisdom());
            sheetResponse.setCharisma(sheet.getCharisma());

            sheetResponse.setHealthPoints(sheet.getHealthPoints());
            sheetResponse.setMaxHealthPoints(sheet.getMaxHealthPoints());
            sheetResponse.setManaPoints(sheet.getManaPoints());
            sheetResponse.setMaxManaPoints(sheet.getMaxManaPoints());

            response.setSheet(sheetResponse);
        }

        return response;
    }
}