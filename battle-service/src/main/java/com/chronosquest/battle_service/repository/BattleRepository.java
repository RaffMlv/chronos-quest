package com.chronosquest.battle_service.repository;

import com.chronosquest.battle_service.model.BattleSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BattleRepository extends JpaRepository<BattleSession, Long> {
}