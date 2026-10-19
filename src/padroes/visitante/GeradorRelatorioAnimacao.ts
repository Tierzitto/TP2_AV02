import type { VisitanteProjeto } from "./VisitanteProjeto.js";
import type { Projeto } from "../../dominio/Projeto.js";
import type { Profissional } from "../../dominio/Profissional.js";
import { ProjetoAnimacao } from "../../dominio/ProjetoAnimacao.js";

export class GeradorRelatorioAnimacao implements VisitanteProjeto<string> {
  visitarProjeto(projeto: Projeto): string {
    const totalMembros = projeto.equipe?.membros.length ?? 0;
    const totalObrigatorios = projeto.papeisObrigatorios().length;
    let metricas = "";
    if (projeto instanceof ProjetoAnimacao) {
      const eficiencia = projeto.eficienciaRenderizacao().toFixed(4);
      metricas = ` | taxa de renderizacao: ${projeto.taxaRenderizacao}fps | eficiencia: ${eficiencia}`;
    }
    return `Projeto "${projeto.nome}": ${totalMembros}/${totalObrigatorios} papeis preenchidos, orcamento de ${projeto.orcamento}${metricas}.`;
  }

  visitarProfissional(profissional: Profissional): string {
    const temVFX = profissional.competencias.some(
      (c) => c.nome === "modelagem_3d" || c.nome === "efeitos_visuais",
    );
    return `${profissional.nome}: ${profissional.competencias.length} competencias, VFX habilitado: ${temVFX}.`;
  }
}

