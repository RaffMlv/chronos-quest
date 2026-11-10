package com.chronosquest.storeinventoryservice.patterns.facade;

import com.chronosquest.storeinventoryservice.dto.Dtos.PurchaseResponse;
import com.chronosquest.storeinventoryservice.model.Item;
import com.chronosquest.storeinventoryservice.model.Wallet;
import com.chronosquest.storeinventoryservice.patterns.adapter.AuditService;
import com.chronosquest.storeinventoryservice.repository.ItemRepository;
import com.chronosquest.storeinventoryservice.repository.WalletRepository;
import com.chronosquest.storeinventoryservice.service.InventoryService;
import com.chronosquest.storeinventoryservice.service.WalletService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Padrão Facade: um único método esconde o fluxo de compra
 * (catálogo -> saldo -> débito -> inventário -> auditoria).
 */
@Service
public class LojaFacade {

    private final ItemRepository items;
    private final WalletService walletService;
    private final WalletRepository wallets;
    private final InventoryService inventory;
    private final AuditService audit;

    public LojaFacade(ItemRepository items, WalletService walletService, WalletRepository wallets,
                      InventoryService inventory, AuditService audit) {
        this.items = items;
        this.walletService = walletService;
        this.wallets = wallets;
        this.inventory = inventory;
        this.audit = audit;
    }

    @Transactional
    public PurchaseResponse comprar(Long userId, Long characterId, Long itemId, int quantity) {
        if (quantity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade deve ser pelo menos 1");
        }
        Item item = items.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não existe no catálogo"));

        int total = item.getPrice() * quantity;
        Wallet wallet = walletService.getOrCreate(userId);
        if (wallet.getCoins() < total) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Moedas insuficientes: custa " + total + " e você tem " + wallet.getCoins());
        }

        wallet.setCoins(wallet.getCoins() - total);
        wallets.save(wallet);
        inventory.addItem(userId, characterId, itemId, quantity);
        audit.log("user-" + userId, "PURCHASE " + quantity + "x " + item.getName() + " por " + total);

        return new PurchaseResponse(item.getName(), quantity, total, wallet.getCoins());
    }
}
