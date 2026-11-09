package com.chronosquest.storeservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/characters/{id}/inventory")
public class InventoryController {

    @GetMapping
    public ResponseEntity> getInventory(@PathVariable Long id) {
        // Retorna o inventário do personagem
        return ResponseEntity.ok(Map.of("characterId", id, "items", List.of()));
    }

    @PostMapping("/items")
    public ResponseEntity<String> addItem(@PathVariable Long id, @RequestBody Map<String, Object> itemPayload) {
        // Adiciona um item ao inventário do personagem
        return ResponseEntity.ok("Item adicionado com sucesso ao inventário do personagem " + id);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id, @PathVariable Long itemId) {
        // Remove um item do inventário
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/items/{itemId}/use")
    public ResponseEntity<String> useItem(@PathVariable Long id, @PathVariable Long itemId) {
        // Utiliza um item específico do inventário
        return ResponseEntity.ok("Item " + itemId + " usado com sucesso pelo personagem " + id);
    }
}
