import { describe, it, expect, vi, afterEach } from "vitest";
import { Papel } from "../src/dominio/Papel.js";
import { Projeto } from "../src/dominio/Projeto.js";
import type { DadosProjeto } from "../src/dominio/Projeto.js";
import { ProjetoDocumentario } from "../src/dominio/ProjetoDocumentario.js";
import { ProjetoAnimacao } from "../src/dominio/ProjetoAnimacao.js";
import { ProjetoPublicitario } from "../src/dominio/ProjetoPublicitario.js";
import { RegistroPrototipos } from "../src/padroes/prototipo/RegistroPrototipos.js";
import { FabricaDocumentario } from "../src/padroes/fabrica-abstrata/FabricaDocumentario.js";
import { FabricaAnimacao } from "../src/padroes/fabrica-abstrata/FabricaAnimacao.js";
import { FabricaPublicitario } from "../src/padroes/fabrica-abstrata/FabricaPublicitario.js";
import type { FabricaProjeto } from "../src/padroes/fabrica-abstrata/FabricaProjeto.js";
import { OrquestradorPadrao } from "../src/padroes/template-method/OrquestradorPadrao.js";
import { SistemaRecomendacao } from "../src/servicos/SistemaRecomendacao.js";
import { ValidadorDocumentario } from "../src/padroes/visitante/ValidadorDocumentario.js";
import { ValidadorAnimacao } from "../src/padroes/visitante/ValidadorAnimacao.js";
import { ValidadorPublicitario } from "../src/padroes/visitante/ValidadorPublicitario.js";
import { RecomendacaoDocumentario } from "../src/padroes/estrategia/RecomendacaoDocumentario.js";
import { RecomendacaoAnimacao } from "../src/padroes/estrategia/RecomendacaoAnimacao.js";
import { RecomendacaoPublicitario } from "../src/padroes/estrategia/RecomendacaoPublicitario.js";
import { NotificadorDocumentario } from "../src/padroes/observador/NotificadorDocumentario.js";
import { NotificadorAnimacao } from "../src/padroes/observador/NotificadorAnimacao.js";
import { NotificadorPublicitario } from "../src/padroes/observador/NotificadorPublicitario.js";
import type { EventoRecomendacao } from "../src/dominio/EventoRecomendacao.js";
import {
  DIRETOR_BARATO,
  DIRETOR_CARO,
  SO_DIRETOR,
  dadosProjeto,
  diasAdiante,
  profissional,
} from "./helpers.js";

afterEach(() => {
  vi.restoreAllMocks();
});

function silenciarConsole() {
  return vi.spyOn(console, "log").mockImplementation(() => {});
}

describe("Prototype - clonar()", () => {
  it("cada subclasse devolve uma copia da propria classe com os atributos especificos", () => {
    const doc = new ProjetoDocumentario({ ...dadosProjeto(SO_DIRETOR), tema: "Amazonia", entrevistados: ["Ana", "Rui"] });
    const ani = new ProjetoAnimacao({ ...dadosProjeto(SO_DIRETOR), taxaRenderizacao: 30, estilo3D: false });
    const pub = new ProjetoPublicitario({ ...dadosProjeto(SO_DIRETOR), prazoRigido: false, numeroCampanhas: 4 });

    const cDoc = doc.clonar();
    const cAni = ani.clonar();
    const cPub = pub.clonar();

    expect(cDoc).toBeInstanceOf(ProjetoDocumentario);
    expect(cDoc.tema).toBe("Amazonia");
    expect(cDoc.entrevistados).toEqual(["Ana", "Rui"]);
    expect(cAni).toBeInstanceOf(ProjetoAnimacao);
    expect(cAni.taxaRenderizacao).toBe(30);
    expect(cAni.estilo3D).toBe(false);
    expect(cPub).toBeInstanceOf(ProjetoPublicitario);
    expect(cPub.prazoRigido).toBe(false);
    expect(cPub.numeroCampanhas).toBe(4);
  });

  it("a copia e profunda: papeis, entrevistados e prazo do clone sao independentes", () => {
    const original = new ProjetoDocumentario({ ...dadosProjeto(SO_DIRETOR), entrevistados: ["Ana"] });
    const clone = original.clonar();

    clone.papeisNecessarios[0].peso = 9;
    clone.papeisNecessarios.push({ papel: Papel.EDITOR, peso: 1, obrigatorio: false });
    clone.entrevistados.push("Rui");
    clone.prazo.setFullYear(2099);

    expect(original.papeisNecessarios).toHaveLength(1);
    expect(original.papeisNecessarios[0].peso).toBe(1);
    expect(original.entrevistados).toEqual(["Ana"]);
    expect(original.prazo.getFullYear()).not.toBe(2099);
  });

  it("a copia inclui a equipe, e ela tambem e independente", () => {
    const original = new ProjetoAnimacao(dadosProjeto(SO_DIRETOR));
    original.aceitarRecomendacao(Papel.DIRETOR, DIRETOR_CARO);

    const clone = original.clonar();

    expect(clone.status).toBe("EQUIPE_FORMADA");
    expect(clone.equipe).not.toBe(original.equipe);
    expect(clone.equipe?.membros[0]).not.toBe(original.equipe?.membros[0]);
    expect(clone.equipe?.membros[0].profissional.id).toBe("diretor-caro");

    clone.equipe?.membros[0].confirmar();
    expect(original.equipe?.membros[0].confirmado).toBe(false);
  });

  it("Projeto base tambem clona", () => {
    const original = new Projeto(dadosProjeto(SO_DIRETOR));
    const clone = original.clonar();
    expect(clone).not.toBe(original);
    expect(clone.nome).toBe(original.nome);
  });
});

