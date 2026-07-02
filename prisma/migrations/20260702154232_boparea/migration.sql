-- AlterTable
ALTER TABLE `dapem` ADD COLUMN `c_bop_area` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `sumdan` ADD COLUMN `c_bop_area` DOUBLE NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `Berkas_created_at_idx` ON `Berkas`(`created_at`);

-- CreateIndex
CREATE INDEX `Dropping_created_at_idx` ON `Dropping`(`created_at`);

-- CreateIndex
CREATE INDEX `Jaminan_created_at_idx` ON `Jaminan`(`created_at`);

-- CreateIndex
CREATE INDEX `Pelunasan_created_at_idx` ON `Pelunasan`(`created_at`);
