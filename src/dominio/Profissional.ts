import type { Papel } from "./Papel.js";
import type { Competencia } from "./Competencia.js";
import type { Avaliacao } from "./Avaliacao.js";
import type { Intervalo } from "./Intervalo.js";
import type { ElementoVisitavel } from "../padroes/visitante/ElementoVisitavel.js";
import type { VisitanteProjeto } from "../padroes/visitante/VisitanteProjeto.js";

export interface DadosProfissional {
  id: string;
  nome: string;
  email: string;
  localizacao: string;
  precoMedio: number;
  disponivel?: boolean;
  disponibilidade?: Intervalo;
  historicoProjetos?: number;
  especialidades?: Papel[];
  competencias?: Competencia[];
  avaliacoes?: Avaliacao[];
}

export class Profissional implements ElementoVisitavel {
  id: string;
  nome: string;
  email: string;
  localizacao: string;
  precoMedio: number;
  disponivel: boolean;
  disponibilidade?: Intervalo;
  historicoProjetos: number;
  especialidades: Papel[];
  competencias: Competencia[];
  avaliacoes: Avaliacao[];

  constructor(dados: DadosProfissional) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.email = dados.email;
    this.localizacao = dados.localizacao;
    this.precoMedio = dados.precoMedio;
    this.disponivel = dados.disponivel ?? true;
    this.disponibilidade = dados.disponibilidade;
    this.historicoProjetos = dados.historicoProjetos ?? 0;
    this.especialidades = dados.especialidades ?? [];
    this.competencias = dados.competencias ?? [];
    this.avaliacoes = dados.avaliacoes ?? [];
  }

  nivelCompetencia(nome: string): number {
    const encontrada = this.competencias.find((competencia) => competencia.nome === nome);
    return encontrada ? encontrada.nivel : 0;
  }

  mediaAvaliacoes(): number {
    if (this.avaliacoes.length === 0) {
      return 0;
    }
    const soma = this.avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
    return soma / this.avaliacoes.length;
  }

  aceitar<T>(visitante: VisitanteProjeto<T>): T {
    return visitante.visitarProfissional(this);
  }
}
