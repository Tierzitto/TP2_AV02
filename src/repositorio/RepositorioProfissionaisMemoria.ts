import type { Profissional } from "../dominio/Profissional.js";
import type { Papel } from "../dominio/Papel.js";
import type { RepositorioProfissionais } from "./RepositorioProfissionais.js";

export class RepositorioProfissionaisMemoria implements RepositorioProfissionais {
  private profissionais: Map<string, Profissional> = new Map();

  async listarTodos(): Promise<Profissional[]> {
    return Array.from(this.profissionais.values());
  }

  async buscarPorId(id: string): Promise<Profissional | null> {
    return this.profissionais.get(id) || null;
  }

  async buscarPorEspecialidade(papel: Papel): Promise<Profissional[]> {
    return Array.from(this.profissionais.values()).filter((p) => p.especialidades.includes(papel));
  }

  async salvar(profissional: Profissional): Promise<void> {
    this.profissionais.set(profissional.id, profissional);
  }
}
