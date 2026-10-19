import { Papel } from "./Papel.js";
import { Projeto, DadosProjeto } from "./Projeto.js";
import { FabricaPublicitario } from "../padroes/fabrica-abstrata/FabricaPublicitario.js";
import type { FabricaProjeto } from "../padroes/fabrica-abstrata/FabricaProjeto.js";

export class ProjetoPublicitario extends Projeto {
  prazoRigido: boolean;
  numeroCampanhas: number;

  constructor(dados: DadosProjeto & { prazoRigido?: boolean; numeroCampanhas?: number }) {
    super({ ...dados, tipoCaptacao: "PUBLICITARIO" });
    this.prazoRigido = dados.prazoRigido ?? true;
    this.numeroCampanhas = dados.numeroCampanhas ?? 1;
  }

  criarFabrica(): FabricaProjeto {
    return new FabricaPublicitario();
  }

  clonar(): ProjetoPublicitario {
    const clone = new ProjetoPublicitario({
      ...this.dadosParaClone(),
      prazoRigido: this.prazoRigido,
      numeroCampanhas: this.numeroCampanhas,
    });
    this.copiarEstadoPara(clone);
    return clone;
  }

  papeisEspecificos(): Papel[] {
    return [Papel.DIRETOR, Papel.EDITOR, Papel.ROTEIRISTA];
  }
}
