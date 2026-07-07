# Integração CS Ops: HubSpot ↔ Google Sheets

Automação que sincroniza tickets e contatos entre o HubSpot (CRM) e o Google Sheets, via API REST.

## O problema que resolve

Times de Customer Success Operations precisam manter planilhas de acompanhamento (health score, status de tickets, contatos) sempre atualizadas, sem depender de exportação manual repetida do CRM — e sem correr o risco de uma automação apagar anotações que a equipe já fez na planilha.

## Como funciona

1. **Autenticação** via Service Key do HubSpot (Bearer token), com escopos restritos apenas ao necessário (`crm.objects.contacts.read/write`, `tickets`).
2. **Leitura de tickets** via API e escrita automática em Google Sheets via Apps Script.

## Estrutura do repositório

```
apps-script/
├── testar_conexao_hubspot.gs         # valida a chave de API antes de qualquer operação
└── puxar_tickets_hubspot.gs          # lê tickets do HubSpot e escreve na planilha
```

## Tecnologias

- Google Apps Script (JavaScript)
- HubSpot API v3 (CRM Objects) e v4 (Associations)
- REST / JSON / autenticação Bearer token

## Conceitos técnicos aplicados

- Requisições HTTP (GET / POST) e tratamento de status code (200, 201, 401)
- Autenticação via token com escopo restrito (least privilege)
- Operações em lote (batch create) para reduzir número de chamadas
- Associação entre objetos via API (ticket ↔ contato)
- Idempotência: identificar registros existentes antes de escrever, evitando duplicação ou perda de dado

## Contexto

Venho de um background em desenvolvimento de software e estou migrando para a área de Customer Success Operations. Este projeto é um exercício prático de como aplicar lógica de programação — autenticação, automação, estruturação de dados — para resolver problemas reais de operação de CS, em vez de depender de processos manuais e planilhas desatualizadas.

## Autor

Pedro Henrique Ferreira Bastos
[LinkedIn](https://linkedin.com/in/pedrinbastos) · [GitHub](https://github.com/pedrohbastos94)
