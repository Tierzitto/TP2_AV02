import type { Papel } from "../dominio/Papel.js";
import type { Projeto } from "../dominio/Projeto.js";
import type { Profissional } from "../dominio/Profissional.js";
import type { Equipe } from "../dominio/Equipe.js";
import type { Observador } from "../padroes/observador/Observador.js";
import type { EventoRecomendacao } from "../dominio/EventoRecomendacao.js";
import { OrquestradorPadrao } from "../padroes/template-method/OrquestradorPadrao.js";

export class SistemaRecomendacao {
  private observadores: Observador[] = [];

  adicionarObservador(observador: Observador): void {
    this.observadores.push(observador);
  }

  removerObservador(observador: Observador): void {
    this.observadores = this.observadores.filter((atual) => atual !== observador);
  }

  executarRecomendacao(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const fabrica = projeto.criarFabrica();
    const recomendador = fabrica.criarRecomendador();
    const recomendacoes = recomendador.recomendar(projeto, profissionais);
    const evento: EventoRecomendacao = {
      tipo: "RECOMENDACAO_GERADA",
      dados: { projetoId: projeto.id, estrategia: recomendador.nome },
      origem: "SistemaRecomendacao",
      timestamp: new Date(),
    };
    fabrica.criarNotificador().atualizar(evento);
    this.notificarObservadores(evento);
    return recomendacoes;
  }

  formarEquipe(projeto: Projeto, profissionais: Profissional[]): Equipe {
    const orquestrador = new OrquestradorPadrao(projeto.criarFabrica());
    return orquestrador.orquestrar(projeto, profissionais);
  }

  notificarObservadores(evento: EventoRecomendacao): void {
    for (const observador of this.observadores) {
      observador.atualizar(evento);
    }
  }
}
