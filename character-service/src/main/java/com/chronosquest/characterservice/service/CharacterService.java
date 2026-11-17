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

import com.chronosquest.characterservice.factory.CharacterFactoryProvider;

import com.chronosquest.characterservice.builder.SpecialCharacterSheetBuilder;

import com.chronosquest.characterservice.abstractfactory.CharacterResourceFactory;
import com.chronosquest.characterservice.abstractfactory.CharacterResourceFactoryProvider;
import com.chronosquest.characterservice.abstractfactory.CharacterSkillProduct;
import com.chronosquest.characterservice.abstractfactory.CharacterEquipmentProduct;
import com.chronosquest.characterservice.model.CharacterSkill;

import com.chronosquest.characterservice.dto.CharacterSkillResponse;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final CharacterClassRepository characterClassRepository;

    private final CharacterFactoryProvider characterFactoryProvider;

    private final CharacterResourceFactoryProvider
            characterResourceFactoryProvider;

    public CharacterService(
            CharacterRepository characterRepository,
            CharacterClassRepository characterClassRepository,
            CharacterFactoryProvider characterFactoryProvider,
            CharacterResourceFactoryProvider characterResourceFactoryProvider
    ) {
        this.characterRepository = characterRepository;
        this.characterClassRepository = characterClassRepository;
        this.characterFactoryProvider = characterFactoryProvider;
        this.characterResourceFactoryProvider = characterResourceFactoryProvider;
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

        CharacterEntity character = characterFactoryProvider
                .getFactory(characterClass.getName())
                .createCharacter(
                        request.getName(),
                        userId,
                        characterClass
                );

        SpecialCharacterSheetBuilder sheetBuilder =
                new SpecialCharacterSheetBuilder();

        sheetBuilder.setCharacter(character);

        CharacterSheet sheet = sheetBuilder
                .buildSpecialSheet(characterClass)
                .build();

        character.setSheet(sheet);

        CharacterResourceFactory resourceFactory =
                characterResourceFactoryProvider.
                        getFactory(characterClass.getName()
                );
        CharacterSkillProduct skillProduct = resourceFactory.createSkill();

        CharacterEquipmentProduct equipmentProduct = resourceFactory.createEquipment();

        CharacterSkill skill = new CharacterSkill();

        skill.setName(skillProduct.getName());
        skill.setDescription(skillProduct.getDescription());
        skill.setPower(skillProduct.getPower());
        skill.setDamageType(skillProduct.getDamageType());

        character.addSkill(skill);


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

        List<CharacterSkillResponse> skillResponses =
                new ArrayList<>();

        for (CharacterSkill characterSkill : character.getSkills()){
            CharacterSkillResponse skillResponse =
                    new CharacterSkillResponse();

            skillResponse.setName(characterSkill.getName());
            skillResponse.setDescription(characterSkill.getDescription());
            skillResponse.setPower(characterSkill.getPower());
            skillResponse.setDamageType(characterSkill.getDamageType());

            skillResponses.add(skillResponse);
        }

        response.setSkills(skillResponses);

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


    @Transactional
    public CharacterResponse addExperience(Long characterId, Long userId, Long amount) {

        CharacterEntity character = characterRepository
                .findByIdAndUserId(characterId, userId)
                .orElseThrow(() -> new RuntimeException("Personagem não encontrado."));

        CharacterSheet sheet = character.getSheet();

        if (sheet == null) {
            throw new RuntimeException("Ficha do personagem não encontrada.");
        }

        long totalExperience = sheet.getExperience() + amount;

        int newLevel = (int) (totalExperience / 60) + 1;

        sheet.setExperience(totalExperience);
        sheet.setLevel(newLevel);

        return convertToResponse(character);
    }

}