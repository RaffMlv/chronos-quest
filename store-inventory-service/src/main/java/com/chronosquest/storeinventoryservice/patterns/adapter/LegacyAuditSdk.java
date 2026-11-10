package com.chronosquest.storeinventoryservice.patterns.adapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Simula um SDK legado de auditoria, que só aceita uma string pronta. */
public class LegacyAuditSdk {

    private static final Logger logger = LoggerFactory.getLogger(LegacyAuditSdk.class);

    public void sendTextPayload(String formattedMessage) {
        logger.info("[SDK Legado] Payload de auditoria: {}", formattedMessage);
    }
}
