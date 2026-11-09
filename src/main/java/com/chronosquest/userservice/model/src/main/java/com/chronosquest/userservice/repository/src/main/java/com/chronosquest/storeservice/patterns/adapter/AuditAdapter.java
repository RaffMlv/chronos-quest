package com.chronosquest.storeservice.patterns.adapter;

interface ServicoAuditoria {
    void registrarLog(String usuario, String acao);
}

class SDKLegadoAuditoria {
    public void enviarPayloadTexto(String mensagemFormatada) {
        System.out.println("[SDK Legado] Payload de auditoria processado: " + mensagemFormatada);
    }
}

public class AuditAdapter implements ServicoAuditoria {

    private final SDKLegadoAuditoria sdkLegado;

    public AuditAdapter(SDKLegadoAuditoria sdkLegado) {
        this.sdkLegado = sdkLegado;
    }

    @Override
    public void registrarLog(String usuario, String acao) {
        String mensagemFormatada = String.format("USER:[%s] | ACTION:[%s]", usuario, acao);
        sdkLegado.enviarPayloadTexto(mensagemFormatada);
    }
}
