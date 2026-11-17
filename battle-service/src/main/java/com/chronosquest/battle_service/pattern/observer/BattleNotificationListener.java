package com.chronosquest.battle_service.pattern.observer;

import com.chronosquest.battle_service.client.CharacterClient;
import com.chronosquest.battle_service.client.CharacterData;
import com.chronosquest.battle_service.client.CreateNotificationRequest;
import com.chronosquest.battle_service.client.NotificationClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class BattleNotificationListener implements BattleEventListener {

    private static final Logger log =
            LoggerFactory.getLogger(BattleNotificationListener.class);

    private final CharacterClient characterClient;
    private final NotificationClient notificationClient;

    public BattleNotificationListener(
            CharacterClient characterClient,
            NotificationClient notificationClient
    ) {
        this.characterClient = characterClient;
        this.notificationClient = notificationClient;
    }

    @Override
    public void onBattleCompleted(
            Long battleId,
            Long userId,
            Long characterId,
            String era,
            String bearerToken,
            boolean victory
    ) {
        try {
            CharacterData character =
                    characterClient.getCharacter(characterId, bearerToken);

            String message = victory
                    ? "Você venceu uma batalha na era " + era + "!"
                    : "Você foi derrotado em uma batalha na era " + era + ".";

            CreateNotificationRequest request =
                    new CreateNotificationRequest(
                            userId,
                            character.name(),
                            "BATTLE",
                            message
                    );

            notificationClient.createNotification(request, bearerToken);

        } catch (Exception exception) {
            log.warn(
                    "Não foi possível enviar a notificação da batalha {}: {}",
                    battleId,
                    exception.getMessage()
            );
        }
    }
}