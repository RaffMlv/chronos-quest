package com.chronosquest.storeinventoryservice.patterns.decorator;

import java.util.List;

public abstract class EquipmentDecorator implements Combatant {

    protected final Combatant wrapped;

    protected EquipmentDecorator(Combatant wrapped) {
        this.wrapped = wrapped;
    }

    @Override
    public int getAttackPower() {
        return wrapped.getAttackPower();
    }

    @Override
    public List<String> getEquipment() {
        return wrapped.getEquipment();
    }
}
