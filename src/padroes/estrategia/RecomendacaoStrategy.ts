import type { Papel } from "../../dominio/Papel.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

export interface RecomendacaoStrategy {
  nome: string;
  recomendar(projeto: Projeto, profissionais: Profissional[]): Map<Papel, Profissional[]>;
}
