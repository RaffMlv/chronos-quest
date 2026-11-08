package com.chronosquest.battle_service.dto;

public class StartBattleRequest {
    private Long characterId;
    private String enemyName;
    private String era;

    public Long getCharacterId() { return characterId; }
    public void setCharacterId(Long characterId) { this.characterId = characterId; }

    public String getEnemyName() { return enemyName; }
    public void setEnemyName(String enemyName) { this.enemyName = enemyName; }

    public String getEra() { return era; }
    public void setEra(String era) { this.era = era; }
}