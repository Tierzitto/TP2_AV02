import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import type { RecomendacaoStrategy } from "./RecomendacaoStrategy.js";
import { COMPETENCIAS_POR_PAPEL } from "./CompetenciasPorPapel.js";

const NIVEL_MAXIMO_COMPETENCIA = 10;

function similaridadeCosseno(vetorA: number[], vetorB: number[]): number {
  const produtoInterno = vetorA.reduce((total, valor, indice) => total + valor * vetorB[indice], 0);
  const normaA = Math.sqrt(vetorA.reduce((total, valor) => total + valor * valor, 0));
  const normaB = Math.sqrt(vetorB.reduce((total, valor) => total + valor * valor, 0));
  if (normaA === 0 || normaB === 0) {
    return 0;
  }
  return produtoInterno / (normaA * normaB);
}

export class SimilaridadeCosseno implements RecomendacaoStrategy {
  nome = "SIMILARIDADE_COSSENO";

  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    for (const papel of projeto.papeisObrigatorios()) {
      const competenciasRelevantes = COMPETENCIAS_POR_PAPEL[papel];
      const vetorAlvo = competenciasRelevantes.map(() => NIVEL_MAXIMO_COMPETENCIA);
      const candidatos = profissionais
        .filter((profissional) => profissional.especialidades.includes(papel))
        .map((profissional) => {
          const vetorProfissional = competenciasRelevantes.map((nome) => profissional.nivelCompetencia(nome));
          return { profissional, pontuacao: similaridadeCosseno(vetorProfissional, vetorAlvo) };
        })
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .map((item) => item.profissional);
      resultado.set(papel, candidatos);
    }
    return resultado;
  }
}
