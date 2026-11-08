package com.chronosquest.userservice;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;

public class GenerateRsaKeys {

    public static void main(String[] args) throws Exception {

        // Pasta onde as chaves serão armazenadas
        Path directory = Path.of(
                "C:\\Users\\Acer\\projetos\\chronos-secrets\\user-service"
        );

        Files.createDirectories(directory);

        // Gera o par de chaves RSA
        KeyPairGenerator generator =
                KeyPairGenerator.getInstance("RSA");

        generator.initialize(2048);

        KeyPair keyPair = generator.generateKeyPair();

        // Converte a chave privada para PEM (PKCS#8)
        String privateKey = toPem(
                "PRIVATE KEY",
                keyPair.getPrivate().getEncoded()
        );

        // Converte a chave pública para PEM (X.509)
        String publicKey = toPem(
                "PUBLIC KEY",
                keyPair.getPublic().getEncoded()
        );

        // Salva os arquivos
        Files.writeString(
                directory.resolve("private.pem"),
                privateKey
        );

        Files.writeString(
                directory.resolve("public.pem"),
                publicKey
        );

        System.out.println("Chaves RSA geradas com sucesso!");
    }

    private static String toPem(String type, byte[] key) {

        String encoded = Base64.getMimeEncoder(
                64,
                new byte[]{'\n'}
        ).encodeToString(key);

        return "-----BEGIN " + type + "-----\n"
                + encoded
                + "\n-----END " + type + "-----\n";
    }
}
