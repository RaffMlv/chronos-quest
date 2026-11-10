package com.chronosquest.storeinventoryservice.model;

import jakarta.persistence.*;

/** Item do catálogo da loja. */
@Entity
@Table(name = "tb_item")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String name;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ItemType type;

    @Column(nullable = false)
    private int price;

    /** Bônus de ataque (armas). */
    private int attackBonus;

    /** Vida recuperada (poções). */
    private int healAmount;

    protected Item() {}

    public Item(String name, String description, ItemType type, int price, int attackBonus, int healAmount) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.price = price;
        this.attackBonus = attackBonus;
        this.healAmount = healAmount;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public ItemType getType() { return type; }
    public int getPrice() { return price; }
    public int getAttackBonus() { return attackBonus; }
    public int getHealAmount() { return healAmount; }
}
