import type { Observador } from "./Observador.js";
import type { EventoRecomendacao } from "../../dominio/EventoRecomendacao.js";

export class NotificadorEmail implements Observador {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[email] evento ${evento.tipo} originado em ${evento.origem}`);
  }
}
