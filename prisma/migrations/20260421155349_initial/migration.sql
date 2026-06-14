-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `permission` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sumdan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `logo` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `tbo` INTEGER NOT NULL DEFAULT 3,
    `rounded` INTEGER NOT NULL DEFAULT 1000,
    `rounded_sumdan` INTEGER NOT NULL DEFAULT 1,
    `limit` BIGINT NOT NULL DEFAULT 0,
    `c_margin` DOUBLE NOT NULL,
    `c_adm` DOUBLE NOT NULL,
    `c_gov` INTEGER NOT NULL,
    `c_stamps` INTEGER NOT NULL,
    `c_account` INTEGER NOT NULL,
    `c_information` INTEGER NOT NULL,
    `c_provisi` INTEGER NOT NULL DEFAULT 0,
    `dsr` DOUBLE NOT NULL,
    `sk_no` VARCHAR(191) NULL,
    `sk_date` DATETIME(3) NULL,
    `pic1` VARCHAR(191) NULL,
    `pic2` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cabang` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `areaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `target` INTEGER NOT NULL DEFAULT 0,
    `position` VARCHAR(191) NULL,
    `pkwt_status` VARCHAR(191) NULL,
    `start_pkwt` DATETIME(3) NULL,
    `end_pkwt` DATETIME(3) NULL,
    `nik` VARCHAR(191) NULL,
    `salary` INTEGER NOT NULL DEFAULT 0,
    `t_transport` INTEGER NOT NULL DEFAULT 0,
    `t_position` INTEGER NOT NULL DEFAULT 0,
    `ptkp` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `roleId` VARCHAR(191) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `sumdanId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProdukPembiayaan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `c_margin` DOUBLE NOT NULL,
    `c_adm` DOUBLE NOT NULL,
    `c_insurance` DOUBLE NOT NULL,
    `max_tenor` INTEGER NOT NULL,
    `max_plafond` INTEGER NOT NULL,
    `min_age` INTEGER NOT NULL,
    `max_age` INTEGER NOT NULL,
    `max_paid` INTEGER NOT NULL,
    `margin_type` ENUM('FLAT', 'ANUITAS') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sumdanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisPembiayaan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `c_blokir` INTEGER NOT NULL,
    `c_mutasi` INTEGER NOT NULL DEFAULT 0,
    `status_takeover` BOOLEAN NOT NULL DEFAULT false,
    `status_mutasi` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Debitur` (
    `nopen` VARCHAR(191) NOT NULL,
    `salary` INTEGER NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `birthplace` VARCHAR(191) NULL,
    `religion` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `pos_code` VARCHAR(191) NULL,
    `npwp` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `education` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `no_skep` VARCHAR(191) NULL,
    `name_skep` VARCHAR(191) NULL,
    `date_skep` DATETIME(3) NULL,
    `tmt_skep` DATETIME(3) NULL,
    `rank_skep` VARCHAR(191) NULL,
    `publisher_skep` VARCHAR(191) NULL,
    `group_skep` VARCHAR(191) NULL,
    `soul_code` INTEGER NULL,
    `job_year` INTEGER NULL,
    `pay_office` VARCHAR(191) NULL,
    `start_flagging` VARCHAR(191) NULL,
    `end_flagging` VARCHAR(191) NULL,
    `mother_name` VARCHAR(191) NULL,
    `account_name` VARCHAR(191) NULL,
    `account_number` VARCHAR(191) NULL,

    UNIQUE INDEX `Debitur_nopen_key`(`nopen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dapem` (
    `id` VARCHAR(191) NOT NULL,
    `tenor` INTEGER NOT NULL,
    `plafond` INTEGER NOT NULL,
    `c_margin` DOUBLE NOT NULL,
    `c_margin_sumdan` DOUBLE NOT NULL,
    `c_adm` DOUBLE NOT NULL,
    `c_adm_sumdan` DOUBLE NOT NULL,
    `c_insurance` DOUBLE NOT NULL,
    `c_gov` INTEGER NOT NULL,
    `c_stamp` INTEGER NOT NULL,
    `c_account` INTEGER NOT NULL,
    `c_mutasi` INTEGER NOT NULL,
    `c_blokir` INTEGER NOT NULL,
    `c_retensi` INTEGER NOT NULL,
    `c_takeover` INTEGER NOT NULL,
    `c_bpp` INTEGER NOT NULL,
    `c_provisi` DOUBLE NOT NULL DEFAULT 0,
    `c_infomation` INTEGER NOT NULL,
    `tbo` INTEGER NOT NULL,
    `rounded` INTEGER NOT NULL,
    `rounded_sumdan` INTEGER NOT NULL DEFAULT 0,
    `margin_type` ENUM('FLAT', 'ANUITAS') NOT NULL,
    `insurance_type` VARCHAR(191) NULL,
    `takeover_from` VARCHAR(191) NULL,
    `takeover_date` DATETIME(3) NULL,
    `mutasi_from` VARCHAR(191) NULL,
    `mutasi_to` VARCHAR(191) NULL,
    `dom_status` BOOLEAN NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NULL,
    `pos_code` VARCHAR(191) NULL,
    `geolocation` VARCHAR(191) NULL,
    `house_status` VARCHAR(191) NULL,
    `house_year` VARCHAR(191) NULL,
    `job` VARCHAR(191) NULL,
    `job_address` VARCHAR(191) NULL,
    `business` VARCHAR(191) NULL,
    `marriage_status` ENUM('KAWIN', 'BELUM_KAWIN', 'JANDA', 'DUDA') NOT NULL DEFAULT 'BELUM_KAWIN',
    `aw_name` VARCHAR(191) NULL,
    `aw_nik` VARCHAR(191) NULL,
    `aw_birthdate` DATETIME(3) NULL,
    `aw_birthplace` VARCHAR(191) NULL,
    `aw_job` VARCHAR(191) NULL,
    `aw_address` VARCHAR(191) NULL,
    `aw_relate` VARCHAR(191) NULL,
    `aw_phone` VARCHAR(191) NULL,
    `f_name` VARCHAR(191) NULL,
    `f_relate` VARCHAR(191) NULL,
    `f_phone` VARCHAR(191) NULL,
    `f_address` VARCHAR(191) NULL,
    `dropping_status` ENUM('DRAFT', 'CANCEL', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'PAID_OFF') NOT NULL DEFAULT 'DRAFT',
    `verif_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NULL,
    `verif_desc` TEXT NULL,
    `slik_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NULL,
    `slik_desc` TEXT NULL,
    `approv_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NULL,
    `approv_desc` TEXT NULL,
    `takeover_status` ENUM('DRAFT', 'CANCEL', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'PAID_OFF') NOT NULL DEFAULT 'DRAFT',
    `takeover_desc` TEXT NULL,
    `takeover_date_exc` DATETIME(3) NULL,
    `mutasi_status` ENUM('DRAFT', 'CANCEL', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'PAID_OFF') NOT NULL DEFAULT 'DRAFT',
    `mutasi_desc` TEXT NULL,
    `mutasi_date_exc` DATETIME(3) NULL,
    `flagging_status` ENUM('DRAFT', 'CANCEL', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'PAID_OFF') NOT NULL DEFAULT 'DRAFT',
    `flagging_desc` TEXT NULL,
    `flagging_date_exc` DATETIME(3) NULL,
    `cash_status` ENUM('DRAFT', 'CANCEL', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'PAID_OFF') NOT NULL DEFAULT 'DRAFT',
    `cash_desc` TEXT NULL,
    `document_status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL DEFAULT 'UNIT',
    `document_desc` TEXT NULL,
    `guarantee_status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL DEFAULT 'UNIT',
    `guarantee_desc` TEXT NULL,
    `used_for` VARCHAR(191) NOT NULL,
    `no_contract` VARCHAR(191) NOT NULL,
    `date_contract` DATETIME(3) NULL,
    `file_slik` VARCHAR(191) NULL,
    `file_proses` VARCHAR(191) NULL,
    `file_submission` VARCHAR(191) NULL,
    `video_interview` VARCHAR(191) NULL,
    `video_insurance` VARCHAR(191) NULL,
    `file_contract` VARCHAR(191) NULL,
    `file_takeover` VARCHAR(191) NULL,
    `file_mutasi` VARCHAR(191) NULL,
    `file_flagging` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nopen` VARCHAR(191) NOT NULL,
    `produkPembiayaanId` VARCHAR(191) NOT NULL,
    `jenisPembiayaanId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `aoId` VARCHAR(191) NOT NULL,
    `droppingId` VARCHAR(191) NULL,
    `berkasId` VARCHAR(191) NULL,
    `jaminanId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dropping` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` TEXT NULL,
    `status` BOOLEAN NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Berkas` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` VARCHAR(191) NULL,
    `status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jaminan` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` VARCHAR(191) NULL,
    `status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pelunasan` (
    `id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `amount_sumdan` INTEGER NOT NULL,
    `desc_sumdan` TEXT NULL,
    `penalty` INTEGER NOT NULL,
    `desc` TEXT NULL,
    `file_sub` VARCHAR(191) NULL,
    `guarantee_status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL DEFAULT 'MITRA',
    `type` ENUM('MENINGGAL', 'TOPUP', 'LEPAS', 'JATUHTEMPO') NOT NULL,
    `status_paid` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `dapemId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pelunasan_dapemId_key`(`dapemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Angsuran` (
    `id` VARCHAR(191) NOT NULL,
    `counter` INTEGER NOT NULL,
    `principal` INTEGER NOT NULL,
    `margin` INTEGER NOT NULL,
    `date_pay` DATETIME(3) NOT NULL,
    `date_paid` DATETIME(3) NULL,
    `remaining` INTEGER NOT NULL,
    `inst_sumdan` INTEGER NOT NULL DEFAULT 0,
    `fee_banpot` INTEGER NOT NULL DEFAULT 0,
    `dapemId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryOfAccount` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('ASSET', 'KEWAJIBAN', 'MODAL', 'PENDAPATAN', 'BEBAN') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `parentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalEntry` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalDetail` (
    `id` VARCHAR(191) NOT NULL,
    `debit` INTEGER NOT NULL DEFAULT 0,
    `credit` INTEGER NOT NULL DEFAULT 0,
    `desciption` VARCHAR(191) NULL,
    `journalEntryId` VARCHAR(191) NOT NULL,
    `categoryOfAccountId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cabang` ADD CONSTRAINT `Cabang_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdukPembiayaan` ADD CONSTRAINT `ProdukPembiayaan_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_nopen_fkey` FOREIGN KEY (`nopen`) REFERENCES `Debitur`(`nopen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_produkPembiayaanId_fkey` FOREIGN KEY (`produkPembiayaanId`) REFERENCES `ProdukPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_jenisPembiayaanId_fkey` FOREIGN KEY (`jenisPembiayaanId`) REFERENCES `JenisPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_aoId_fkey` FOREIGN KEY (`aoId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_droppingId_fkey` FOREIGN KEY (`droppingId`) REFERENCES `Dropping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_berkasId_fkey` FOREIGN KEY (`berkasId`) REFERENCES `Berkas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_jaminanId_fkey` FOREIGN KEY (`jaminanId`) REFERENCES `Jaminan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dropping` ADD CONSTRAINT `Dropping_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berkas` ADD CONSTRAINT `Berkas_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jaminan` ADD CONSTRAINT `Jaminan_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pelunasan` ADD CONSTRAINT `Pelunasan_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `Dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Angsuran` ADD CONSTRAINT `Angsuran_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `Dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOfAccount` ADD CONSTRAINT `CategoryOfAccount_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `CategoryOfAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalDetail` ADD CONSTRAINT `JournalDetail_journalEntryId_fkey` FOREIGN KEY (`journalEntryId`) REFERENCES `JournalEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalDetail` ADD CONSTRAINT `JournalDetail_categoryOfAccountId_fkey` FOREIGN KEY (`categoryOfAccountId`) REFERENCES `CategoryOfAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalDetail` ADD CONSTRAINT `JournalDetail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
