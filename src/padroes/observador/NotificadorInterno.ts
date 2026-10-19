import type { Observador } from "./Observador.js";
import type { EventoRecomendacao } from "../../dominio/EventoRecomendacao.js";

export class NotificadorInterno implements Observador {
  atualizar(evento: EventoRecomendacao): void {
    console.log(`[mensageria-interna] evento ${evento.tipo} originado em ${evento.origem}`);
  }
}
