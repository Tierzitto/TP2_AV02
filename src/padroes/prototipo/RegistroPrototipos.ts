import { randomUUID } from "node:crypto";
import type { Projeto, DadosProjeto } from "../../dominio/Projeto.js";

const CAMPOS_PROTEGIDOS = ["tipoCaptacao", "status", "equipe"];

export type AjustesProjeto = Partial<Omit<DadosProjeto, "tipoCaptacao">> & Record<string, unknown>;

export class RegistroPrototipos {
  private prototipos: Map<string, Projeto> = new Map();

  registrar(tipo: string, prototipo: Projeto): void {
    this.prototipos.set(tipo, prototipo.clonar());
  }

  clonar(tipo: string, ajustes: AjustesProjeto = {}): Projeto {
    const prototipo = this.prototipos.get(tipo);
    if (!prototipo) {
      throw new Error(`Prototipo do tipo "${tipo}" nao registrado.`);
    }
    const clone = prototipo.clonar();
    clone.id = randomUUID();
    clone.status = "CRIADO";
    clone.equipe = undefined;
    for (const [campo, valor] of Object.entries(ajustes)) {
      if (CAMPOS_PROTEGIDOS.includes(campo)) {
        throw new Error(`O campo "${campo}" nao pode ser ajustado ao clonar um prototipo.`);
      }
      Reflect.set(clone, campo, structuredClone(valor));
    }
    return clone;
  }

  tipos(): string[] {
    return Array.from(this.prototipos.keys());
  }
}
