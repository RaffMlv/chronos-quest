package com.chronosquest.storeinventoryservice.model;

import jakarta.persistence.*;

/** Moedas do jogador (a loja guarda o saldo; o user-service não tem esse dado). */
@Entity
@Table(name = "tb_wallet")
public class Wallet {

    public static final int INITIAL_COINS = 100;

    @Id
    private Long userId;

    @Column(nullable = false)
    private int coins;

    protected Wallet() {}

    public Wallet(Long userId, int coins) {
        this.userId = userId;
        this.coins = coins;
    }

    public Long getUserId() { return userId; }
    public int getCoins() { return coins; }
    public void setCoins(int coins) { this.coins = coins; }
}
