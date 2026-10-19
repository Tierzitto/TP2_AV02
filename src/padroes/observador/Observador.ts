import type { EventoRecomendacao } from "../../dominio/EventoRecomendacao.js";

export interface Observador {
  atualizar(evento: EventoRecomendacao): void;
}
