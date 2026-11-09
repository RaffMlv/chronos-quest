package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;

public class ChronomancerResourceFactory
        implements CharacterResourceFactory {

    @Override
    public CharacterSkillProduct createSkill() {
        return new CharacterSkillProductImpl(
                "Pulso Temporal",
                "Libera uma onda de energia que distorce o fluxo do tempo.",
                30,
                DamageType.TEMPORAL
        );
    }

    @Override
    public CharacterEquipmentProduct createEquipment() {
        return new CharacterEquipmentProductImpl(
                "Catalisador Cronal",
                "Dispositivo que concentra energia temporal.",
                "WEAPON"
        );
    }
}