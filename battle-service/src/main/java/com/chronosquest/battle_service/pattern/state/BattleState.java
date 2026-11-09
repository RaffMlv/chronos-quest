package com.chronosquest.battle_service.pattern.state;

import com.chronosquest.battle_service.model.BattleSession;

public interface BattleState {
    void handleTurn(BattleSession session);
    void nextState(BattleSession session);
}