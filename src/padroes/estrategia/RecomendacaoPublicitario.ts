import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import type { RecomendacaoStrategy } from "./RecomendacaoStrategy.js";

function pontuacaoPublicitario(profissional: Profissional, orcamento: number): number {
  const economiaRelativa = orcamento > 0 ? 1 - profissional.precoMedio / orcamento : 0;
  return economiaRelativa + profissional.historicoProjetos * 0.01;
}

export class RecomendacaoPublicitario implements RecomendacaoStrategy {
  nome = "RECOMENDACAO_PUBLICITARIO";

  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    for (const papel of projeto.papeisObrigatorios()) {
      const candidatos = profissionais
        .filter((p) => p.especialidades.includes(papel))
        .sort(
          (a, b) =>
            pontuacaoPublicitario(b, projeto.orcamento) -
            pontuacaoPublicitario(a, projeto.orcamento),
        );
      resultado.set(papel, candidatos);
    }
    return resultado;
  }
}

