package com.chronosquest.storeinventoryservice.config;

import com.chronosquest.storeinventoryservice.model.Item;
import com.chronosquest.storeinventoryservice.model.ItemType;
import com.chronosquest.storeinventoryservice.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/** Cria o catálogo inicial se a tabela estiver vazia. */
@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedItems(ItemRepository items) {
        return args -> {
            if (items.count() > 0) return;
            items.saveAll(List.of(
                    new Item("Espada Mágica", "Lâmina que ecoa através do tempo.", ItemType.WEAPON, 50, 15, 0),
                    new Item("Encantamento de Fogo", "Chamas temporais na arma.", ItemType.WEAPON, 40, 8, 0),
                    new Item("Poção de Cura", "Recupera 30 de vida.", ItemType.POTION, 10, 0, 30),
                    new Item("Poção Superior", "Recupera 70 de vida.", ItemType.POTION, 25, 0, 70)
            ));
        };
    }
}
