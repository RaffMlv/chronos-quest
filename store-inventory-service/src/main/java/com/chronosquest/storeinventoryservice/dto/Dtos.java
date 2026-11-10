package com.chronosquest.storeinventoryservice.dto;

import java.util.List;

/** DTOs da API (records). */
public final class Dtos {

    private Dtos() {}

    public record AddItemRequest(Long itemId, Integer quantity) {}

    public record PurchaseRequest(Long characterId, Long itemId, Integer quantity) {}

    public record ItemResponse(Long id, String name, String description, String type,
                               int price, int attackBonus, int healAmount) {}

    public record InventoryItemResponse(Long itemId, String name, String type, int quantity,
                                        int attackBonus, int healAmount) {}

    public record UseItemResponse(String message, int healAmount, int remaining) {}

    public record PurchaseResponse(String itemName, int quantity, int totalSpent, int coinsLeft) {}

    public record WalletResponse(int coins) {}

    public record PowerResponse(int attackPower, List<String> equipment) {}
}
