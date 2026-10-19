import type { VisitanteProjeto } from "./VisitanteProjeto.js";

export interface ElementoVisitavel {
  aceitar<T>(visitante: VisitanteProjeto<T>): T;
}
