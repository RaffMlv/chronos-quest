package com.chronosquest.battle_service.repository;

import com.chronosquest.battle_service.model.BattleSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BattleRepository extends JpaRepository<BattleSession, Long> {
    List<BattleSession> findByUserIdAndActiveTrue(Long userId);
}