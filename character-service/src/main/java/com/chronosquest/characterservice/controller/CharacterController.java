package com.chronosquest.characterservice.controller;

import com.chronosquest.characterservice.dto.AddExperienceRequest;
import com.chronosquest.characterservice.dto.CharacterResponse;
import com.chronosquest.characterservice.dto.CreateCharacterRequest;
import com.chronosquest.characterservice.service.CharacterService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/characters")
public class CharacterController {

    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    // Criar personagem
    @PostMapping
    public ResponseEntity<CharacterResponse> createCharacter(
            @Valid @RequestBody CreateCharacterRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {

        Long userId = Long.parseLong(jwt.getSubject());

        CharacterResponse response =
                characterService.createCharacter(request, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Listar personagens do usuário autenticado
    @GetMapping
    public ResponseEntity<List<CharacterResponse>> getCharacters(
            @AuthenticationPrincipal Jwt jwt
    ) {

        Long userId = Long.parseLong(jwt.getSubject());

        List<CharacterResponse> characters =
                characterService.getCharactersByUser(userId);

        return ResponseEntity.ok(characters);
    }

    // Buscar um personagem específico
    @GetMapping("/{id}")
    public ResponseEntity<CharacterResponse> getCharacterById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {

        Long userId = Long.parseLong(jwt.getSubject());

        CharacterResponse response =
                characterService.getCharacterById(id, userId);

        return ResponseEntity.ok(response);
    }


    @PatchMapping("/{id}/experience")
    public ResponseEntity<CharacterResponse> addExperience(
            @PathVariable Long id,
            @Valid @RequestBody AddExperienceRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        CharacterResponse response = characterService.addExperience(
                id,
                userId,
                request.amount()
        );

        return ResponseEntity.ok(response);
    }

}