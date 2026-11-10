package com.chronosquest.battle_service.pattern.state;

import com.chronosquest.battle_service.model.BattleSession;

/** Padrão State: de quem é o turno da batalha. */
public interface BattleState {
    /** Marca na sessão de quem é o turno atual. */
    void handleTurn(BattleSession session);

    /** Próximo estado depois que este turno termina. */
    BattleState next();
}
