package com.school.management.auth;

import java.time.Instant;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final long TOKEN_LIFETIME_SECONDS = 1800;

    private final String adminUsername;
    private final String adminPasswordHash;
    private final JwtEncoder jwtEncoder;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            @Value("${ADMIN_USERNAME}") String adminUsername,
            @Value("${ADMIN_PASSWORD}") String adminPassword,
            JwtEncoder jwtEncoder,
            PasswordEncoder passwordEncoder) {

        this.adminUsername = adminUsername;
        this.adminPasswordHash = passwordEncoder.encode(adminPassword);
        this.jwtEncoder = jwtEncoder;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        boolean usernameMatches =
            adminUsername.equals(request.username());

        boolean passwordMatches =
            passwordEncoder.matches(
                request.password(),
                adminPasswordHash
            );

        if (!usernameMatches || !passwordMatches) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid username or password"
            );
        }

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("school-management")
            .subject(adminUsername)
            .issuedAt(now)
            .expiresAt(now.plusSeconds(TOKEN_LIFETIME_SECONDS))
            .claim("roles", java.util.List.of("ADMIN"))
            .build();

        JwsHeader header = JwsHeader
            .with(MacAlgorithm.HS256)
            .build();

        String token = jwtEncoder
            .encode(JwtEncoderParameters.from(header, claims))
            .getTokenValue();

        return new LoginResponse(
            token,
            "Bearer",
            TOKEN_LIFETIME_SECONDS
        );
    }
}
