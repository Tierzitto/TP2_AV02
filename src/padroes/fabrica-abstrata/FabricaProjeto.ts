import type { DadosProjeto, Projeto } from "../../dominio/Projeto.js";
import type { RecomendacaoStrategy } from "../estrategia/RecomendacaoStrategy.js";
import type { Observador } from "../observador/Observador.js";
import type { VisitanteProjeto } from "../visitante/VisitanteProjeto.js";

export interface FabricaProjeto {
  criarProjeto(dados: DadosProjeto): Projeto;
  criarValidador(): VisitanteProjeto<boolean>;
  criarRecomendador(): RecomendacaoStrategy;
  criarNotificador(): Observador;
}

