import type { Profissional } from "../dominio/Profissional.js";
import type { Papel } from "../dominio/Papel.js";
import type { RepositorioProfissionais } from "./RepositorioProfissionais.js";

export class RepositorioProfissionaisFallback implements RepositorioProfissionais {
  constructor(
    private primario: RepositorioProfissionais,
    private fallback: RepositorioProfissionais,
  ) {}

  async listarTodos(): Promise<Profissional[]> {
    try {
      return await this.primario.listarTodos();
    } catch (error) {
      console.error("[RepositorioProfissionaisFallback] Erro no repositorio primario, usando fallback.", error);
      return await this.fallback.listarTodos();
    }
  }

  async buscarPorId(id: string): Promise<Profissional | null> {
    try {
      return await this.primario.buscarPorId(id);
    } catch (error) {
      console.error("[RepositorioProfissionaisFallback] Erro no repositorio primario, usando fallback.", error);
      return await this.fallback.buscarPorId(id);
    }
  }

  async buscarPorEspecialidade(papel: Papel): Promise<Profissional[]> {
    try {
      return await this.primario.buscarPorEspecialidade(papel);
    } catch (error) {
      console.error("[RepositorioProfissionaisFallback] Erro no repositorio primario, usando fallback.", error);
      return await this.fallback.buscarPorEspecialidade(papel);
    }
  }

  async salvar(profissional: Profissional): Promise<void> {
    try {
      await this.primario.salvar(profissional);
    } catch (error) {
      console.error("[RepositorioProfissionaisFallback] Erro ao salvar no primario.", error);
    }
  }
}
