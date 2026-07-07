# Integração CS Ops: HubSpot ↔ Google Sheets

Automação que sincroniza tickets e contatos entre o HubSpot (CRM) e o Google Sheets, via API REST, sem apagar dados inseridos manualmente na planilha.

## O problema que resolve

Times de Customer Success Operations precisam manter planilhas de acompanhamento (health score, status de tickets, contatos) sempre atualizadas, sem depender de exportação manual repetida do CRM — e sem correr o risco de uma automação apagar anotações que a equipe já fez na planilha.

## Como funciona

1. **Autenticação** via Service Key do HubSpot (Bearer token), com escopos restritos apenas ao necessário (`crm.objects.contacts.read/write`, `tickets`).
2. **Criação de dados fictícios** (contatos + tickets) via API, usando batch create e associações entre objetos — usado aqui para simular um cenário real de teste.
3. **Leitura de tickets** via API e escrita automática em Google Sheets via Apps Script.
4. **Atualização sem perda de dado**: o script identifica registros já existentes na planilha (por ID/email) e atualiza só os campos vindos da API, preservando qualquer coluna extra preenchida manualmente pela equipe (ex: observações).
5. **Execução automática** via gatilho de tempo (trigger) do Apps Script, sem necessidade de rodar manualmente.

## Estrutura do repositório

```
apps-script/
├── testar_conexao_hubspot.gs         # valida a chave de API antes de qualquer operação
├── importar_tickets_contatos.gs      # cria contatos e tickets fictícios, já associados
├── puxar_tickets_hubspot.gs          # lê tickets do HubSpot e escreve na planilha
└── atualizar_sem_apagar.gs           # versão que atualiza a planilha sem sobrescrever dados manuais
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
- Automação via gatilho de tempo (scheduled trigger)

## Contexto

Venho de um background em desenvolvimento de software e estou migrando para a área de Customer Success Operations. Este projeto é um exercício prático de como aplicar lógica de programação — autenticação, automação, estruturação de dados — para resolver problemas reais de operação de CS, em vez de depender de processos manuais e planilhas desatualizadas.

## Autor

Pedro Henrique Ferreira Bastos
[LinkedIn](https://linkedin.com/in/pedrinbastos) · [GitHub](https://github.com/pedrohbastos94)
