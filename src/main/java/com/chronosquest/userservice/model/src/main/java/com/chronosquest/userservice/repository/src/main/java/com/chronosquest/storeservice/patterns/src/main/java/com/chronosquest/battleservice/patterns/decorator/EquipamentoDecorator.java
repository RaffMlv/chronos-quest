package com.chronosquest.battleservice.patterns.decorator;

public interface Personagem {
    int getPoderAtaque();
}

class PersonagemBase implements Personagem {
    @Override
    public int getPoderAtaque() {
        return 10;
    }
}

abstract class PersonagemDecorator implements Personagem {
    protected final Personagem personagemDecorado;

    protected PersonagemDecorator(Personagem personagem) {
        this.personagemDecorado = personagem;
    }

    @Override
    public int getPoderAtaque() {
        return personagemDecorado.getPoderAtaque();
    }
}

public class EspadaMagicaDecorator extends PersonagemDecorator {
    public EspadaMagicaDecorator(Personagem personagem) {
        super(personagem);
    }

    @Override
    public int getPoderAtaque() {
        return super.getPoderAtaque() + 15;
    }
}

public class EncantamentoFogoDecorator extends PersonagemDecorator {
    public EncantamentoFogoDecorator(Personagem personagem) {
        super(personagem);
    }

    @Override
    public int getPoderAtaque() {
        return super.getPoderAtaque() + 5;
    }
}
