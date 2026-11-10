package com.chronosquest.storeinventoryservice.patterns.adapter;

/** Interface que a loja usa para auditoria. */
public interface AuditService {
    void log(String user, String action);
}
