package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;


public class TrackerResourceFactory
    implements CharacterResourceFactory {
    @Override
    public CharacterSkillProduct createSkill() {
        return new CharacterSkillProductImpl(
                "Disparo de Precisão",
                "Disparo preciso contra um alvo distante.",
                25,
                DamageType.PHYSICAL
        );
    }

    @Override
    public CharacterEquipmentProduct createEquipment() {
        return new CharacterEquipmentProductImpl(
                "Rifle de Rastreamento",
                "Arma de precisão equipada com sistema de rastreamento.",
                "WEAPON"
        );
    }
}
