import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import type { RecomendacaoStrategy } from "./RecomendacaoStrategy.js";
import { COMPETENCIAS_POR_PAPEL } from "./CompetenciasPorPapel.js";
import { Papel as PapelEnum } from "../../dominio/Papel.js";

const NIVEL_MAXIMO_COMPETENCIA = 10;
const PESO_FOTOGRAFIA = 1.5;
const PESO_SONOPLASTIA = 1.3;

function pontuacao(profissional: Profissional, papel: Papel): number {
  const competenciasRelevantes = COMPETENCIAS_POR_PAPEL[papel];
  const multiplicador =
    papel === PapelEnum.DIRETOR_FOTOGRAFIA
      ? PESO_FOTOGRAFIA
      : papel === PapelEnum.SONOPLASTA
        ? PESO_SONOPLASTIA
        : 1;
  const soma = competenciasRelevantes.reduce(
    (total, nome) => total + profissional.nivelCompetencia(nome),
    0,
  );
  const media = competenciasRelevantes.length > 0 ? soma / competenciasRelevantes.length : 0;
  return (media / NIVEL_MAXIMO_COMPETENCIA) * multiplicador;
}

export class RecomendacaoDocumentario implements RecomendacaoStrategy {
  nome = "RECOMENDACAO_DOCUMENTARIO";

  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    for (const papel of projeto.papeisObrigatorios()) {
      const candidatos = profissionais
        .filter((p) => p.especialidades.includes(papel))
        .sort((a, b) => pontuacao(b, papel) - pontuacao(a, papel));
      resultado.set(papel, candidatos);
    }
    return resultado;
  }
}

