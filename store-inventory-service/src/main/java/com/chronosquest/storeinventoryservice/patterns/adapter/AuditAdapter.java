package com.chronosquest.storeinventoryservice.patterns.adapter;

import org.springframework.stereotype.Component;

/** Padrão Adapter: adapta AuditService para o formato do SDK legado. */
@Component
public class AuditAdapter implements AuditService {

    private final LegacyAuditSdk sdk = new LegacyAuditSdk();

    @Override
    public void log(String user, String action) {
        sdk.sendTextPayload(String.format("USER:[%s] | ACTION:[%s]", user, action));
    }
}
