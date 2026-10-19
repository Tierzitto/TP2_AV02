import { PrismaClient } from "@prisma/client";
import type { RepositorioProfissionais } from "./RepositorioProfissionais.js";
import { Profissional } from "../dominio/Profissional.js";
import { Papel } from "../dominio/Papel.js";

export class RepositorioProfissionaisPrisma implements RepositorioProfissionais {
  constructor(private prisma: PrismaClient) {}

  async listarTodos(): Promise<Profissional[]> {
    const dados = await this.prisma.profissional.findMany({
      include: { competencias: true, avaliacoes: true },
    });
    return dados.map(this.mapearParaDominio);
  }

  async buscarPorId(id: string): Promise<Profissional | null> {
    const dado = await this.prisma.profissional.findUnique({
      where: { id },
      include: { competencias: true, avaliacoes: true },
    });
    return dado ? this.mapearParaDominio(dado) : null;
  }

  async buscarPorEspecialidade(papel: Papel): Promise<Profissional[]> {
    const dados = await this.prisma.profissional.findMany({
      where: { especialidades: { contains: papel } },
      include: { competencias: true, avaliacoes: true },
    });
    return dados.map(this.mapearParaDominio);
  }

  async salvar(profissional: Profissional): Promise<void> {
    await this.prisma.profissional.upsert({
      where: { id: profissional.id },
      update: {
        nome: profissional.nome,
        email: profissional.email,
        localizacao: profissional.localizacao,
        precoMedio: profissional.precoMedio,
        disponivel: profissional.disponivel,
        historicoProjetos: profissional.historicoProjetos,
        especialidades: profissional.especialidades.join(","),
      },
      create: {
        id: profissional.id,
        nome: profissional.nome,
        email: profissional.email,
        localizacao: profissional.localizacao,
        precoMedio: profissional.precoMedio,
        disponivel: profissional.disponivel,
        historicoProjetos: profissional.historicoProjetos,
        especialidades: profissional.especialidades.join(","),
      },
    });
  }

  private mapearParaDominio(dado: any): Profissional {
    return new Profissional({
      id: dado.id,
      nome: dado.nome,
      email: dado.email,
      localizacao: dado.localizacao,
      precoMedio: dado.precoMedio,
      disponivel: dado.disponivel,
      historicoProjetos: dado.historicoProjetos,
      especialidades: dado.especialidades.split(",") as Papel[],
      competencias: dado.competencias,
      avaliacoes: dado.avaliacoes,
    });
  }
}
