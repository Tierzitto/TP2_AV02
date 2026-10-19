import type { Papel } from "./Papel.js";
import type { StatusConvite } from "./MembroEquipe.js";

export interface Convite {
  id?: string;
  profissionalId: string;
  papel: Papel;
  status: StatusConvite;
  dataEnvio: Date;
  dataResposta?: Date;
}
