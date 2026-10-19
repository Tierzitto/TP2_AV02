import type { Profissional } from "../dominio/Profissional.js";
import type { Papel } from "../dominio/Papel.js";

export interface RepositorioProfissionais {
  listarTodos(): Promise<Profissional[]>;
  buscarPorId(id: string): Promise<Profissional | null>;
  buscarPorEspecialidade(papel: Papel): Promise<Profissional[]>;
  salvar(profissional: Profissional): Promise<void>;
}
