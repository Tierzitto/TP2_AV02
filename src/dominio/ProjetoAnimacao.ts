import { Papel } from "./Papel.js";
import { Projeto, DadosProjeto } from "./Projeto.js";
import { FabricaAnimacao } from "../padroes/fabrica-abstrata/FabricaAnimacao.js";
import type { FabricaProjeto } from "../padroes/fabrica-abstrata/FabricaProjeto.js";

export class ProjetoAnimacao extends Projeto {
  taxaRenderizacao: number;
  estilo3D: boolean;

  constructor(dados: DadosProjeto & { taxaRenderizacao?: number; estilo3D?: boolean }) {
    super({ ...dados, tipoCaptacao: "ANIMACAO" });
    this.taxaRenderizacao = dados.taxaRenderizacao ?? 24;
    this.estilo3D = dados.estilo3D ?? true;
  }

  criarFabrica(): FabricaProjeto {
    return new FabricaAnimacao();
  }

  clonar(): ProjetoAnimacao {
    const clone = new ProjetoAnimacao({
      ...this.dadosParaClone(),
      taxaRenderizacao: this.taxaRenderizacao,
      estilo3D: this.estilo3D,
    });
    this.copiarEstadoPara(clone);
    return clone;
  }

  papeisEspecificos(): Papel[] {
    return [Papel.EFEITOS_VISUAIS, Papel.DIRETOR, Papel.EDITOR];
  }

  eficienciaRenderizacao(): number {
    return this.taxaRenderizacao / this.duracao;
  }
}
