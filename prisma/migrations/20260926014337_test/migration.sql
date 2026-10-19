-- CreateTable
CREATE TABLE `Projeto` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `genero` VARCHAR(191) NOT NULL,
    `duracao` INTEGER NOT NULL,
    `orcamento` DOUBLE NOT NULL,
    `prazo` DATETIME(3) NOT NULL,
    `tipoCaptacao` VARCHAR(191) NOT NULL,
    `localizacao` VARCHAR(191) NOT NULL,
    `estrategiaPreferida` VARCHAR(191) NOT NULL DEFAULT 'SIMILARIDADE_COSSENO',
    `status` VARCHAR(191) NOT NULL DEFAULT 'CRIADO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PapelProjeto` (
    `id` VARCHAR(191) NOT NULL,
    `projetoId` VARCHAR(191) NOT NULL,
    `papel` VARCHAR(191) NOT NULL,
    `peso` DOUBLE NOT NULL DEFAULT 1.0,
    `obrigatorio` BOOLEAN NOT NULL DEFAULT true,

    INDEX `PapelProjeto_projetoId_idx`(`projetoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profissional` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `localizacao` VARCHAR(191) NOT NULL,
    `precoMedio` DOUBLE NOT NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `disponivelInicio` DATETIME(3) NULL,
    `disponivelFim` DATETIME(3) NULL,
    `historicoProjetos` INTEGER NOT NULL DEFAULT 0,
    `especialidades` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Profissional_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Competencia` (
    `id` VARCHAR(191) NOT NULL,
    `profissionalId` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `nivel` DOUBLE NOT NULL,

    INDEX `Competencia_profissionalId_idx`(`profissionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avaliacao` (
    `id` VARCHAR(191) NOT NULL,
    `profissionalId` VARCHAR(191) NOT NULL,
    `nota` DOUBLE NOT NULL,
    `comentario` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Avaliacao_profissionalId_idx`(`profissionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipe` (
    `id` VARCHAR(191) NOT NULL,
    `projetoId` VARCHAR(191) NOT NULL,
    `dataFormacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'SUGERIDA',

    INDEX `Equipe_projetoId_idx`(`projetoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MembroEquipe` (
    `id` VARCHAR(191) NOT NULL,
    `equipeId` VARCHAR(191) NOT NULL,
    `profissionalId` VARCHAR(191) NOT NULL,
    `papel` VARCHAR(191) NOT NULL,
    `confirmado` BOOLEAN NOT NULL DEFAULT false,
    `statusConvite` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',

    INDEX `MembroEquipe_equipeId_idx`(`equipeId`),
    INDEX `MembroEquipe_profissionalId_idx`(`profissionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recomendacao` (
    `id` VARCHAR(191) NOT NULL,
    `projetoId` VARCHAR(191) NOT NULL,
    `profissionalId` VARCHAR(191) NOT NULL,
    `papel` VARCHAR(191) NOT NULL,
    `pontuacao` DOUBLE NOT NULL,
    `estrategiaUsada` VARCHAR(191) NOT NULL,
    `dataGeracao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Recomendacao_projetoId_idx`(`projetoId`),
    INDEX `Recomendacao_profissionalId_idx`(`profissionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Convite` (
    `id` VARCHAR(191) NOT NULL,
    `membroEquipeId` VARCHAR(191) NOT NULL,
    `profissionalId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataResposta` DATETIME(3) NULL,

    INDEX `Convite_membroEquipeId_idx`(`membroEquipeId`),
    INDEX `Convite_profissionalId_idx`(`profissionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Auditoria` (
    `id` VARCHAR(191) NOT NULL,
    `tipoEvento` VARCHAR(191) NOT NULL,
    `origem` VARCHAR(191) NOT NULL,
    `dados` TEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PapelProjeto` ADD CONSTRAINT `PapelProjeto_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Competencia` ADD CONSTRAINT `Competencia_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `Profissional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `Profissional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipe` ADD CONSTRAINT `Equipe_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembroEquipe` ADD CONSTRAINT `MembroEquipe_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Equipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembroEquipe` ADD CONSTRAINT `MembroEquipe_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `Profissional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recomendacao` ADD CONSTRAINT `Recomendacao_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recomendacao` ADD CONSTRAINT `Recomendacao_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `Profissional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Convite` ADD CONSTRAINT `Convite_membroEquipeId_fkey` FOREIGN KEY (`membroEquipeId`) REFERENCES `MembroEquipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Convite` ADD CONSTRAINT `Convite_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `Profissional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