describe("RegistroPrototipos", () => {
  function registroComAnimacao() {
    const registro = new RegistroPrototipos();
    const modelo = new ProjetoAnimacao({ ...dadosProjeto(SO_DIRETOR), taxaRenderizacao: 24 });
    registro.registrar("ANIMACAO", modelo);
    return { registro, modelo };
  }

  it("clona o prototipo com novo id, status CRIADO e sem equipe", () => {
    const { registro, modelo } = registroComAnimacao();
    modelo.aceitarRecomendacao(Papel.DIRETOR, DIRETOR_CARO);

    const a = registro.clonar("ANIMACAO");
    const b = registro.clonar("ANIMACAO");

    expect(a).toBeInstanceOf(ProjetoAnimacao);
    expect(a.id).not.toBe(modelo.id);
    expect(a.id).not.toBe(b.id);
    expect(a.status).toBe("CRIADO");
    expect(a.equipe).toBeUndefined();
  });

  it("aplica ajustes finos, inclusive em atributos especificos do tipo", () => {
    const { registro } = registroComAnimacao();
    const clone = registro.clonar("ANIMACAO", { nome: "Novo Curta", orcamento: 5000, taxaRenderizacao: 60 }) as ProjetoAnimacao;

    expect(clone.nome).toBe("Novo Curta");
    expect(clone.orcamento).toBe(5000);
    expect(clone.taxaRenderizacao).toBe(60);
  });

  it("ajustar um clone nao altera o prototipo nem outros clones", () => {
    const { registro } = registroComAnimacao();
    const papeis = [{ papel: Papel.EDITOR, peso: 2, obrigatorio: true }];
    const a = registro.clonar("ANIMACAO", { papeisNecessarios: papeis });
    papeis[0].peso = 99;
    const b = registro.clonar("ANIMACAO");

    expect(a.papeisNecessarios[0].peso).toBe(2);
    expect(b.papeisNecessarios[0].papel).toBe(Papel.DIRETOR);
  });

  it("alterar o objeto original depois de registrar nao muda o prototipo guardado", () => {
    const { registro, modelo } = registroComAnimacao();
    modelo.nome = "Mudou depois";
    expect(registro.clonar("ANIMACAO").nome).toBe("Projeto de Teste");
  });

  it("nao deixa ajustar tipoCaptacao, status nem equipe", () => {
    const { registro } = registroComAnimacao();
    expect(() => registro.clonar("ANIMACAO", { tipoCaptacao: "DOCUMENTARIO" })).toThrow();
    expect(() => registro.clonar("ANIMACAO", { status: "CANCELADO" })).toThrow();
    expect(() => registro.clonar("ANIMACAO", { equipe: undefined })).toThrow();
  });

  it("lista os tipos registrados e rejeita tipo desconhecido", () => {
    const { registro } = registroComAnimacao();
    expect(registro.tipos()).toEqual(["ANIMACAO"]);
    expect(() => registro.clonar("VR")).toThrow(/nao registrado/);
  });
});

