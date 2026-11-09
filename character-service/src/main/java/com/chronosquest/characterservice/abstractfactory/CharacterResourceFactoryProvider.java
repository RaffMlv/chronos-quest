package com.chronosquest.characterservice.abstractfactory;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CharacterResourceFactoryProvider {

    private final Map<String, CharacterResourceFactory> factories =
            new HashMap<>();

    public CharacterResourceFactoryProvider() {

        factories.put("Guardião Temporal",
                new TemporalGuardianResourceFactory());

        factories.put("Rastreador",
                new TrackerResourceFactory());

        factories.put("Cronomante",
                new ChronomancerResourceFactory());

        factories.put("Bioengenheiro",
                new BioengineerResourceFactory());

        factories.put("Paradoxista",
                new ParadoxistResourceFactory());

        factories.put("Artífice",
                new ArtificerResourceFactory());
    }

    public CharacterResourceFactory getFactory(String className) {

        CharacterResourceFactory factory = factories.get(className);

        if (factory == null) {
            throw new IllegalArgumentException(
                    "Não existe uma fábrica de recursos para a classe: "
                            + className
            );
        }

        return factory;
    }
}