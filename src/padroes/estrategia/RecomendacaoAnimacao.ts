import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import type { RecomendacaoStrategy } from "./RecomendacaoStrategy.js";
import { Papel as PapelEnum } from "../../dominio/Papel.js";

const COMPETENCIAS_ANIMACAO = ["modelagem_3d", "efeitos_visuais", "composicao_digital"];

function pontuacaoAnimacao(profissional: Profissional, papel: Papel): number {
  const bonusVFX =
    papel === PapelEnum.EFEITOS_VISUAIS
      ? COMPETENCIAS_ANIMACAO.reduce((t, nome) => t + profissional.nivelCompetencia(nome), 0)
      : 0;
  return bonusVFX + profissional.historicoProjetos;
}

export class RecomendacaoAnimacao implements RecomendacaoStrategy {
  nome = "RECOMENDACAO_ANIMACAO";

  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    for (const papel of projeto.papeisObrigatorios()) {
      const candidatos = profissionais
        .filter((p) => p.especialidades.includes(papel))
        .sort((a, b) => pontuacaoAnimacao(b, papel) - pontuacaoAnimacao(a, papel));
      resultado.set(papel, candidatos);
    }
    return resultado;
  }
}

