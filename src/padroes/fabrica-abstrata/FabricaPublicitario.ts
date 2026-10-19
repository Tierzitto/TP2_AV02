import type { DadosProjeto } from "../../dominio/Projeto.js";
import { ProjetoPublicitario } from "../../dominio/ProjetoPublicitario.js";
import { ValidadorPublicitario } from "../visitante/ValidadorPublicitario.js";
import { RecomendacaoPublicitario } from "../estrategia/RecomendacaoPublicitario.js";
import { NotificadorPublicitario } from "../observador/NotificadorPublicitario.js";
import type { FabricaProjeto } from "./FabricaProjeto.js";

export class FabricaPublicitario implements FabricaProjeto {
  criarProjeto(dados: DadosProjeto & { prazoRigido?: boolean; numeroCampanhas?: number }): ProjetoPublicitario {
    return new ProjetoPublicitario(dados);
  }

  criarValidador(): ValidadorPublicitario {
    return new ValidadorPublicitario();
  }

  criarRecomendador(): RecomendacaoPublicitario {
    return new RecomendacaoPublicitario();
  }

  criarNotificador(): NotificadorPublicitario {
    return new NotificadorPublicitario();
  }
}

