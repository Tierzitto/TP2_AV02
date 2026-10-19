import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { Papel } from "../src/dominio/Papel.js";
import { ProjetoDocumentario } from "../src/dominio/ProjetoDocumentario.js";
import { FabricaDocumentario } from "../src/padroes/fabrica-abstrata/FabricaDocumentario.js";
import { OrquestradorPadrao } from "../src/padroes/template-method/OrquestradorPadrao.js";
import { SimilaridadeCosseno } from "../src/padroes/estrategia/SimilaridadeCosseno.js";
import { DIRETOR_CARO, SO_DIRETOR, dadosProjeto, profissional } from "./helpers.js";

describe("Orquestrador de Equipe (Integration)", () => {
  let orquestrador: OrquestradorPadrao;
  let projeto: ProjetoDocumentario;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    orquestrador = new OrquestradorPadrao(new FabricaDocumentario());
    projeto = new ProjetoDocumentario(dadosProjeto(SO_DIRETOR));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("compoe uma equipe quando ha profissionais qualificados", () => {
    const equipe = orquestrador.orquestrar(projeto, [DIRETOR_CARO]);

    expect(equipe.membros).toHaveLength(1);
    expect(equipe.membros[0].papel).toBe(Papel.DIRETOR);
    expect(projeto.status).toBe("EQUIPE_FORMADA");
  });

  it("aceita outra estrategia no lugar da fabrica", () => {
    const equipe = orquestrador.orquestrar(projeto, [DIRETOR_CARO], new SimilaridadeCosseno());
    expect(equipe.membros).toHaveLength(1);
  });

  it("deixa o projeto em recomendacao quando falta profissional para um papel obrigatorio", () => {
    const outroPapel = profissional("editor", Papel.EDITOR, [{ nome: "edicao", nivel: 8 }], 1000);
    orquestrador.orquestrar(projeto, [outroPapel]);
    expect(projeto.status).toBe("EM_RECOMENDACAO");
  });

  it("lanca erro se o projeto nao tiver orcamento", () => {
    projeto.orcamento = 0;
    expect(() => orquestrador.orquestrar(projeto, [DIRETOR_CARO])).toThrow();
  });

  it("lanca erro se o prazo ja passou", () => {
    projeto.prazo = new Date(Date.now() - 1000);
    expect(() => orquestrador.orquestrar(projeto, [DIRETOR_CARO])).toThrow();
  });
});
