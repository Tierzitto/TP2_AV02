# Cinebridge — Microsserviço de Recomendação e Orquestração de Equipes

## Etapa atual

Este documento registra as decisões da atividade 1 (domínio e os quatro padrões
Strategy, Template Method, Observer e Visitor). A atividade 2 adicionou Prototype,
Factory Method e Abstract Factory, além da persistência com Prisma/MySQL e da API
Fastify. A visão completa e atual está no `README.md`.

## Estrutura de pastas

```
src/
  dominio/        entidades e tipos de negócio (Projeto, Profissional, Equipe, ...)
  padroes/
    estrategia/     Strategy — algoritmos de recomendação
    template-method/ Template Method — orquestração da composição de equipe
    observador/     Observer — notificações e auditoria
    visitante/       Visitor — operações transversais sobre Projeto/Profissional
  servicos/        serviços de aplicação que compõem os padrões (SistemaRecomendacao)
```

## Domínio

- `Papel`: enum com os papéis técnicos (`DIRETOR`, `DIRETOR_FOTOGRAFIA`, `SONOPLASTA`,
  `EDITOR`, `ROTEIRISTA`, `EFEITOS_VISUAIS`).
- `Profissional`: dados cadastrais, competências, avaliações, disponibilidade e
  especialidades (papéis que a pessoa pode desempenhar).
- `Projeto`: atributos do projeto audiovisual, papéis necessários (com peso e
  obrigatoriedade), e os métodos de negócio `aceitarRecomendacao`, `substituirMembro` e
  `solicitarReavaliacao`.
- `Equipe` / `MembroEquipe`: composição da equipe sugerida/formada.
- `Recomendacao`, `Convite`, `EventoRecomendacao`: tipos auxiliares alinhados ao
  `prisma/schema.prisma` (que já previa essas entidades, embora elas não estivessem
  desenhadas no diagrama UML enviado).

`Projeto` e `Profissional` são os elementos "visitáveis" no padrão Visitor: cada um
implementa `aceitar<T>(visitante)`, delegando para `visitarProjeto`/`visitarProfissional`.

## Os quatro padrões

### Strategy (`src/padroes/estrategia`)

`RecomendacaoStrategy` define `recomendar(projeto, profissionais): Map<Papel, Profissional[]>`.
Implementações:
- `SimilaridadeCosseno`: compara o vetor de competências do profissional com um vetor
  "ideal" para o papel (competências relevantes por papel, ver `CompetenciasPorPapel.ts`).
- `FiltragemColaborativa`: usa a média de avaliações históricas, ponderada pela
  experiência (quantidade de projetos anteriores).
- `RegrasOrcamento`: pontua profissionais mais baratos em relação à fatia do orçamento
  destinada ao papel (pensada para projetos de orçamento reduzido).

Todas filtram candidatos pela lista `especialidades` do profissional (quem pode atuar
naquele papel).

### Template Method (`src/padroes/template-method`)

`OrquestradorEquipe` (abstrata) recebe uma `FabricaProjeto` no construtor e define o método
`orquestrar(projeto, profissionaisDisponiveis, estrategia?)` como esqueleto fixo:
1. `validarRestricoes` (hook)
2. `normalizarDados` (hook)
3. chama a `RecomendacaoStrategy` (a da fábrica, ou a passada explicitamente)
4. `posProcessar` (hook)
5. monta a `Equipe`, escolhendo o profissional mais bem ranqueado por papel
6. valida a equipe com o validador da fábrica, atualiza `projeto.status` e avisa o
   notificador da fábrica

`OrquestradorPadrao` implementa os três hooks com regras simples (orçamento/prazo
válidos, filtro de disponibilidade e preço, limite de 3 candidatos por papel).

**Desvio proposital do diagrama**: no diagrama, `orquestrar` recebe apenas
`(projeto, estrategia)`. Nesta etapa, sem repositório/persistência ainda, o método recebe
também `profissionaisDisponiveis` diretamente. Na próxima etapa, isso será substituído por
um repositório injetado (`RepositorioProfissionais`), respeitando a inversão de
dependência mencionada no discurso do arquiteto, sem alterar o restante do algoritmo.

### Observer (`src/padroes/observador`)

`Observador` define `atualizar(evento)`. `SistemaRecomendacao` (em `src/servicos`) é o
sujeito: mantém a lista de observadores, executa a recomendação com a fábrica do tipo do
projeto e notifica todos os observadores com um `EventoRecomendacao`.

Implementações: `NotificadorEmail`, `NotificadorInterno` (ambos apenas logam no console
nesta etapa — a integração real de e-mail/mensageria fica para depois) e
`AuditoriaRecomendacao` (guarda os eventos em memória; na próxima etapa passa a persistir
na tabela `Auditoria` do Prisma).

### Visitor (`src/padroes/visitante`)

`VisitanteProjeto<T>` define `visitarProjeto`/`visitarProfissional`. `ElementoVisitavel`
define `aceitar<T>(visitante): T`, implementada por `Projeto` e `Profissional`
(double dispatch clássico).

Implementações: `ValidadorConsistencia` (boolean — papéis obrigatórios preenchidos e
orçamento válido), `CalculadorCompatibilidade` (number — média normalizada do nível de
competências) e `GeradorRelatorio` (string — resumo textual).

**Ajuste em relação ao diagrama**: o diagrama não mostrava uma interface comum de
elemento visitável — só associações soltas `aceita` de `Projeto` e `Profissional` para
`VisitanteProjeto`. Isso foi formalizado com a interface `ElementoVisitavel`, para seguir
o padrão Visitor corretamente.

## Outras correções de coerência em relação ao diagrama original

- `MembroEquipe` tinha multiplicidade `1..*` para `Papel` e `0..*` para `Profissional`;
  não faz sentido um membro da equipe ocupar vários papéis ou representar vários
  profissionais ao mesmo tempo — cada `MembroEquipe` agora tem exatamente 1 `Papel` e 1
  `Profissional`.
- O texto cita `Recomendacao` e `Convite` como entidades principais (e elas já existem no
  `schema.prisma`), mas não apareciam como classes no diagrama — foram adicionadas ao
  domínio (`src/dominio/Recomendacao.ts`, `src/dominio/Convite.ts`).

## Próximos passos (etapas seguintes, combinadas com o grupo)

1. Persistência: `RepositorioProfissionais` (interface) + implementação via Prisma/MySQL,
   com fallback (para o requisito de tolerância a falhas do enunciado).
2. API HTTP em Fastify, cobrindo os fluxos centrais: criar projeto, gerar recomendação,
   aceitar/rejeitar/substituir membro, solicitar reavaliação de equipe.
3. Testes automatizados (Vitest) e documentação final.
