import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import type { RecomendacaoStrategy } from "./RecomendacaoStrategy.js";

const PROJETOS_PARA_CONFIANCA_MAXIMA = 10;
const NOTA_MAXIMA = 5;

export class FiltragemColaborativa implements RecomendacaoStrategy {
  nome = "FILTRAGEM_COLABORATIVA";

  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    for (const papel of projeto.papeisObrigatorios()) {
      const candidatos = profissionais
        .filter((profissional) => profissional.especialidades.includes(papel))
        .map((profissional) => {
          const confianca = Math.min(profissional.historicoProjetos / PROJETOS_PARA_CONFIANCA_MAXIMA, 1);
          const pontuacao = (profissional.mediaAvaliacoes() / NOTA_MAXIMA) * (0.5 + confianca / 2);
          return { profissional, pontuacao };
        })
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .map((item) => item.profissional);
      resultado.set(papel, candidatos);
    }
    return resultado;
  }
}
