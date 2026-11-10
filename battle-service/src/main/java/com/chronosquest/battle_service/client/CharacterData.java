package com.chronosquest.battle_service.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CharacterData(Long id, String name, String className, CharacterSheetData sheet) {}
