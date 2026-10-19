import { Papel } from "../src/dominio/Papel.js";
import { Profissional } from "../src/dominio/Profissional.js";
import type { Competencia } from "../src/dominio/Competencia.js";
import type { DadosProjeto, PapelProjeto } from "../src/dominio/Projeto.js";

export const DIA = 24 * 60 * 60 * 1000;

export function diasAdiante(dias: number): Date {
  return new Date(Date.now() + dias * DIA);
}

export function profissional(
  id: string,
  papel: Papel,
  competencias: Competencia[],
  precoMedio: number,
  historicoProjetos = 0,
): Profissional {
  return new Profissional({
    id,
    nome: id,
    email: `${id}@teste.com`,
    localizacao: "Sao Paulo",
    precoMedio,
    especialidades: [papel],
    competencias,
    historicoProjetos,
  });
}

export function dadosProjeto(
  papeis: PapelProjeto[],
  sobrescrever: Partial<DadosProjeto> = {},
): DadosProjeto {
  return {
    id: "projeto-teste",
    nome: "Projeto de Teste",
    genero: "Drama",
    duracao: 60,
    orcamento: 100000,
    prazo: diasAdiante(90),
    tipoCaptacao: "DOCUMENTARIO",
    localizacao: "Sao Paulo",
    papeisNecessarios: papeis,
    ...sobrescrever,
  };
}

export const SO_DIRETOR: PapelProjeto[] = [{ papel: Papel.DIRETOR, peso: 1, obrigatorio: true }];

export const DIRETOR_CARO = profissional(
  "diretor-caro",
  Papel.DIRETOR,
  [
    { nome: "direcao", nivel: 10 },
    { nome: "lideranca_de_equipe", nivel: 10 },
    { nome: "narrativa", nivel: 10 },
  ],
  90000,
);

export const DIRETOR_BARATO = profissional(
  "diretor-barato",
  Papel.DIRETOR,
  [
    { nome: "direcao", nivel: 5 },
    { nome: "lideranca_de_equipe", nivel: 5 },
    { nome: "narrativa", nivel: 5 },
  ],
  10000,
);
