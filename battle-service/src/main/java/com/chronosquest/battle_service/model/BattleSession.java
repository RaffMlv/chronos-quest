package com.chronosquest.battle_service.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "battle_sessions")
public class BattleSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "enemy_name", nullable = false)
    private String enemyName;

    @Column(name = "current_actor", nullable = false)
    private String currentActor;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        currentActor = "PLAYER";
    }

    public void setState(Object state) {
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getEnemyName() { return enemyName; }
    public void setEnemyName(String enemyName) { this.enemyName = enemyName; }
    public String getCurrentActor() { return currentActor; }
    public void setCurrentActor(String currentActor) { this.currentActor = currentActor; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}