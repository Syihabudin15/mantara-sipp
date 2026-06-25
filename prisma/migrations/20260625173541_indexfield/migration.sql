-- AlterTable
ALTER TABLE `sumdan` MODIFY `file` TEXT NULL;

-- CreateTable
CREATE TABLE `AppConfig` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `legal_address` VARCHAR(191) NULL,
    `ops_address` VARCHAR(191) NULL,
    `pk_ttd_name` VARCHAR(191) NULL,
    `pk_ttd_position` VARCHAR(191) NULL,
    `si_ttd_name` VARCHAR(191) NULL,
    `si_ttd_position` VARCHAR(191) NULL,
    `sd_ttd_name` VARCHAR(191) NULL,
    `sd_ttd_position` VARCHAR(191) NULL,
    `sg_ttd_name` VARCHAR(191) NULL,
    `sg_ttd_position` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AgentFronting_name_idx` ON `AgentFronting`(`name`);

-- CreateIndex
CREATE INDEX `AgentFronting_code_idx` ON `AgentFronting`(`code`);

-- CreateIndex
CREATE INDEX `Angsuran_date_pay_idx` ON `Angsuran`(`date_pay`);

-- CreateIndex
CREATE INDEX `Area_name_idx` ON `Area`(`name`);

-- CreateIndex
CREATE INDEX `Berkas_process_at_idx` ON `Berkas`(`process_at`);

-- CreateIndex
CREATE INDEX `Berkas_status_idx` ON `Berkas`(`status`);

-- CreateIndex
CREATE INDEX `Cabang_name_idx` ON `Cabang`(`name`);

-- CreateIndex
CREATE INDEX `CategoryOfAccount_name_idx` ON `CategoryOfAccount`(`name`);

-- CreateIndex
CREATE INDEX `CategoryOfAccount_type_idx` ON `CategoryOfAccount`(`type`);

-- CreateIndex
CREATE INDEX `Dapem_dropping_status_idx` ON `Dapem`(`dropping_status`);

-- CreateIndex
CREATE INDEX `Dapem_document_status_idx` ON `Dapem`(`document_status`);

-- CreateIndex
CREATE INDEX `Dapem_guarantee_status_idx` ON `Dapem`(`guarantee_status`);

-- CreateIndex
CREATE INDEX `Dapem_slik_status_idx` ON `Dapem`(`slik_status`);

-- CreateIndex
CREATE INDEX `Dapem_verif_status_idx` ON `Dapem`(`verif_status`);

-- CreateIndex
CREATE INDEX `Dapem_approv_status_idx` ON `Dapem`(`approv_status`);

-- CreateIndex
CREATE INDEX `Dapem_created_at_idx` ON `Dapem`(`created_at`);

-- CreateIndex
CREATE INDEX `Dapem_takeover_date_idx` ON `Dapem`(`takeover_date`);

-- CreateIndex
CREATE INDEX `Dapem_takeover_status_idx` ON `Dapem`(`takeover_status`);

-- CreateIndex
CREATE INDEX `Dapem_mutasi_status_idx` ON `Dapem`(`mutasi_status`);

-- CreateIndex
CREATE INDEX `Dapem_flagging_status_idx` ON `Dapem`(`flagging_status`);

-- CreateIndex
CREATE INDEX `Dapem_cash_status_idx` ON `Dapem`(`cash_status`);

-- CreateIndex
CREATE INDEX `Dapem_tbo_date_idx` ON `Dapem`(`tbo_date`);

-- CreateIndex
CREATE INDEX `Dapem_no_contract_idx` ON `Dapem`(`no_contract`);

-- CreateIndex
CREATE INDEX `Dapem_date_contract_idx` ON `Dapem`(`date_contract`);

-- CreateIndex
CREATE INDEX `Dapem_date_end_idx` ON `Dapem`(`date_end`);

-- CreateIndex
CREATE INDEX `Debitur_fullname_idx` ON `Debitur`(`fullname`);

-- CreateIndex
CREATE INDEX `Debitur_nik_idx` ON `Debitur`(`nik`);

-- CreateIndex
CREATE INDEX `Debitur_name_skep_idx` ON `Debitur`(`name_skep`);

-- CreateIndex
CREATE INDEX `Debitur_no_skep_idx` ON `Debitur`(`no_skep`);

-- CreateIndex
CREATE INDEX `Debitur_account_number_idx` ON `Debitur`(`account_number`);

-- CreateIndex
CREATE INDEX `Debitur_province_idx` ON `Debitur`(`province`);

-- CreateIndex
CREATE INDEX `Debitur_city_idx` ON `Debitur`(`city`);

-- CreateIndex
CREATE INDEX `Debitur_district_idx` ON `Debitur`(`district`);

-- CreateIndex
CREATE INDEX `Debitur_ward_idx` ON `Debitur`(`ward`);

-- CreateIndex
CREATE INDEX `Dropping_process_at_idx` ON `Dropping`(`process_at`);

-- CreateIndex
CREATE INDEX `Dropping_status_idx` ON `Dropping`(`status`);

-- CreateIndex
CREATE INDEX `Insurance_name_idx` ON `Insurance`(`name`);

-- CreateIndex
CREATE INDEX `Insurance_code_idx` ON `Insurance`(`code`);

-- CreateIndex
CREATE INDEX `Jaminan_process_at_idx` ON `Jaminan`(`process_at`);

-- CreateIndex
CREATE INDEX `Jaminan_status_idx` ON `Jaminan`(`status`);

-- CreateIndex
CREATE INDEX `JenisPembiayaan_name_idx` ON `JenisPembiayaan`(`name`);

-- CreateIndex
CREATE INDEX `JournalEntry_date_idx` ON `JournalEntry`(`date`);

-- CreateIndex
CREATE INDEX `PayOffice_name_idx` ON `PayOffice`(`name`);

-- CreateIndex
CREATE INDEX `PayOffice_code_idx` ON `PayOffice`(`code`);

-- CreateIndex
CREATE INDEX `Pelunasan_type_idx` ON `Pelunasan`(`type`);

-- CreateIndex
CREATE INDEX `Pelunasan_guarantee_status_idx` ON `Pelunasan`(`guarantee_status`);

-- CreateIndex
CREATE INDEX `Pelunasan_status_paid_idx` ON `Pelunasan`(`status_paid`);

-- CreateIndex
CREATE INDEX `Pelunasan_process_at_idx` ON `Pelunasan`(`process_at`);

-- CreateIndex
CREATE INDEX `ProdukPembiayaan_name_idx` ON `ProdukPembiayaan`(`name`);

-- CreateIndex
CREATE INDEX `Role_name_idx` ON `Role`(`name`);

-- CreateIndex
CREATE INDEX `Role_data_status_idx` ON `Role`(`data_status`);

-- CreateIndex
CREATE INDEX `Sumdan_name_idx` ON `Sumdan`(`name`);

-- CreateIndex
CREATE INDEX `Sumdan_code_idx` ON `Sumdan`(`code`);

-- CreateIndex
CREATE INDEX `User_nip_idx` ON `User`(`nip`);

-- CreateIndex
CREATE INDEX `User_fullname_idx` ON `User`(`fullname`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_phone_idx` ON `User`(`phone`);

-- CreateIndex
CREATE INDEX `User_end_pkwt_idx` ON `User`(`end_pkwt`);

-- CreateIndex
CREATE INDEX `User_pkwt_status_idx` ON `User`(`pkwt_status`);