describe("Factory Method - o projeto define qual fabrica o fabrica", () => {
  it("cada subclasse de Projeto cria a fabrica do seu tipo", () => {
    expect(new ProjetoDocumentario(dadosProjeto(SO_DIRETOR)).criarFabrica()).toBeInstanceOf(FabricaDocumentario);
    expect(new ProjetoAnimacao(dadosProjeto(SO_DIRETOR)).criarFabrica()).toBeInstanceOf(FabricaAnimacao);
    expect(new ProjetoPublicitario(dadosProjeto(SO_DIRETOR)).criarFabrica()).toBeInstanceOf(FabricaPublicitario);
  });

  it("um Projeto generico, sem fabrica, avisa com erro claro", () => {
    expect(() => new Projeto(dadosProjeto(SO_DIRETOR)).criarFabrica()).toThrow(/fabrica/);
  });
});

describe("Abstract Factory - familias coerentes", () => {
  it("FabricaDocumentario cria so componentes de documentario", () => {
    const f = new FabricaDocumentario();
    expect(f.criarProjeto(dadosProjeto(SO_DIRETOR))).toBeInstanceOf(ProjetoDocumentario);
    expect(f.criarValidador()).toBeInstanceOf(ValidadorDocumentario);
    expect(f.criarRecomendador()).toBeInstanceOf(RecomendacaoDocumentario);
    expect(f.criarNotificador()).toBeInstanceOf(NotificadorDocumentario);
  });

  it("FabricaAnimacao cria so componentes de animacao", () => {
    const f = new FabricaAnimacao();
    expect(f.criarProjeto(dadosProjeto(SO_DIRETOR))).toBeInstanceOf(ProjetoAnimacao);
    expect(f.criarValidador()).toBeInstanceOf(ValidadorAnimacao);
    expect(f.criarRecomendador()).toBeInstanceOf(RecomendacaoAnimacao);
    expect(f.criarNotificador()).toBeInstanceOf(NotificadorAnimacao);
  });

  it("FabricaPublicitario cria so componentes publicitarios", () => {
    const f = new FabricaPublicitario();
    expect(f.criarProjeto(dadosProjeto(SO_DIRETOR))).toBeInstanceOf(ProjetoPublicitario);
    expect(f.criarValidador()).toBeInstanceOf(ValidadorPublicitario);
    expect(f.criarRecomendador()).toBeInstanceOf(RecomendacaoPublicitario);
    expect(f.criarNotificador()).toBeInstanceOf(NotificadorPublicitario);
  });

  it("criarProjeto forca o tipoCaptacao da fabrica, mesmo que os dados digam outro", () => {
    const projeto = new FabricaAnimacao().criarProjeto(dadosProjeto(SO_DIRETOR, { tipoCaptacao: "DOCUMENTARIO" }));
    expect(projeto.tipoCaptacao).toBe("ANIMACAO");
  });
});

