package com.chronosquest.characterservice.abstractfactory;

import com.chronosquest.characterservice.model.DamageType;

public class TemporalGuardianResourceFactory
    implements CharacterResourceFactory {
    @Override
    public CharacterSkillProduct createSkill(){
        return new CharacterSkillProductImpl(
                "Escudo Cronal",
                "Cria uma barreira temporal que protege contra ataques.",
                20,
                DamageType.ENERGY
        );
    }

    @Override
    public CharacterEquipmentProduct createEquipment() {
        return new CharacterEquipmentProductImpl(
                "Armadura de Contenção",
                "Armadura reforçada para suportar distorções temporais.",
                "ARMOR"
        );
    }
}
