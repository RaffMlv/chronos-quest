package com.chronosquest.battle_service.pattern.state;

import com.chronosquest.battle_service.model.BattleSession;

public class EnemyTurnState implements BattleState {
    @Override
    public void handleTurn(BattleSession session) {
        session.setCurrentActor("ENEMY");
    }

    @Override
    public void nextState(BattleSession session) {
        session.setState(new PlayerTurnState());
    }
}