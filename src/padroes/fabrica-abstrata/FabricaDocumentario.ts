import type { DadosProjeto } from "../../dominio/Projeto.js";
import { ProjetoDocumentario } from "../../dominio/ProjetoDocumentario.js";
import { ValidadorDocumentario } from "../visitante/ValidadorDocumentario.js";
import { RecomendacaoDocumentario } from "../estrategia/RecomendacaoDocumentario.js";
import { NotificadorDocumentario } from "../observador/NotificadorDocumentario.js";
import type { FabricaProjeto } from "./FabricaProjeto.js";

export class FabricaDocumentario implements FabricaProjeto {
  criarProjeto(dados: DadosProjeto & { tema?: string; entrevistados?: string[] }): ProjetoDocumentario {
    return new ProjetoDocumentario(dados);
  }

  criarValidador(): ValidadorDocumentario {
    return new ValidadorDocumentario();
  }

  criarRecomendador(): RecomendacaoDocumentario {
    return new RecomendacaoDocumentario();
  }

  criarNotificador(): NotificadorDocumentario {
    return new NotificadorDocumentario();
  }
}

