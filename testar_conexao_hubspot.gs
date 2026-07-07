/**
 * Valida se a Service Key do HubSpot está configurada corretamente,
 * fazendo uma leitura simples de contatos existentes (GET).
 *
 * Deve ser o primeiro script a rodar antes de qualquer criação/atualização,
 * para confirmar que a autenticação está funcionando.
 */
function testarConexaoHubSpot() {
  const token = "nunca comite a chave real"; // Service Key gerada em Development > Keys > Service keys
  const url = "https://api.hubapi.com/crm/v3/objects/contacts?limit=5";

  const options = {
    headers: { "Authorization": "Bearer " + token },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();

  Logger.log("Status code: " + statusCode);
  Logger.log(response.getContentText());

  if (statusCode === 200) {
    Logger.log("Conexão funcionando. A chave está válida.");
  } else if (statusCode === 401) {
    Logger.log("Erro de autenticação. Verifique se a chave foi colada corretamente.");
  } else {
    Logger.log("Resposta inesperada. Veja o status code acima.");
  }
}
