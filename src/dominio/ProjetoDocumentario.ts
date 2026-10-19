import { Papel } from "./Papel.js";
import { Projeto, DadosProjeto } from "./Projeto.js";
import { FabricaDocumentario } from "../padroes/fabrica-abstrata/FabricaDocumentario.js";
import type { FabricaProjeto } from "../padroes/fabrica-abstrata/FabricaProjeto.js";

export class ProjetoDocumentario extends Projeto {
  tema: string;
  entrevistados: string[];

  constructor(dados: DadosProjeto & { tema?: string; entrevistados?: string[] }) {
    super({ ...dados, tipoCaptacao: "DOCUMENTARIO" });
    this.tema = dados.tema ?? "";
    this.entrevistados = [...(dados.entrevistados ?? [])];
  }

  criarFabrica(): FabricaProjeto {
    return new FabricaDocumentario();
  }

  clonar(): ProjetoDocumentario {
    const clone = new ProjetoDocumentario({
      ...this.dadosParaClone(),
      tema: this.tema,
      entrevistados: [...this.entrevistados],
    });
    this.copiarEstadoPara(clone);
    return clone;
  }

  papeisEspecificos(): Papel[] {
    return [Papel.DIRETOR, Papel.DIRETOR_FOTOGRAFIA, Papel.SONOPLASTA];
  }
}
