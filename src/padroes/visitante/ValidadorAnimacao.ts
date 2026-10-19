import type { VisitanteProjeto } from "./VisitanteProjeto.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

export class ValidadorAnimacao implements VisitanteProjeto<boolean> {
  visitarProjeto(projeto: Projeto): boolean {
    const temVFX = projeto.papeisObrigatorios().some((p) => p === "EFEITOS_VISUAIS");
    const orcamentoValido = projeto.orcamento > 0;
    const prazoRealistaParaRender = projeto.prazo.getTime() - Date.now() > 30 * 24 * 60 * 60 * 1000;
    const papeisPreenchidos = projeto
      .papeisObrigatorios()
      .every((papel) => projeto.equipe?.obterMembroPorPapel(papel) !== undefined);
    return orcamentoValido && temVFX && prazoRealistaParaRender && papeisPreenchidos;
  }

  visitarProfissional(profissional: Profissional): boolean {
    const temModelagem = profissional.competencias.some(
      (c) => c.nome === "modelagem_3d" || c.nome === "efeitos_visuais",
    );
    return profissional.disponivel && temModelagem;
  }
}

