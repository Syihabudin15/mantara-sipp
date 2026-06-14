/*
  Warnings:

  - You are about to drop the column `insurance_type` on the `dapem` table. All the data in the column will be lost.
  - You are about to drop the column `mutasi_from` on the `dapem` table. All the data in the column will be lost.
  - You are about to drop the column `mutasi_to` on the `dapem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `dapem` DROP FOREIGN KEY `Dapem_aoId_fkey`;

-- DropIndex
DROP INDEX `Dapem_aoId_fkey` ON `dapem`;

-- AlterTable
ALTER TABLE `dapem` DROP COLUMN `insurance_type`,
    DROP COLUMN `mutasi_from`,
    DROP COLUMN `mutasi_to`,
    ADD COLUMN `insuranceId` VARCHAR(191) NULL,
    ADD COLUMN `payOfficeId` VARCHAR(191) NULL,
    MODIFY `aoId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PayOffice` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `file` VARCHAR(191) NULL,
    `up` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Insurance` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `file` VARCHAR(191) NULL,
    `up` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_aoId_fkey` FOREIGN KEY (`aoId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `PayOffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_insuranceId_fkey` FOREIGN KEY (`insuranceId`) REFERENCES `Insurance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
