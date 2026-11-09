package com.chronosquest.characterservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "characters",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_character_name",
                        columnNames = {"user_id", "name"}
                )
        },
        indexes = {
                @Index(name = "idx_characters_user_id", columnList = "user_id")
        }
)
public class CharacterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private CharacterClass characterClass;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @OneToOne(
            mappedBy = "character",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private CharacterSheet sheet;

    @OneToMany(
            mappedBy = "character",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CharacterSkill> skills = new ArrayList<>();

    public CharacterEntity() {
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public CharacterClass getCharacterClass() {
        return characterClass;
    }

    public void setCharacterClass(CharacterClass characterClass) {
        this.characterClass = characterClass;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public CharacterSheet getSheet() {
        return sheet;
    }

    public void setSheet(CharacterSheet sheet) {
        this.sheet = sheet;
    }

    public List<CharacterSkill> getSkills() {
        return skills;
    }

    public void setSkills(List<CharacterSkill> skills) {
        this.skills = skills;
    }

    public void addSkill(CharacterSkill skill) {
        skills.add(skill);
        skill.setCharacter(this);
    }
}
