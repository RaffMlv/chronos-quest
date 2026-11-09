package com.chronosquest.characterservice.abstractfactory;

public interface CharacterResourceFactory {
    CharacterSkillProduct createSkill();
    CharacterEquipmentProduct createEquipment();
}
