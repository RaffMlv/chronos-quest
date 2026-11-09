package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;

public class ArtificerResourceFactory
        implements CharacterResourceFactory {

    @Override
    public CharacterSkillProduct createSkill() {
        return new CharacterSkillProductImpl(
                "Pulso de Engenharia",
                "Dispara uma descarga energética de um dispositivo experimental.",
                25,
                DamageType.ENERGY
        );
    }

    @Override
    public CharacterEquipmentProduct createEquipment() {
        return new CharacterEquipmentProductImpl(
                "Ferramenta Multifuncional",
                "Dispositivo tecnológico para manipulação e reparo de equipamentos.",
                "ACCESSORY"
        );
    }
}