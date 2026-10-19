import type { Projeto } from "../dominio/Projeto.js";

export interface RepositorioProjetos {
  salvar(projeto: Projeto): Promise<void>;
  buscarPorId(id: string): Promise<Projeto | null>;
  listarTodos(): Promise<Projeto[]>;
}
