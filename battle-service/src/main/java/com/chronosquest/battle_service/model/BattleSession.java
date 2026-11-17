package com.chronosquest.battle_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_battle_session")
public class BattleSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long characterId;
    private String enemyName;
    private String era;

    private String playerClass;
    private int strength;
    private int dexterity;
    private int intelligence;

    private int playerHp;
    private int playerMaxHp;
    private int playerMp;
    private int playerMaxMp;
    private int enemyHp;
    private int enemyMaxHp;

    private String currentTurn;
    private String status;
    private int lastDamageDealt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCharacterId() {
        return characterId;
    }

    public void setCharacterId(Long characterId) {
        this.characterId = characterId;
    }

    public String getEnemyName() {
        return enemyName;
    }

    public void setEnemyName(String enemyName) {
        this.enemyName = enemyName;
    }

    public String getEra() {
        return era;
    }

    public void setEra(String era) {
        this.era = era;
    }

    public int getPlayerHp() {
        return playerHp;
    }

    public void setPlayerHp(int playerHp) {
        this.playerHp = playerHp;
    }

    public int getPlayerMaxHp() {
        return playerMaxHp;
    }

    public void setPlayerMaxHp(int playerMaxHp) {
        this.playerMaxHp = playerMaxHp;
    }

    public int getPlayerMp() {
        return playerMp;
    }

    public void setPlayerMp(int playerMp) {
        this.playerMp = playerMp;
    }

    public int getPlayerMaxMp() {
        return playerMaxMp;
    }

    public void setPlayerMaxMp(int playerMaxMp) {
        this.playerMaxMp = playerMaxMp;
    }

    public int getEnemyHp() {
        return enemyHp;
    }

    public void setEnemyHp(int enemyHp) {
        this.enemyHp = enemyHp;
    }

    public int getEnemyMaxHp() {
        return enemyMaxHp;
    }

    public void setEnemyMaxHp(int enemyMaxHp) {
        this.enemyMaxHp = enemyMaxHp;
    }

    public String getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(String currentTurn) {
        this.currentTurn = currentTurn;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getLastDamageDealt() {
        return lastDamageDealt;
    }

    public void setLastDamageDealt(int lastDamageDealt) {
        this.lastDamageDealt = lastDamageDealt;
    }

    public String getPlayerClass() { return playerClass; }
    public void setPlayerClass(String playerClass) { this.playerClass = playerClass; }

    public int getStrength() { return strength; }
    public void setStrength(int strength) { this.strength = strength; }

    public int getDexterity() { return dexterity; }
    public void setDexterity(int dexterity) { this.dexterity = dexterity; }

    public int getIntelligence() { return intelligence; }
    public void setIntelligence(int intelligence) { this.intelligence = intelligence; }
}
