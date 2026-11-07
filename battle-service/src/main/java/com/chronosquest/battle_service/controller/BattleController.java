package com.chronosquest.battle_service.controller;

import com.chronosquest.battle_service.model.BattleSession;
import com.chronosquest.battle_service.model.CharacterSheet;
import com.chronosquest.battle_service.repository.BattleRepository;
import com.chronosquest.battle_service.service.BattleEngineService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/battles")
public class BattleController {

    private final BattleRepository battleRepository;
    private final BattleEngineService battleEngineService;

    public BattleController(BattleRepository battleRepository, BattleEngineService battleEngineService) {
        this.battleRepository = battleRepository;
        this.battleEngineService = battleEngineService;
    }

    @PostMapping("/start")
    public ResponseEntity<BattleSession> startBattle(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String enemyName
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        BattleSession session = new BattleSession();
        session.setUserId(userId);
        session.setEnemyName(enemyName);

        BattleSession saved = battleRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/calculate-damage")
    public ResponseEntity<Integer> calculateDamage(
            @RequestParam String type,
            @RequestBody CharacterSheet attackerSheet,
            @RequestParam int targetDefense
    ) {
        int damage = battleEngineService.processAttack(type, attackerSheet, targetDefense);
        return ResponseEntity.ok(damage);
    }
}