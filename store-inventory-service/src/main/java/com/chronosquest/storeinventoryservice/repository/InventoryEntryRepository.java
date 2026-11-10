package com.chronosquest.storeinventoryservice.repository;

import com.chronosquest.storeinventoryservice.model.InventoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryEntryRepository extends JpaRepository<InventoryEntry, Long> {

    List<InventoryEntry> findByUserIdAndCharacterId(Long userId, Long characterId);

    Optional<InventoryEntry> findByUserIdAndCharacterIdAndItemId(Long userId, Long characterId, Long itemId);
}
