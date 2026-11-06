package com.chronosquest.characterservice.factory;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CharacterFactoryProvider {

    private final Map<String, CharacterFactory> factories =
            new HashMap<>();

    public CharacterFactoryProvider() {

        factories.put("Guardião Temporal",
                new TemporalGuardianFactory());

        factories.put("Rastreador",
                new TrackerFactory());

        factories.put("Cronomante",
                new ChronomancerFactory());

        factories.put("Bioengenheiro",
                new BioengineerFactory());

        factories.put("Paradoxista",
                new ParadoxistFactory());

        factories.put("Artífice",
                new ArtificerFactory());
    }

    public CharacterFactory getFactory(String className) {

        CharacterFactory factory = factories.get(className);

        if (factory == null) {
            throw new IllegalArgumentException(
                    "Não existe uma fábrica para a classe: " + className
            );
        }

        return factory;
    }
}