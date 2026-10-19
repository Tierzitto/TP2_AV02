import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import fastify from "fastify";
import { rotasRecomendacao } from "../src/http/rotas.js";
import { RepositorioProfissionaisMemoria } from "../src/repositorio/RepositorioProfissionaisMemoria.js";
import { Papel } from "../src/dominio/Papel.js";
import { DIRETOR_CARO, diasAdiante } from "./helpers.js";

function corpo(sobrescrever: Record<string, unknown> = {}) {
  return {
    nome: "Curta",
    genero: "Drama",
    duracao: 20,
    orcamento: 100000,
    prazo: diasAdiante(90).toISOString(),
    tipoCaptacao: "DOCUMENTARIO",
    localizacao: "Sao Paulo",
    papeisNecessarios: [{ papel: Papel.DIRETOR, peso: 1, obrigatorio: true }],
    ...sobrescrever,
  };
}

describe("POST /projetos/:id/recomendar", () => {
  const app = fastify();

  beforeAll(async () => {
    const repositorio = new RepositorioProfissionaisMemoria();
    await repositorio.salvar(DIRETOR_CARO);
    await app.register(rotasRecomendacao(repositorio));
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forma a equipe usando a fabrica do tipo informado", async () => {
    const resposta = await app.inject({ method: "POST", url: "/projetos/abc/recomendar", payload: corpo() });

    expect(resposta.statusCode).toBe(200);
    expect(resposta.json()).toEqual({
      projetoId: "abc",
      status: "EQUIPE_FORMADA",
      membros: [{ papel: Papel.DIRETOR, profissionalId: "diretor-caro" }],
    });
  });

  it("rejeita tipo de captacao sem fabrica", async () => {
    const resposta = await app.inject({
      method: "POST",
      url: "/projetos/abc/recomendar",
      payload: corpo({ tipoCaptacao: "FICCAO" }),
    });
    expect(resposta.statusCode).toBe(400);
  });

  it("responde 422 quando o projeto nao atende as restricoes", async () => {
    const resposta = await app.inject({
      method: "POST",
      url: "/projetos/abc/recomendar",
      payload: corpo({ orcamento: 0 }),
    });
    expect(resposta.statusCode).toBe(422);
  });
});
