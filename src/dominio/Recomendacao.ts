import type { Papel } from "./Papel.js";

export interface Recomendacao {
  id?: string;
  projetoId: string;
  profissionalId: string;
  papel: Papel;
  pontuacao: number;
  estrategiaUsada: string;
  dataGeracao: Date;
}
