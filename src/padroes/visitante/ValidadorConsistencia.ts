import type { VisitanteProjeto } from "./VisitanteProjeto.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

export class ValidadorConsistencia implements VisitanteProjeto<boolean> {
  visitarProjeto(projeto: Projeto): boolean {
    const papeisPreenchidos = projeto
      .papeisObrigatorios()
      .every((papel) => projeto.equipe?.obterMembroPorPapel(papel) !== undefined);
    const orcamentoSuficiente = projeto.orcamento > 0;
    return papeisPreenchidos && orcamentoSuficiente;
  }

  visitarProfissional(profissional: Profissional): boolean {
    return profissional.competencias.length > 0 && profissional.disponivel;
  }
}
