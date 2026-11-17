package com.chronosquest.battle_service.pattern.observer;

public interface BattleEventListener {
    void onBattleCompleted(
            Long battleId,
            Long userId,
            Long characterId,
            String era,
            String bearerToken,
            boolean victory
    );
}