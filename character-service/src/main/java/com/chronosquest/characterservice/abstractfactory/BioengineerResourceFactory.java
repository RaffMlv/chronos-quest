package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;

public class BioengineerResourceFactory
        implements CharacterResourceFactory {

    @Override
    public CharacterSkillProduct createSkill() {
        return new CharacterSkillProductImpl(
                "Sobrecarga Biônica",
                "Utiliza implantes tecnológicos para liberar energia.",
                25,
                DamageType.ENERGY
        );
    }

    @Override
    public CharacterEquipmentProduct createEquipment() {
        return new CharacterEquipmentProductImpl(
                "Exoesqueleto Adaptativo",
                "Estrutura biomecânica que amplia a resistência física.",
                "ARMOR"
        );
    }
}