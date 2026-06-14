/*
  Warnings:

  - You are about to drop the column `ptkp` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `t_position` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `t_transport` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `cabang` DROP FOREIGN KEY `Cabang_areaId_fkey`;

-- DropIndex
DROP INDEX `Cabang_areaId_fkey` ON `cabang`;

-- AlterTable
ALTER TABLE `dapem` ADD COLUMN `aoRelateId` VARCHAR(191) NULL,
    ADD COLUMN `ao_fee` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ao_fee_desc` TEXT NULL,
    ADD COLUMN `ao_fee_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `sumdan` MODIFY `rounded` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `ptkp`,
    DROP COLUMN `salary`,
    DROP COLUMN `t_position`,
    DROP COLUMN `t_transport`;

-- AddForeignKey
ALTER TABLE `Cabang` ADD CONSTRAINT `Cabang_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_aoRelateId_fkey` FOREIGN KEY (`aoRelateId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
