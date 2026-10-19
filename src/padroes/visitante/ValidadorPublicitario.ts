import type { VisitanteProjeto } from "./VisitanteProjeto.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

const TETO_ORCAMENTO_PUBLICITARIO = 500_000;

export class ValidadorPublicitario implements VisitanteProjeto<boolean> {
  visitarProjeto(projeto: Projeto): boolean {
    const orcamentoValido = projeto.orcamento > 0 && projeto.orcamento <= TETO_ORCAMENTO_PUBLICITARIO;
    const prazoValido = projeto.prazo.getTime() > Date.now();
    const papeisPreenchidos = projeto
      .papeisObrigatorios()
      .every((papel) => projeto.equipe?.obterMembroPorPapel(papel) !== undefined);
    return orcamentoValido && prazoValido && papeisPreenchidos;
  }

  visitarProfissional(profissional: Profissional): boolean {
    return profissional.competencias.length > 0 && profissional.disponivel;
  }
}

