package com.chronosquest.userservice.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn
) {}