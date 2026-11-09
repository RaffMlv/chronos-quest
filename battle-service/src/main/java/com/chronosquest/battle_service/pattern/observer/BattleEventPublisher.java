package com.chronosquest.battle_service.pattern.observer;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class BattleEventPublisher {
    private final List<BattleEventListener> listeners = new ArrayList<>();

    public void subscribe(BattleEventListener listener) {
        listeners.add(listener);
    }

    public void notifyListeners(Long battleId, Long userId, boolean victory) {
        for (BattleEventListener listener : listeners) {
            listener.onBattleCompleted(battleId, userId, victory);
        }
    }
}