package com.chronosquest.storeinventoryservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Configuration
public class JwtConfig {

    // Sem valor padrão: cada pessoa aponta para a chave do seu computador
    // pela variável de ambiente JWT_PUBLIC_KEY_LOCATION (ver application.yaml).
    @Value("${chronos.jwt.public-key-path}")
    private String publicKeyPath;

    @Bean
    public RSAPublicKey rsaPublicKey() throws Exception {
        // aceita "C:/pasta/public.pem" ou "file:C:/pasta/public.pem" (mesma variável dos outros serviços)
        String location = publicKeyPath.startsWith("file:")
                ? publicKeyPath.substring("file:".length()).replaceFirst("^/+(?=[A-Za-z]:)", "")
                : publicKeyPath;
        String pem = Files.readString(Path.of(location));

        String content = pem
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(content);

        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);

        return (RSAPublicKey) KeyFactory
                .getInstance("RSA")
                .generatePublic(keySpec);
    }

    @Bean
    public JwtDecoder jwtDecoder(RSAPublicKey publicKey) {
        return NimbusJwtDecoder
                .withPublicKey(publicKey)
                .build();
    }
}