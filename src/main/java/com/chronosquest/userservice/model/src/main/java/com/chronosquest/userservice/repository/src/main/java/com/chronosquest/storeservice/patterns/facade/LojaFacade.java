package com.chronosquest.storeservice.patterns.facade;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LojaFacade {

    public boolean processarCompraItem(Long usuarioId, Long itemId, Double valorItem) {
        System.out.println("[Facade] Iniciando fluxo simplificado de compra...");
        System.out.println("[Facade] Saldo verificado para o usuário: " + usuarioId);
        System.out.println("[Facade] Debitado o valor de R$ " + valorItem);
        System.out.println("[Facade] Item " + itemId + " adicionado ao inventário.");
        System.out.println("[Facade] Notificação enviada ao jogador.");
        return true;
    }
}
