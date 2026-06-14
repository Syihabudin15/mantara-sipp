/*
  Warnings:

  - The values [CANCEL,PROCCESS,APPROVED,REJECTED,PAID_OFF] on the enum `Dapem_cash_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVED,REJECTED] on the enum `Pelunasan_status_paid` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVED,REJECTED] on the enum `Pelunasan_status_paid` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVED,REJECTED] on the enum `Pelunasan_status_paid` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCEL,PROCCESS,APPROVED,REJECTED,PAID_OFF] on the enum `Dapem_cash_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCEL,PROCCESS,APPROVED,REJECTED,PAID_OFF] on the enum `Dapem_cash_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCEL,PROCCESS,APPROVED,REJECTED,PAID_OFF] on the enum `Dapem_cash_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCEL,PROCCESS,APPROVED,REJECTED,PAID_OFF] on the enum `Dapem_cash_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVED,REJECTED] on the enum `Pelunasan_status_paid` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `dapem` ADD COLUMN `agentFrontingId` VARCHAR(191) NULL,
    ADD COLUMN `c_provisi_sumdan` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `dropping_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    MODIFY `verif_status` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NULL,
    MODIFY `slik_status` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NULL,
    MODIFY `approv_status` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NULL,
    MODIFY `takeover_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    MODIFY `mutasi_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    MODIFY `flagging_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    MODIFY `cash_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `pelunasan` MODIFY `status_paid` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `produkpembiayaan` ADD COLUMN `c_provisi` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `agentFrontingId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AgentFronting` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `file` VARCHAR(191) NULL,
    `target` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SumdanAgentFronting` (
    `id` VARCHAR(191) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,
    `agentFrontingId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `AgentFronting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `AgentFronting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumdanAgentFronting` ADD CONSTRAINT `SumdanAgentFronting_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumdanAgentFronting` ADD CONSTRAINT `SumdanAgentFronting_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `AgentFronting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
