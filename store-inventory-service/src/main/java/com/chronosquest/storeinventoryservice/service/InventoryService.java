package com.chronosquest.storeinventoryservice.service;

import com.chronosquest.storeinventoryservice.dto.Dtos.InventoryItemResponse;
import com.chronosquest.storeinventoryservice.dto.Dtos.PowerResponse;
import com.chronosquest.storeinventoryservice.dto.Dtos.UseItemResponse;
import com.chronosquest.storeinventoryservice.model.InventoryEntry;
import com.chronosquest.storeinventoryservice.model.Item;
import com.chronosquest.storeinventoryservice.model.ItemType;
import com.chronosquest.storeinventoryservice.patterns.decorator.BaseCombatant;
import com.chronosquest.storeinventoryservice.patterns.decorator.Combatant;
import com.chronosquest.storeinventoryservice.patterns.decorator.WeaponDecorator;
import com.chronosquest.storeinventoryservice.repository.InventoryEntryRepository;
import com.chronosquest.storeinventoryservice.repository.ItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryEntryRepository entries;
    private final ItemRepository items;

    public InventoryService(InventoryEntryRepository entries, ItemRepository items) {
        this.entries = entries;
        this.items = items;
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> list(Long userId, Long characterId) {
        List<InventoryItemResponse> result = new ArrayList<>();
        for (InventoryEntry e : entries.findByUserIdAndCharacterId(userId, characterId)) {
            Item item = findItem(e.getItemId());
            result.add(new InventoryItemResponse(item.getId(), item.getName(), item.getType().name(),
                    e.getQuantity(), item.getAttackBonus(), item.getHealAmount()));
        }
        return result;
    }

    @Transactional
    public void addItem(Long userId, Long characterId, Long itemId, int quantity) {
        if (quantity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade deve ser pelo menos 1");
        }
        findItem(itemId); // valida que o item existe
        InventoryEntry entry = entries.findByUserIdAndCharacterIdAndItemId(userId, characterId, itemId)
                .orElseGet(() -> new InventoryEntry(userId, characterId, itemId, 0));
        entry.setQuantity(entry.getQuantity() + quantity);
        entries.save(entry);
    }

    @Transactional
    public void removeItem(Long userId, Long characterId, Long itemId) {
        InventoryEntry entry = findEntry(userId, characterId, itemId);
        entries.delete(entry);
    }

    @Transactional
    public UseItemResponse useItem(Long userId, Long characterId, Long itemId) {
        InventoryEntry entry = findEntry(userId, characterId, itemId);
        Item item = findItem(itemId);

        if (item.getType() != ItemType.POTION) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    item.getName() + " não é consumível (armas somam ataque automaticamente)");
        }

        int remaining = entry.getQuantity() - 1;
        if (remaining <= 0) {
            entries.delete(entry);
            remaining = 0;
        } else {
            entry.setQuantity(remaining);
            entries.save(entry);
        }
        return new UseItemResponse(item.getName() + " usada: +" + item.getHealAmount() + " de vida",
                item.getHealAmount(), remaining);
    }

    /** Padrão Decorator: empilha o bônus de cada arma do inventário. */
    @Transactional(readOnly = true)
    public PowerResponse power(Long userId, Long characterId) {
        Combatant combatant = new BaseCombatant();
        for (InventoryEntry e : entries.findByUserIdAndCharacterId(userId, characterId)) {
            Item item = findItem(e.getItemId());
            if (item.getType() == ItemType.WEAPON) {
                combatant = new WeaponDecorator(combatant, item.getName(), item.getAttackBonus());
            }
        }
        return new PowerResponse(combatant.getAttackPower(), combatant.getEquipment());
    }

    private InventoryEntry findEntry(Long userId, Long characterId, Long itemId) {
        return entries.findByUserIdAndCharacterIdAndItemId(userId, characterId, itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Item não encontrado no inventário"));
    }

    private Item findItem(Long itemId) {
        return items.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não existe no catálogo"));
    }
}
