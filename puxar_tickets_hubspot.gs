/**
 * Lê os tickets existentes no HubSpot via API (GET) e escreve
 * as informações na planilha ativa do Google Sheets.
 *
 * Versão simples: reescreve a planilha inteira a cada execução.
 * Para atualização incremental sem apagar dados manuais, ver
 * atualizar_sem_apagar.gs.
 */
function puxarTicketsHubSpotParaPlanilha() {
  const token = "nunca comite a chave real";
  const url = "https://api.hubapi.com/crm/v3/objects/tickets?limit=100&properties=subject,hs_pipeline_stage";

  const options = {
    headers: { "Authorization": "Bearer " + token },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    Logger.log("Erro: " + response.getContentText());
    return;
  }

  const dados = JSON.parse(response.getContentText()).results;
  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange(1, 1, 1, 3).setValues([["ID do Ticket", "Assunto", "Etapa"]]);

  dados.forEach((ticket, i) => {
    sheet.getRange(i + 2, 1).setValue(ticket.id);
    sheet.getRange(i + 2, 2).setValue(ticket.properties.subject);
    sheet.getRange(i + 2, 3).setValue(ticket.properties.hs_pipeline_stage);
  });

  Logger.log("Planilha atualizada com " + dados.length + " tickets do HubSpot.");
}
