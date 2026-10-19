import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";

export interface VisitanteProjeto<T> {
  visitarProjeto(projeto: Projeto): T;
  visitarProfissional(profissional: Profissional): T;
}
