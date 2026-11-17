package com.chronosquest.battle_service.pattern.observer;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class BattleEventPublisher {

    private final List<BattleEventListener> listeners;

    public BattleEventPublisher(List<BattleEventListener> listeners) {
        this.listeners = listeners;
    }

    public void notifyListeners(
            Long battleId,
            Long userId,
            Long characterId,
            String era,
            String bearerToken,
            boolean victory
    ) {
        for (BattleEventListener listener : listeners) {
            listener.onBattleCompleted(
                    battleId, userId, characterId, era, bearerToken, victory
            );
        }
    }
}