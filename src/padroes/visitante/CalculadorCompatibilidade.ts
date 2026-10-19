import type { VisitanteProjeto } from "./VisitanteProjeto.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

const NIVEL_MAXIMO_COMPETENCIA = 10;

export class CalculadorCompatibilidade implements VisitanteProjeto<number> {
  visitarProjeto(projeto: Projeto): number {
    const membros = projeto.equipe?.membros ?? [];
    if (membros.length === 0) {
      return 0;
    }
    const soma = membros.reduce((total, membro) => total + this.visitarProfissional(membro.profissional), 0);
    return soma / membros.length;
  }

  visitarProfissional(profissional: Profissional): number {
    if (profissional.competencias.length === 0) {
      return 0;
    }
    const soma = profissional.competencias.reduce((total, competencia) => total + competencia.nivel, 0);
    return soma / (profissional.competencias.length * NIVEL_MAXIMO_COMPETENCIA);
  }
}
