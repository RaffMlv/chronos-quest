package com.chronosquest.storeinventoryservice.service;

import com.chronosquest.storeinventoryservice.model.Wallet;
import com.chronosquest.storeinventoryservice.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WalletService {

    private final WalletRepository wallets;

    public WalletService(WalletRepository wallets) {
        this.wallets = wallets;
    }

    /** Carteira do jogador; na primeira vez ele ganha storeinventoryservice.Wallet.INITIAL_COINS moedas. */
    @Transactional
    public Wallet getOrCreate(Long userId) {
        return wallets.findById(userId)
                .orElseGet(() -> wallets.save(new Wallet(userId, Wallet.INITIAL_COINS)));
    }
}
