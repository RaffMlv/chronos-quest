package com.chronosquest.characterservice.abstractfactory;

public class CharacterEquipmentProductImpl implements CharacterEquipmentProduct {
    private final String name;
    private final String description;
    private final String equipmentType;

    public CharacterEquipmentProductImpl(String name, String description, String equipmentType) {
        this.name = name;
        this.description = description;
        this.equipmentType = equipmentType;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public String getEquipmentType() {
        return equipmentType;
    }
}
