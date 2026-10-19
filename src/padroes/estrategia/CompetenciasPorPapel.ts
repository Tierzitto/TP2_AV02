import { Papel } from "../../dominio/Papel.js";

export const COMPETENCIAS_POR_PAPEL: Record<Papel, string[]> = {
  [Papel.DIRETOR]: ["direcao", "lideranca_de_equipe", "narrativa"],
  [Papel.DIRETOR_FOTOGRAFIA]: ["fotografia", "iluminacao", "enquadramento"],
  [Papel.SONOPLASTA]: ["captacao_de_audio", "mixagem", "design_de_som"],
  [Papel.EDITOR]: ["edicao", "ritmo_narrativo", "colorimetria"],
  [Papel.ROTEIRISTA]: ["roteiro", "estrutura_narrativa", "dialogo"],
  [Papel.EFEITOS_VISUAIS]: ["efeitos_visuais", "modelagem_3d", "composicao_digital"],
};
