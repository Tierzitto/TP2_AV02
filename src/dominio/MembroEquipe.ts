import type { Papel } from "./Papel.js";
import type { Profissional } from "./Profissional.js";

export type StatusConvite = "PENDENTE" | "ACEITO" | "RECUSADO";

export class MembroEquipe {
  id?: string;
  papel: Papel;
  profissional: Profissional;
  confirmado: boolean;
  statusConvite: StatusConvite;

  constructor(papel: Papel, profissional: Profissional) {
    this.papel = papel;
    this.profissional = profissional;
    this.confirmado = false;
    this.statusConvite = "PENDENTE";
  }

  confirmar(): void {
    this.confirmado = true;
    this.statusConvite = "ACEITO";
  }

  recusar(): void {
    this.confirmado = false;
    this.statusConvite = "RECUSADO";
  }

  clonar(): MembroEquipe {
    const copia = new MembroEquipe(this.papel, this.profissional);
    copia.id = this.id;
    copia.confirmado = this.confirmado;
    copia.statusConvite = this.statusConvite;
    return copia;
  }
}
