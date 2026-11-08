package com.chronosquest.userservice.repository;
import com.chronosquest.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    Optional<User> findByEmailIgnoreCaseOrUsernameIgnoreCase(
            String email,
            String username
    );
}
