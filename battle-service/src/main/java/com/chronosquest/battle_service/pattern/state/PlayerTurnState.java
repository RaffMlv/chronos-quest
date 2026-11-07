package com.chronosquest.battle_service.pattern.state;

import com.chronosquest.battle_service.model.BattleSession;

public class PlayerTurnState implements BattleState {
    @Override
    public void handleTurn(BattleSession session) {
        session.setCurrentActor("PLAYER");
    }

    @Override
    public void nextState(BattleSession session) {
        session.setState(new EnemyTurnState());
    }
}