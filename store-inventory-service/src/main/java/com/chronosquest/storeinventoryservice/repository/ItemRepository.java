package com.chronosquest.storeinventoryservice.repository;

import com.chronosquest.storeinventoryservice.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
