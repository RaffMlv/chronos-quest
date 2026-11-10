package com.chronosquest.battle_service.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CharacterSheetData(
        int level,
        int strength,
        int dexterity,
        int intelligence,
        int healthPoints,
        int maxHealthPoints) {}
