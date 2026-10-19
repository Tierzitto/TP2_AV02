import type { VisitanteProjeto } from "./VisitanteProjeto.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

export class ValidadorDocumentario implements VisitanteProjeto<boolean> {
  visitarProjeto(projeto: Projeto): boolean {
    const temDiretor = projeto.papeisObrigatorios().some((p) => p === "DIRETOR");
    const temCaptacao = projeto.papeisObrigatorios().some(
      (p) => p === "DIRETOR_FOTOGRAFIA" || p === "SONOPLASTA",
    );
    const orcamentoValido = projeto.orcamento > 0;
    const papeisPreenchidos = projeto
      .papeisObrigatorios()
      .every((papel) => projeto.equipe?.obterMembroPorPapel(papel) !== undefined);
    return orcamentoValido && (temDiretor || temCaptacao) && papeisPreenchidos;
  }

  visitarProfissional(profissional: Profissional): boolean {
    return profissional.competencias.length > 0 && profissional.disponivel;
  }
}

