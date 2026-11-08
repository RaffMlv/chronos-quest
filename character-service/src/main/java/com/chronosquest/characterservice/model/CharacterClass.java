package com.chronosquest.characterservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "character_classes")
public class CharacterClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "primary_attribute", nullable = false, length = 30)
    private String primaryAttribute;

    @Column(name = "secondary_attribute", nullable = false, length = 30)
    private String secondaryAttribute;

    public CharacterClass() {
    }

    public Long getId() {
        return id;
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

    public String getPrimaryAttribute() {
        return primaryAttribute;
    }

    public void setPrimaryAttribute(String primaryAttribute) {
        this.primaryAttribute = primaryAttribute;
    }

    public String getSecondaryAttribute() {
        return secondaryAttribute;
    }

    public void setSecondaryAttribute(String secondaryAttribute) {
        this.secondaryAttribute = secondaryAttribute;
    }
}
