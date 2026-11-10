package com.chronosquest.storeinventoryservice.model;

import jakarta.persistence.*;

/** Quantidade de um item no inventário de um personagem de um jogador. */
@Entity
@Table(name = "tb_inventory_entry",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "character_id", "item_id"}))
public class InventoryEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "character_id", nullable = false)
    private Long characterId;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private int quantity;

    protected InventoryEntry() {}

    public InventoryEntry(Long userId, Long characterId, Long itemId, int quantity) {
        this.userId = userId;
        this.characterId = characterId;
        this.itemId = itemId;
        this.quantity = quantity;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getCharacterId() { return characterId; }
    public Long getItemId() { return itemId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
