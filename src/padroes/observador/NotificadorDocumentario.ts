import type { Observador } from "./Observador.js";
import type { EventoRecomendacao } from "../../dominio/EventoRecomendacao.js";

export class NotificadorDocumentario implements Observador {
  atualizar(evento: EventoRecomendacao): void {
    console.log(
      `[documentario] evento ${evento.tipo} em ${evento.origem} — verificar equipe de captacao e direcao`,
    );
  }
}

