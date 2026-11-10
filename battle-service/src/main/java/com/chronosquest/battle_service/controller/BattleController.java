package com.chronosquest.battle_service.controller;

import com.chronosquest.battle_service.dto.BattleActionRequest;
import com.chronosquest.battle_service.dto.BattleResponse;
import com.chronosquest.battle_service.dto.StartBattleRequest;
import com.chronosquest.battle_service.service.BattleEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/battles")
public class BattleController {

    private final BattleEngineService battleEngineService;

    public BattleController(BattleEngineService battleEngineService) {
        this.battleEngineService = battleEngineService;
    }

    @PostMapping("/start")
    public ResponseEntity<BattleResponse> startBattle(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody StartBattleRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        return ResponseEntity.ok(battleEngineService.startBattle(userId, jwt.getTokenValue(), request));
    }

    @PostMapping("/{id}/actions")
    public ResponseEntity<BattleResponse> processAction(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @RequestBody BattleActionRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        return ResponseEntity.ok(battleEngineService.processTurn(id, userId, request.getAction()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BattleResponse> getBattleState(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        Long userId = Long.valueOf(jwt.getSubject());
        return ResponseEntity.ok(battleEngineService.getBattleState(id, userId));
    }
}
