package com.chronosquest.userservice.dto;
import java.time.Instant;

public record UserResponse(
        Long id,
        String username,
        String email,
        String displayName,
        Instant createdAt
) {}
