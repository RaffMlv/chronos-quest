package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;

public class ParadoxistResourceFactory
        implements CharacterResourceFactory {

    @Override
    public CharacterSkillProduct createSkill() {
        return new CharacterSkillProductImpl(
                "Colapso de Existência",
                "Explora uma contradição temporal para atingir o inimigo.",
                35,
                DamageType.PARADOX
        );
    }

    @Override
    public CharacterEquipmentProduct createEquipment() {
        return new CharacterEquipmentProductImpl(
                "Núcleo de Paradoxo",
                "Artefato instável originado de uma ruptura temporal.",
                "ACCESSORY"
        );
    }
}