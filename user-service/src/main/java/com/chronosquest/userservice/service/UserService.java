package com.chronosquest.userservice.service;

import com.chronosquest.userservice.builder.UserBuilder;
import com.chronosquest.userservice.dto.RegisterUserRequest;
import com.chronosquest.userservice.dto.UserResponse;
import com.chronosquest.userservice.exception.UserAlreadyExistsException;
import com.chronosquest.userservice.model.User;
import com.chronosquest.userservice.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(RegisterUserRequest request){
        String username = request.username()
                .trim()
                .toLowerCase(Locale.ROOT);

        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);
        String displayName = request.displayName().trim();

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72){
            throw new IllegalArgumentException("Senha não pode exceder 72 caracteres.");
        }

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new UserAlreadyExistsException(
                    "Username já registrado."
            );
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new UserAlreadyExistsException(
                    "Email já registrado"
            );
        }

        User user = new UserBuilder()
                .username(username)
                .email(email)
                .displayName(displayName)
                .passwordHash(
                        passwordEncoder.encode(request.password())
                )
                .build();

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getDisplayName(),
                savedUser.getCreatedAt()
        );
    }
}
