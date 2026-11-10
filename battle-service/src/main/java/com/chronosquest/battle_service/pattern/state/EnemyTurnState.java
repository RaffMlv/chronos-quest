package com.chronosquest.battle_service.pattern.state;

import com.chronosquest.battle_service.model.BattleSession;

public class EnemyTurnState implements BattleState {
    @Override
    public void handleTurn(BattleSession session) {
        session.setCurrentTurn("ENEMY");
    }

    @Override
    public BattleState next() {
        return new PlayerTurnState();
    }
}
