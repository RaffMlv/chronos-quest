package com.chronosquest.characterservice.model;

import jakarta.persistence.*;

@Entity
@Table(name="character_skills")
public class CharacterSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterEntity character;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer power;

    @Enumerated(EnumType.STRING)
    @Column(name = "damage_type", nullable = false, length = 20)
    private DamageType damageType;

    public CharacterSkill(){
    }

    public Long getId() {
        return id;
    }

    public CharacterEntity getCharacter() {
        return character;
    }

    public void setCharacter(CharacterEntity character) {
        this.character = character;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPower() {
        return power;
    }

    public void setPower(Integer power) {
        this.power = power;
    }

    public DamageType getDamageType() {
        return damageType;
    }

    public void setDamageType(DamageType damageType) {
        this.damageType = damageType;
    }
}
