package com.chronosquest.characterservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "character_sheets")
public class CharacterSheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false, unique = true)
    private CharacterEntity character;

    private Integer level = 1;

    private Long experience = 0L;

    private Integer strength = 10;
    private Integer dexterity = 10;
    private Integer constitution = 10;
    private Integer intelligence = 10;
    private Integer wisdom = 10;
    private Integer charisma = 10;

    @Column(name = "health_points")
    private Integer healthPoints = 100;

    @Column(name = "max_health_points")
    private Integer maxHealthPoints = 100;

    @Column(name = "mana_points")
    private Integer manaPoints = 50;

    @Column(name = "max_mana_points")
    private Integer maxManaPoints = 50;

    public CharacterSheet() {
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

    public Integer getLevel() {
        return level;
    }

    public Long getExperience() {
        return experience;
    }

    public Integer getStrength() {
        return strength;
    }

    public Integer getDexterity() {
        return dexterity;
    }

    public Integer getConstitution() {
        return constitution;
    }

    public Integer getIntelligence() {
        return intelligence;
    }

    public Integer getWisdom() {
        return wisdom;
    }

    public Integer getCharisma() {
        return charisma;
    }

    public Integer getHealthPoints() {
        return healthPoints;
    }

    public Integer getMaxHealthPoints() {
        return maxHealthPoints;
    }

    public Integer getManaPoints() {
        return manaPoints;
    }

    public Integer getMaxManaPoints() {
        return maxManaPoints;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public void setExperience(Long experience) {
        this.experience = experience;
    }

    public void setStrength(Integer strength) {
        this.strength = strength;
    }

    public void setDexterity(Integer dexterity) {
        this.dexterity = dexterity;
    }

    public void setConstitution(Integer constitution) {
        this.constitution = constitution;
    }

    public void setIntelligence(Integer intelligence) {
        this.intelligence = intelligence;
    }

    public void setWisdom(Integer wisdom) {
        this.wisdom = wisdom;
    }

    public void setCharisma(Integer charisma) {
        this.charisma = charisma;
    }

    public void setHealthPoints(Integer healthPoints) {
        this.healthPoints = healthPoints;
    }

    public void setMaxHealthPoints(Integer maxHealthPoints) {
        this.maxHealthPoints = maxHealthPoints;
    }

    public void setManaPoints(Integer manaPoints) {
        this.manaPoints = manaPoints;
    }

    public void setMaxManaPoints(Integer maxManaPoints) {
        this.maxManaPoints = maxManaPoints;
    }
}
