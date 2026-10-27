package com.school.management.auth;

public record LoginResponse(
    String token,
    String tokenType,
    long expiresIn
) {
}
