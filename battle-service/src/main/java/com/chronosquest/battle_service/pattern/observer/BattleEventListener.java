package com.chronosquest.battle_service.pattern.observer;

public interface BattleEventListener {
    void onBattleCompleted(Long battleId, Long userId, boolean victory);
}