describe("OrquestradorEquipe - trocar a fabrica muda o resultado", () => {
  const orcamentoAlto = 600000;

  function orquestrar(fabrica: FabricaProjeto, dados: DadosProjeto, profissionais = [DIRETOR_CARO, DIRETOR_BARATO]) {
    const projeto = fabrica.criarProjeto(dados);
    const equipe = new OrquestradorPadrao(fabrica).orquestrar(projeto, profissionais);
    return { projeto, equipe };
  }

  it("a recomendacao muda: documentario escolhe a melhor competencia, publicitario o melhor custo", () => {
    silenciarConsole();
    const dados = dadosProjeto(SO_DIRETOR);

    const doc = orquestrar(new FabricaDocumentario(), dados);
    const pub = orquestrar(new FabricaPublicitario(), dados);

    expect(doc.equipe.membros[0].profissional.id).toBe("diretor-caro");
    expect(pub.equipe.membros[0].profissional.id).toBe("diretor-barato");
  });

  it("a validacao muda: o mesmo orcamento fecha equipe em documentario e nao fecha em publicitario", () => {
    silenciarConsole();
    const dados = dadosProjeto(SO_DIRETOR, { orcamento: orcamentoAlto });

    const doc = orquestrar(new FabricaDocumentario(), dados);
    const pub = orquestrar(new FabricaPublicitario(), dados);

    expect(doc.projeto.status).toBe("EQUIPE_FORMADA");
    expect(pub.projeto.status).toBe("EM_RECOMENDACAO");
  });

  it("a validacao de animacao exige prazo para renderizacao", () => {
    silenciarConsole();
    const vfx = profissional("vfx", Papel.EFEITOS_VISUAIS, [{ nome: "modelagem_3d", nivel: 9 }], 8000);
    const papeis = [{ papel: Papel.EFEITOS_VISUAIS, peso: 1.5, obrigatorio: true }];

    const curto = orquestrar(new FabricaAnimacao(), dadosProjeto(papeis, { prazo: diasAdiante(10) }), [vfx]);
    const longo = orquestrar(new FabricaAnimacao(), dadosProjeto(papeis, { prazo: diasAdiante(90) }), [vfx]);

    expect(curto.projeto.status).toBe("EM_RECOMENDACAO");
    expect(longo.projeto.status).toBe("EQUIPE_FORMADA");
  });

  it("a notificacao muda: cada fabrica usa o seu notificador", () => {
    const log = silenciarConsole();
    const dados = dadosProjeto(SO_DIRETOR);

    orquestrar(new FabricaDocumentario(), dados);
    orquestrar(new FabricaAnimacao(), dados);
    orquestrar(new FabricaPublicitario(), dados);

    const mensagens = log.mock.calls.map((chamada) => String(chamada[0]));
    expect(mensagens).toHaveLength(3);
    expect(mensagens[0]).toContain("[documentario]");
    expect(mensagens[1]).toContain("[animacao]");
    expect(mensagens[2]).toContain("[publicitario]");
  });

  it("uma estrategia passada explicitamente tem prioridade sobre a da fabrica", () => {
    silenciarConsole();
    const fabrica = new FabricaPublicitario();
    const projeto = fabrica.criarProjeto(dadosProjeto(SO_DIRETOR));
    const estrategiaFixa = {
      nome: "FIXA",
      recomendar: () => new Map([[Papel.DIRETOR, [DIRETOR_CARO]]]),
    };

    const equipe = new OrquestradorPadrao(fabrica).orquestrar(projeto, [DIRETOR_CARO, DIRETOR_BARATO], estrategiaFixa);

    expect(equipe.membros[0].profissional.id).toBe("diretor-caro");
  });
});

describe("Extensibilidade - novo tipo sem alterar o orquestrador", () => {
  const chamadas: string[] = [];

  class FabricaRealidadeVirtual implements FabricaProjeto {
    criarProjeto(dados: DadosProjeto): Projeto {
      return new ProjetoRealidadeVirtual(dados);
    }
    criarValidador() {
      return {
        visitarProjeto: () => {
          chamadas.push("validador");
          return true;
        },
        visitarProfissional: () => true,
      };
    }
    criarRecomendador() {
      return {
        nome: "RECOMENDACAO_RV",
        recomendar: (projeto: Projeto) => {
          chamadas.push("recomendador");
          return new Map(projeto.papeisObrigatorios().map((papel) => [papel, [DIRETOR_BARATO]]));
        },
      };
    }
    criarNotificador() {
      return {
        atualizar: (evento: EventoRecomendacao) => {
          chamadas.push(`notificador:${evento.tipo}`);
        },
      };
    }
  }

  class ProjetoRealidadeVirtual extends Projeto {
    constructor(dados: DadosProjeto) {
      super({ ...dados, tipoCaptacao: "FICCAO" });
    }
    criarFabrica(): FabricaProjeto {
      return new FabricaRealidadeVirtual();
    }
  }

  it("OrquestradorPadrao usa validador, recomendador e notificador da nova fabrica", () => {
    chamadas.length = 0;
    const fabrica = new FabricaRealidadeVirtual();
    const projeto = fabrica.criarProjeto(dadosProjeto(SO_DIRETOR));

    const equipe = new OrquestradorPadrao(fabrica).orquestrar(projeto, [DIRETOR_CARO, DIRETOR_BARATO]);

    expect(equipe.membros[0].profissional.id).toBe("diretor-barato");
    expect(projeto.status).toBe("EQUIPE_FORMADA");
    expect(chamadas).toEqual(["recomendador", "validador", "notificador:EQUIPE_ORQUESTRADA"]);
  });

  it("SistemaRecomendacao tambem funciona com o novo tipo, sem nenhuma alteracao", () => {
    chamadas.length = 0;
    const projeto = new ProjetoRealidadeVirtual(dadosProjeto(SO_DIRETOR));

    const equipe = new SistemaRecomendacao().formarEquipe(projeto, [DIRETOR_CARO, DIRETOR_BARATO]);

    expect(equipe.membros).toHaveLength(1);
    expect(chamadas).toContain("notificador:EQUIPE_ORQUESTRADA");
  });
});

