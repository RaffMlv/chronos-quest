package com.chronosquest.storeinventoryservice.controller;

import com.chronosquest.storeinventoryservice.dto.Dtos.ItemResponse;
import com.chronosquest.storeinventoryservice.dto.Dtos.PurchaseRequest;
import com.chronosquest.storeinventoryservice.dto.Dtos.PurchaseResponse;
import com.chronosquest.storeinventoryservice.dto.Dtos.WalletResponse;
import com.chronosquest.storeinventoryservice.patterns.facade.LojaFacade;
import com.chronosquest.storeinventoryservice.repository.ItemRepository;
import com.chronosquest.storeinventoryservice.service.WalletService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/store")
public class StoreController {

    private final ItemRepository items;
    private final WalletService walletService;
    private final LojaFacade loja;

    public StoreController(ItemRepository items, WalletService walletService, LojaFacade loja) {
        this.items = items;
        this.walletService = walletService;
        this.loja = loja;
    }

    @GetMapping("/items")
    public ResponseEntity<List<ItemResponse>> catalog() {
        List<ItemResponse> list = items.findAll().stream()
                .map(i -> new ItemResponse(i.getId(), i.getName(), i.getDescription(), i.getType().name(),
                        i.getPrice(), i.getAttackBonus(), i.getHealAmount()))
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/wallet")
    public ResponseEntity<WalletResponse> wallet(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(new WalletResponse(walletService.getOrCreate(userId(jwt)).getCoins()));
    }

    @PostMapping("/purchase")
    public ResponseEntity<PurchaseResponse> purchase(@AuthenticationPrincipal Jwt jwt,
                                                     @RequestBody PurchaseRequest request) {
        if (request.characterId() == null || request.itemId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "characterId e itemId são obrigatórios");
        }
        int quantity = request.quantity() == null ? 1 : request.quantity();
        return ResponseEntity.ok(loja.comprar(userId(jwt), request.characterId(), request.itemId(), quantity));
    }

    private static Long userId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
