import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { SistemaRecomendacao } from "../servicos/SistemaRecomendacao.js";
import { RepositorioProfissionaisPrisma } from "../repositorio/RepositorioProfissionaisPrisma.js";
import type { RepositorioProfissionais } from "../repositorio/RepositorioProfissionais.js";
import type { DadosProjeto, TipoCaptacao } from "../dominio/Projeto.js";
import type { FabricaProjeto } from "../padroes/fabrica-abstrata/FabricaProjeto.js";
import { FabricaDocumentario } from "../padroes/fabrica-abstrata/FabricaDocumentario.js";
import { FabricaAnimacao } from "../padroes/fabrica-abstrata/FabricaAnimacao.js";
import { FabricaPublicitario } from "../padroes/fabrica-abstrata/FabricaPublicitario.js";

const FABRICAS: Partial<Record<TipoCaptacao, FabricaProjeto>> = {
  DOCUMENTARIO: new FabricaDocumentario(),
  ANIMACAO: new FabricaAnimacao(),
  PUBLICITARIO: new FabricaPublicitario(),
};

type CorpoRecomendacao = Omit<DadosProjeto, "id" | "prazo"> & { prazo: string };

export function rotasRecomendacao(repoProfissionais?: RepositorioProfissionais) {
  return async (app: FastifyInstance) => {
    const repositorio = repoProfissionais ?? new RepositorioProfissionaisPrisma(new PrismaClient());
    const sistema = new SistemaRecomendacao();
    app.post("/projetos/:id/recomendar", async (request, reply) => {
      const { id } = request.params as { id: string };
      const corpo = request.body as CorpoRecomendacao;
      const fabrica = FABRICAS[corpo?.tipoCaptacao];
      if (!fabrica) {
        return reply.status(400).send({ erro: "tipoCaptacao invalido. Use DOCUMENTARIO, ANIMACAO ou PUBLICITARIO." });
      }

      const projeto = fabrica.criarProjeto({ ...corpo, id, prazo: new Date(corpo.prazo) });
      const profissionais = await repositorio.listarTodos();

      try {
        const equipe = sistema.formarEquipe(projeto, profissionais);
        return {
          projetoId: projeto.id,
          status: projeto.status,
          membros: equipe.membros.map((membro) => ({ papel: membro.papel, profissionalId: membro.profissional.id })),
        };
      } catch (erro) {
        return reply.status(422).send({ erro: (erro as Error).message });
      }
    });
  };
}
