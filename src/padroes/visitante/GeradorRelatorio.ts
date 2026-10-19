import type { VisitanteProjeto } from "./VisitanteProjeto.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

export class GeradorRelatorio implements VisitanteProjeto<string> {
  visitarProjeto(projeto: Projeto): string {
    const totalMembros = projeto.equipe?.membros.length ?? 0;
    const totalObrigatorios = projeto.papeisObrigatorios().length;
    return `Projeto "${projeto.nome}": ${totalMembros}/${totalObrigatorios} papeis obrigatorios preenchidos, orcamento de ${projeto.orcamento}.`;
  }

  visitarProfissional(profissional: Profissional): string {
    return `${profissional.nome}: ${profissional.competencias.length} competencias registradas, media de avaliacoes ${profissional.mediaAvaliacoes().toFixed(1)}.`;
  }
}
