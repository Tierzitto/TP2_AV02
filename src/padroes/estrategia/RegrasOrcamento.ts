import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import type { RecomendacaoStrategy } from "./RecomendacaoStrategy.js";

export class RegrasOrcamento implements RecomendacaoStrategy {
  nome = "REGRAS_ORCAMENTO";

  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const somaPesos = projeto.papeisNecessarios.reduce((total, item) => total + item.peso, 0) || 1;
    const resultado = new Map<Papel, Profissional[]>();
    for (const papel of projeto.papeisObrigatorios()) {
      const orcamentoDoPapel = projeto.orcamento * (projeto.pesoDoPapel(papel) / somaPesos);
      const candidatos = profissionais
        .filter((profissional) => profissional.especialidades.includes(papel))
        .map((profissional) => {
          const proporcao = orcamentoDoPapel > 0 ? profissional.precoMedio / orcamentoDoPapel : 1;
          const pontuacao = Math.max(0, 1 - proporcao);
          return { profissional, pontuacao };
        })
        .filter((item) => item.pontuacao > 0)
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .map((item) => item.profissional);
      resultado.set(papel, candidatos);
    }
    return resultado;
  }
}
