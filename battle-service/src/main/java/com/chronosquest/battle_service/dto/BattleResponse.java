
package com.chronosquest.battle_service.dto;

import com.chronosquest.battle_service.model.BattleSession;

public class BattleResponse {

    private Long battleId;
    private Long characterId;
    private String enemyName;

    private int playerHp;
    private int playerMaxHp;
    private int playerMp;
    private int playerMaxMp;

    private int enemyHp;
    private int enemyMaxHp;

    private String currentTurn;
    private String status;

    private int lastDamageDealt;
    private int xpReward;

    public BattleResponse(BattleSession session) {
        this(session, 0);
    }

    public BattleResponse(BattleSession session, int xpReward) {
        this.battleId = session.getId();
        this.characterId = session.getCharacterId();
        this.enemyName = session.getEnemyName();

        this.playerHp = session.getPlayerHp();
        this.playerMaxHp = session.getPlayerMaxHp();
        this.playerMp = session.getPlayerMp();
        this.playerMaxMp = session.getPlayerMaxMp();

        this.enemyHp = session.getEnemyHp();
        this.enemyMaxHp = session.getEnemyMaxHp();

        this.currentTurn = session.getCurrentTurn();
        this.status = session.getStatus();

        this.lastDamageDealt = session.getLastDamageDealt();
        this.xpReward = xpReward;
    }

    public Long getBattleId() {
        return battleId;
    }

    public Long getCharacterId() {
        return characterId;
    }

    public String getEnemyName() {
        return enemyName;
    }

    public int getPlayerHp() {
        return playerHp;
    }

    public int getPlayerMaxHp() {
        return playerMaxHp;
    }

    public int getPlayerMp() {
        return playerMp;
    }

    public int getPlayerMaxMp() {
        return playerMaxMp;
    }

    public int getEnemyHp() {
        return enemyHp;
    }

    public int getEnemyMaxHp() {
        return enemyMaxHp;
    }

    public String getCurrentTurn() {
        return currentTurn;
    }

    public String getStatus() {
        return status;
    }

    public int getLastDamageDealt() {
        return lastDamageDealt;
    }

    public int getXpReward() {
        return xpReward;
    }
}
