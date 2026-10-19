import type { Observador } from "./Observador.js";
import type { EventoRecomendacao } from "../../dominio/EventoRecomendacao.js";

export class AuditoriaRecomendacao implements Observador {
  private registros: EventoRecomendacao[] = [];

  atualizar(evento: EventoRecomendacao): void {
    this.registros.push(evento);
  }

  obterRegistros(): EventoRecomendacao[] {
    return [...this.registros];
  }
}
