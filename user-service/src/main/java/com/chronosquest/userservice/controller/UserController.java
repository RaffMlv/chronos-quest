
package com.chronosquest.userservice.controller;

import com.chronosquest.userservice.dto.RegisterUserRequest;
import com.chronosquest.userservice.dto.UserResponse;
import com.chronosquest.userservice.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterUserRequest request) {

        UserResponse response = userService.register(request);

        return ResponseEntity
                .created(URI.create("/users/" + response.id()))
                .body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<String> me() {
        return ResponseEntity.ok("Acesso autorizado!");
    }
}
