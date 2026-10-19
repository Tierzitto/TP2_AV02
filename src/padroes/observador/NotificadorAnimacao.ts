import type { Observador } from "./Observador.js";
import type { EventoRecomendacao } from "../../dominio/EventoRecomendacao.js";

export class NotificadorAnimacao implements Observador {
  atualizar(evento: EventoRecomendacao): void {
    console.log(
      `[animacao] evento ${evento.tipo} em ${evento.origem} — verificar pipeline de render e composicao`,
    );
  }
}

