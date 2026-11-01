package com.chronosquest.userservice.service;

import com.chronosquest.userservice.dto.LoginRequest;
import com.chronosquest.userservice.dto.LoginResponse;
import com.chronosquest.userservice.model.User;
import com.chronosquest.userservice.repository.UserRepository;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String identifier = request.identifier()
                .trim()
                .toLowerCase(Locale.ROOT);

        User user = userRepository
                .findByEmailIgnoreCaseOrUsernameIgnoreCase(
                        identifier,
                        identifier
                )
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Credenciais inválidas"
                        )
                );

        if (!user.isActive()
                || !passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        )) {
            throw new BadCredentialsException(
                    "Credenciais inválidas"
            );
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getUsername()
        );

        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds()
        );
    }
}