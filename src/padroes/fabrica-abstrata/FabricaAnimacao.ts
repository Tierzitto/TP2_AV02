import type { DadosProjeto } from "../../dominio/Projeto.js";
import { ProjetoAnimacao } from "../../dominio/ProjetoAnimacao.js";
import { ValidadorAnimacao } from "../visitante/ValidadorAnimacao.js";
import { RecomendacaoAnimacao } from "../estrategia/RecomendacaoAnimacao.js";
import { NotificadorAnimacao } from "../observador/NotificadorAnimacao.js";
import type { FabricaProjeto } from "./FabricaProjeto.js";

export class FabricaAnimacao implements FabricaProjeto {
  criarProjeto(dados: DadosProjeto & { taxaRenderizacao?: number; estilo3D?: boolean }): ProjetoAnimacao {
    return new ProjetoAnimacao(dados);
  }

  criarValidador(): ValidadorAnimacao {
    return new ValidadorAnimacao();
  }

  criarRecomendador(): RecomendacaoAnimacao {
    return new RecomendacaoAnimacao();
  }

  criarNotificador(): NotificadorAnimacao {
    return new NotificadorAnimacao();
  }
}

