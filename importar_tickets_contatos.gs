/**
 * Cria contatos fictícios e tickets no HubSpot, associando cada ticket
 * ao contato correspondente em uma única operação em lote (batch create).
 *
 * Fluxo:
 *   1. Descobre o associationTypeId correto entre tickets e contacts
 *      (esse ID varia por conta HubSpot, por isso é consultado via API
 *      em vez de fixado no código).
 *   2. Cria os contatos fictícios via batch create.
 *   3. Cria os tickets já associados aos contatos criados no passo anterior.
 */
function importarTicketsComContatosFicticios() {
  const token = "SUA_CHAVE_AQUI";
  const headers = { "Authorization": "Bearer " + token, "Content-Type": "application/json" };

  // PASSO 1: descobrir o associationTypeId correto entre tickets e contacts
  const labelsUrl = "https://api.hubapi.com/crm/v4/associations/tickets/contacts/labels";
  const labelsResponse = UrlFetchApp.fetch(labelsUrl, { headers, muteHttpExceptions: true });
  const labels = JSON.parse(labelsResponse.getContentText());
  const associationTypeId = labels.results[0].typeId;
  Logger.log("associationTypeId encontrado: " + associationTypeId);

  // PASSO 2: criar os contatos fictícios
  const contatosFicticios = [
    { firstname: "Ana", lastname: "Ferreira", email: "ana.ferreira@empresaalfa.com" },
    { firstname: "Bruno", lastname: "Souza", email: "bruno.souza@betacomercio.com" },
    { firstname: "Carla", lastname: "Lima", email: "carla.lima@gammaservicos.com" }
  ];

  const contatosPayload = { inputs: contatosFicticios.map(c => ({ properties: c })) };

  const contatosResponse = UrlFetchApp.fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts/batch/create",
    { method: "post", headers, payload: JSON.stringify(contatosPayload), muteHttpExceptions: true }
  );
  const contatosResultado = JSON.parse(contatosResponse.getContentText());

  if (contatosResponse.getResponseCode() !== 201 && contatosResponse.getResponseCode() !== 200) {
    Logger.log("Erro ao criar contatos:");
    Logger.log(contatosResponse.getContentText());
    return;
  }

  const contatosCriados = contatosResultado.results;
  Logger.log("Contatos criados: " + contatosCriados.length);

  // PASSO 3: criar os tickets, cada um já associado a um contato
  const assuntos = [
    "Cliente não consegue acessar o sistema",
    "Dúvida sobre cobrança do plano",
    "Solicitação de cancelamento"
  ];

  const ticketsPayload = {
    inputs: assuntos.map((subject, i) => ({
      properties: { subject: subject, hs_pipeline: "0", hs_pipeline_stage: "1" },
      associations: [{
        to: { id: contatosCriados[i].id },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: associationTypeId }]
      }]
    }))
  };

  const ticketsResponse = UrlFetchApp.fetch(
    "https://api.hubapi.com/crm/v3/objects/tickets/batch/create",
    { method: "post", headers, payload: JSON.stringify(ticketsPayload), muteHttpExceptions: true }
  );

  Logger.log("Status tickets: " + ticketsResponse.getResponseCode());
  Logger.log(ticketsResponse.getContentText());
}
