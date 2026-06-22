/*
  Warnings:

  - You are about to drop the column `c_provisi` on the `dapem` table. All the data in the column will be lost.
  - You are about to drop the column `end_flagging` on the `debitur` table. All the data in the column will be lost.
  - You are about to drop the column `start_flagging` on the `debitur` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dapem` DROP COLUMN `c_provisi`,
    ADD COLUMN `date_end` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `debitur` DROP COLUMN `end_flagging`,
    DROP COLUMN `start_flagging`;
