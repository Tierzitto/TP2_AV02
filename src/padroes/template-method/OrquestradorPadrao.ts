import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import { OrquestradorEquipe } from "./OrquestradorEquipe.js";
import type { FabricaProjeto } from "../fabrica-abstrata/FabricaProjeto.js";

const LIMITE_CANDIDATOS_POR_PAPEL = 3;

export class OrquestradorPadrao extends OrquestradorEquipe {
  constructor(fabrica: FabricaProjeto) {
    super(fabrica);
  }

  protected validarRestricoes(projeto: Projeto): boolean {
    const temOrcamento = projeto.orcamento > 0;
    const prazoValido = projeto.prazo.getTime() > Date.now();
    const temPapeisObrigatorios = projeto.papeisObrigatorios().length > 0;
    return temOrcamento && prazoValido && temPapeisObrigatorios;
  }

  protected normalizarDados(projeto: Projeto, profissionais: Profissional[]): Profissional[] {
    return profissionais.filter(
      (profissional) => profissional.disponivel && profissional.precoMedio <= projeto.orcamento,
    );
  }

  protected posProcessar(recomendacoes: Map<Papel, Profissional[]>): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    for (const [papel, candidatos] of recomendacoes) {
      resultado.set(papel, candidatos.slice(0, LIMITE_CANDIDATOS_POR_PAPEL));
    }
    return resultado;
  }
}
