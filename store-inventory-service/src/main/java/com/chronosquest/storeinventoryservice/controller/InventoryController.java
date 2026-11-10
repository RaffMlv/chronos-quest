package com.chronosquest.storeinventoryservice.controller;

import com.chronosquest.storeinventoryservice.dto.Dtos.AddItemRequest;
import com.chronosquest.storeinventoryservice.dto.Dtos.InventoryItemResponse;
import com.chronosquest.storeinventoryservice.dto.Dtos.PowerResponse;
import com.chronosquest.storeinventoryservice.dto.Dtos.UseItemResponse;
import com.chronosquest.storeinventoryservice.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/** Inventário por personagem. O dono é o usuário do token (subject do JWT). */
@RestController
@RequestMapping("/inventory/{characterId}")
public class InventoryController {

    private final InventoryService inventory;

    public InventoryController(InventoryService inventory) {
        this.inventory = inventory;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItemResponse>> list(@AuthenticationPrincipal Jwt jwt,
                                                            @PathVariable Long characterId) {
        return ResponseEntity.ok(inventory.list(userId(jwt), characterId));
    }

    @GetMapping("/power")
    public ResponseEntity<PowerResponse> power(@AuthenticationPrincipal Jwt jwt,
                                               @PathVariable Long characterId) {
        return ResponseEntity.ok(inventory.power(userId(jwt), characterId));
    }

    @PostMapping("/items")
    public ResponseEntity<Void> addItem(@AuthenticationPrincipal Jwt jwt,
                                        @PathVariable Long characterId,
                                        @RequestBody AddItemRequest request) {
        if (request.itemId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "itemId é obrigatório");
        }
        int quantity = request.quantity() == null ? 1 : request.quantity();
        inventory.addItem(userId(jwt), characterId, request.itemId(), quantity);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@AuthenticationPrincipal Jwt jwt,
                                           @PathVariable Long characterId,
                                           @PathVariable Long itemId) {
        inventory.removeItem(userId(jwt), characterId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/items/{itemId}/use")
    public ResponseEntity<UseItemResponse> useItem(@AuthenticationPrincipal Jwt jwt,
                                                   @PathVariable Long characterId,
                                                   @PathVariable Long itemId) {
        return ResponseEntity.ok(inventory.useItem(userId(jwt), characterId, itemId));
    }

    private static Long userId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
