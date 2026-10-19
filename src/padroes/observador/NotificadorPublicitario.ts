import type { Observador } from "./Observador.js";
import type { EventoRecomendacao } from "../../dominio/EventoRecomendacao.js";

export class NotificadorPublicitario implements Observador {
  atualizar(evento: EventoRecomendacao): void {
    console.log(
      `[publicitario] evento ${evento.tipo} em ${evento.origem} — verificar prazos e campanhas`,
    );
  }
}