describe("SistemaRecomendacao - escolhe a fabrica pelo tipo do projeto", () => {
  function eventosDe(projeto: Projeto) {
    silenciarConsole();
    const eventos: EventoRecomendacao[] = [];
    const sistema = new SistemaRecomendacao();
    sistema.adicionarObservador({ atualizar: (evento) => eventos.push(evento) });
    const recomendacoes = sistema.executarRecomendacao(projeto, [DIRETOR_CARO, DIRETOR_BARATO]);
    return { eventos, recomendacoes };
  }

  it("usa o recomendador do tipo de cada projeto", () => {
    const dados = dadosProjeto(SO_DIRETOR);
    const doc = eventosDe(new ProjetoDocumentario(dados));
    const ani = eventosDe(new ProjetoAnimacao(dados));
    const pub = eventosDe(new ProjetoPublicitario(dados));

    expect(doc.eventos[0].dados.estrategia).toBe("RECOMENDACAO_DOCUMENTARIO");
    expect(ani.eventos[0].dados.estrategia).toBe("RECOMENDACAO_ANIMACAO");
    expect(pub.eventos[0].dados.estrategia).toBe("RECOMENDACAO_PUBLICITARIO");
    expect(doc.recomendacoes.get(Papel.DIRETOR)?.[0].id).toBe("diretor-caro");
    expect(pub.recomendacoes.get(Papel.DIRETOR)?.[0].id).toBe("diretor-barato");
  });

  it("aciona o notificador do tipo, alem dos observadores registrados", () => {
    const log = silenciarConsole();
    const observador = vi.fn();
    const sistema = new SistemaRecomendacao();
    sistema.adicionarObservador({ atualizar: observador });

    sistema.executarRecomendacao(new ProjetoAnimacao(dadosProjeto(SO_DIRETOR)), [DIRETOR_CARO]);

    expect(observador).toHaveBeenCalledOnce();
    expect(String(log.mock.calls[0][0])).toContain("[animacao]");
  });

  it("removerObservador para de notificar", () => {
    silenciarConsole();
    const observador = { atualizar: vi.fn() };
    const sistema = new SistemaRecomendacao();
    sistema.adicionarObservador(observador);
    sistema.removerObservador(observador);

    sistema.executarRecomendacao(new ProjetoDocumentario(dadosProjeto(SO_DIRETOR)), [DIRETOR_CARO]);

    expect(observador.atualizar).not.toHaveBeenCalled();
  });

  it("formarEquipe monta o conjunto completo a partir do tipo do projeto", () => {
    silenciarConsole();
    const sistema = new SistemaRecomendacao();
    const projeto = new ProjetoPublicitario(dadosProjeto(SO_DIRETOR));

    const equipe = sistema.formarEquipe(projeto, [DIRETOR_CARO, DIRETOR_BARATO]);

    expect(equipe.membros[0].profissional.id).toBe("diretor-barato");
    expect(projeto.status).toBe("EQUIPE_FORMADA");
  });

  it("projeto de tipo sem fabrica gera erro claro", () => {
    const sistema = new SistemaRecomendacao();
    expect(() => sistema.executarRecomendacao(new Projeto(dadosProjeto(SO_DIRETOR)), [])).toThrow(/fabrica/);
  });
});
