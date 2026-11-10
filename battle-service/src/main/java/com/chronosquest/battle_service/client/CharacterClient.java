package com.chronosquest.battle_service.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

/** Lê o personagem real no character-service, repassando o JWT do jogador. */
@Component
public class CharacterClient {

    private final RestClient restClient;

    public CharacterClient(@Value("${chronos.character-service.url}") String baseUrl) {
        this.restClient = RestClient.create(baseUrl);
    }

    public CharacterData getCharacter(Long characterId, String bearerToken) {
        try {
            CharacterData data = restClient.get()
                    .uri("/characters/{id}", characterId)
                    .header("Authorization", "Bearer " + bearerToken)
                    .retrieve()
                    .body(CharacterData.class);
            if (data == null || data.sheet() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Resposta inválida do character-service");
            }
            return data;
        } catch (RestClientResponseException e) {
            int code = e.getStatusCode().value();
            if (code == 404 || code == 403) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personagem não encontrado");
            }
            if (code == 401) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token recusado pelo character-service");
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Erro no character-service");
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "character-service indisponível");
        }
    }
}
