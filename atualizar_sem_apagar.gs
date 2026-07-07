/**
 * Atualiza a planilha com os tickets do HubSpot sem apagar dados
 * inseridos manualmente pela equipe (ex: coluna de observações).
 *
 * Lógica:
 *   - Tickets já existentes na planilha (identificados pelo ID) têm
 *     apenas as colunas de dado da API atualizadas.
 *   - Tickets novos são adicionados ao final, sem afetar as linhas existentes.
 *   - Nenhuma linha é apagada ou reordenada.
 *
 * Este script foi feito para rodar sozinho via gatilho de tempo —
 * ver a função criarAtualizacaoAutomatica() no final do arquivo.
 */
function atualizarTicketsSemApagar() {
  const token = "nunca comite a chave real";
  const url = "https://api.hubapi.com/crm/v3/objects/tickets?limit=100&properties=subject,hs_pipeline_stage";

  const response = UrlFetchApp.fetch(url, {
    headers: { "Authorization": "Bearer " + token },
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    Logger.log("Erro ao buscar dados. Status code: " + response.getResponseCode());
    return;
  }

  const dados = JSON.parse(response.getContentText()).results;
  const sheet = SpreadsheetApp.getActiveSheet();

  // Garante o cabeçalho sem apagar o resto da planilha
  const cabecalho = sheet.getRange(1, 1, 1, 3).getValues()[0];
  if (cabecalho[0] !== "ID do Ticket") {
    sheet.getRange(1, 1, 1, 3).setValues([["ID do Ticket", "Assunto", "Etapa"]]);
  }

  // Mapeia as linhas existentes pelo ID do ticket (coluna 1)
  const ultimaLinha = sheet.getLastRow();
  const idParaLinha = {};
  if (ultimaLinha > 1) {
    const idsExistentes = sheet.getRange(2, 1, ultimaLinha - 1, 1).getValues();
    idsExistentes.forEach((linha, i) => {
      idParaLinha[linha[0]] = i + 2;
    });
  }

  let atualizados = 0;
  let novos = 0;

  dados.forEach(ticket => {
    const linhaExistente = idParaLinha[ticket.id];

    if (linhaExistente) {
      // Já existe: atualiza só assunto e etapa, sem tocar em outras colunas
      sheet.getRange(linhaExistente, 2).setValue(ticket.properties.subject);
      sheet.getRange(linhaExistente, 3).setValue(ticket.properties.hs_pipeline_stage);
      atualizados++;
    } else {
      // Novo ticket: adiciona no final, sem sobrescrever nada
      const novaLinha = sheet.getLastRow() + 1;
      sheet.getRange(novaLinha, 1, 1, 3).setValues([[ticket.id, ticket.properties.subject, ticket.properties.hs_pipeline_stage]]);
      novos++;
    }
  });

  // Registra o horário da última atualização, pra saber se o gatilho está rodando
  sheet.getRange("E1").setValue("Última atualização: " + new Date().toLocaleString("pt-BR"));

  Logger.log("Atualizados: " + atualizados + " | Novos: " + novos);
}

/**
 * Cria o gatilho de tempo para que atualizarTicketsSemApagar()
 * rode sozinha, sem precisar clicar em Executar toda vez.
 * Rodar esta função apenas uma vez.
 */
function criarAtualizacaoAutomatica() {
  // Remove gatilhos antigos da mesma função, para não duplicar
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === "atualizarTicketsSemApagar") {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger("atualizarTicketsSemApagar")
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log("Atualização automática configurada: a cada 1 hora.");
}

/**
 * Protege o intervalo de dados da planilha contra edição manual
 * por outras pessoas, sem impedir que o script continue escrevendo
 * (o script roda com a permissão de quem o autorizou).
 * Rodar esta função apenas uma vez, se necessário.
 */
function protegerPlanilha() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange("A1:C1000"); // ajuste o intervalo conforme necessário

  const protection = range.protect().setDescription("Dados de tickets - somente leitura");
  protection.removeEditors(protection.getEditors());

  Logger.log("Planilha protegida. Apenas o script/dono pode editar A1:C1000.");
}
