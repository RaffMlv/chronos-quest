package com.chronosquest.userservice.builder;

import com.chronosquest.userservice.model.User;

public class UserBuilder {
    private String username;
    private String email;
    private String passwordHash;
    private String displayName;

    public UserBuilder username(String username){
        this.username = username;
        return this;
    }

    public UserBuilder email(String email) {
        this.email = email;
        return this;
    }

    public UserBuilder passwordHash(String passwordHash) {
        this.passwordHash = passwordHash;
        return this;
    }

    public UserBuilder displayName(String displayName) {
        this.displayName = displayName;
        return this;
    }

    public User build() {

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException(
                    "Username é obrigatório."
            );
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Email é obrigatório."
            );
        }

        if (passwordHash == null || passwordHash.isBlank()) {
            throw new IllegalArgumentException(
                    "Password hash é obrigatório."
            );
        }

        if (displayName == null || displayName.isBlank()) {
            throw new IllegalArgumentException(
                    "Display name é obrigatório."
            );
        }

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setDisplayName(displayName);

        return user;
    }
}
