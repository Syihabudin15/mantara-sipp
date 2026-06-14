"use client";

import {
  GetAngsuran,
  GetDapem,
  GetRoman,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import moment from "moment";
import { ListKeyValue, ListUnorderMin, styles } from "./RendererUtils";

export const MAUKStandar = ({ data }: { data: IDapem }) => {
  const angs = GetAngsuran(
    data.plafond,
    data.tenor,
    data.c_margin + data.c_margin_sumdan,
    data.margin_type,
    data.rounded,
  ).angsuran;
  const angsSumdan = GetAngsuran(
    data.plafond,
    data.tenor,
    data.c_margin_sumdan,
    data.margin_type,
    data.rounded_sumdan,
  ).angsuran;

  const dapem = GetDapem(data);

  return (
    <PDFViewer className="w-full h-full">
      <Document
        title={`MAUK_${data.id}_${moment(data.created_at).format("DDMMYY")}`}
      >
        <Page size="A4" style={styles.page}>
          <View
            style={{
              ...styles.header,
              display: "flex",
              flexDirection: "row",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid black",
            }}
          >
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              style={{ width: 60 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ marginBottom: 5 }}>
                MEMORANDUM ANALISA DAN USULAN KREDIT
              </Text>
              <Text style={{ fontSize: 10 }}>
                {data.id}/MAUK/
                {data.ProdukPembiayaan.Sumdan.code
                  .replace("BPR", "")
                  .replace("BANK", "")
                  .replace(" ", "")}
                /{GetRoman(new Date(data.created_at).getMonth() + 1)}/
                {moment(data.created_at || new Date()).format("YYYY")}
              </Text>
            </View>
            <Image
              src={
                data.ProdukPembiayaan.Sumdan.logo ||
                process.env.NEXT_PUBLIC_APP_LOGO
              }
              style={{ width: 60 }}
            />
          </View>
          <View style={styles.section}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 10,
                marginBottom: 15,
              }}
            >
              DATA PEMOHON & AHLIWARIS
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 20,
                borderBottom: "1px solid #aaa",
              }}
            >
              <View style={{ flex: 1 }}>
                <ListKeyValue
                  data={[
                    { key: "Nama Pemohon", value: data.Debitur.fullname },
                    { key: "Nomor NIK", value: data.Debitur.nik },
                    {
                      key: "Tempat/Tanggal Lahir",
                      value: `${data.Debitur.birthplace}, ${moment(data.Debitur.birthdate).format("DD-MM-YYYY")}`,
                    },
                    {
                      key: "Pekerjaan",
                      value: data.job,
                    },
                    {
                      key: "Alamat",
                      value: `${data.Debitur.address}, KELURAHAN ${data.Debitur.ward} KECAMATAN ${data.Debitur.district}, ${data.Debitur.city} ${data.Debitur.province} ${data.Debitur.pos_code}`,
                    },
                  ]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ListKeyValue
                  data={[
                    { key: "Nama Ahliwaris", value: data.aw_name },
                    { key: "Nomor NIK", value: data.aw_nik },
                    {
                      key: "Tempat/Tanggal Lahir",
                      value: `${data.aw_birthplace}, ${moment(data.aw_birthdate).format("DD-MM-YYYY")}`,
                    },
                    {
                      key: "Pekerjaan",
                      value: data.aw_job,
                    },
                    {
                      key: "Alamat",
                      value: data.aw_address,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={{ marginTop: 5, borderBottom: "1px solid #aaa" }}>
              <Text
                style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}
              >
                DATA PENSIUN & JAMINAN
              </Text>
              <ListKeyValue
                data={[
                  { key: "Kelompok Pensiun", value: data.Debitur.group_skep },
                  { key: "Nama SKEP", value: data.Debitur.name_skep },
                  { key: "Nomor SKEP", value: data.Debitur.no_skep },
                  {
                    key: "Tanggal SKEP",
                    value: moment(data.Debitur.date_skep).format("DD-MM-YYYY"),
                  },
                  { key: "Penerbit SKEP", value: data.Debitur.publisher_skep },
                  { key: "Nomor Pensiun", value: data.nopen },
                ]}
              />
            </View>
            <View style={{ marginTop: 5 }}>
              <Text
                style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}
              >
                DATA PERMOHONAN PEMBIAYAAN
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 50,
                }}
              >
                <View style={{ flex: 1 }}>
                  <ListKeyValue
                    data={[
                      {
                        key: "Tanggal Permohonan",
                        value: moment(data.created_at).format("DD-MM-YYYY"),
                      },
                      {
                        key: "Jenis Pembiayaan",
                        value: data.JenisPembiayaan.name,
                      },
                      {
                        key: "Produk Pembiayaan",
                        value: data.ProdukPembiayaan.name,
                      },
                      {
                        key: "Plafond",
                        value: `${IDRFormat(data.plafond)}`,
                        currency: true,
                      },
                      {
                        key: "Jangka Waktu",
                        value: `${data.tenor} Bulan`,
                      },
                      {
                        key: "Bunga Koperasi",
                        value: `${data.c_margin.toFixed(2)}% /Tahun`,
                      },
                      {
                        key: "Bunga Mitra",
                        value: `${data.c_margin_sumdan.toFixed(2)}% /Tahun`,
                      },
                      {
                        key: "Total Bunga",
                        value: `${(data.c_margin_sumdan + data.c_margin).toFixed(2)}% /Tahun`,
                      },
                    ]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <ListKeyValue
                    rightvalue
                    data={[
                      {
                        key: "Gaji Pensiun",
                        value: `${IDRFormat(data.Debitur.salary)}`,
                        currency: true,
                      },
                      {
                        key: "Angsuran Mitra",
                        value: `${IDRFormat(angsSumdan)}`,
                        currency: true,
                      },
                      {
                        key: "Angsuran Koperasi",
                        value: `${IDRFormat(angs - angsSumdan)}`,
                        currency: true,
                      },
                      {
                        key: "Total Angsuran",
                        value: `${IDRFormat(angs)}`,
                        currency: true,
                      },
                      {
                        key: "Sisa Gaji",
                        value: `${IDRFormat(data.Debitur.salary - angs)}`,
                        currency: true,
                      },
                      {
                        key: "Debt Service Ratio",
                        value: `${((angs / data.Debitur.salary) * 100).toFixed(2)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text
                style={{ fontSize: 10, marginBottom: 5, fontWeight: "bold" }}
              >
                Rincian Pembiayaan :
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 50,
                  alignItems: "flex-end",
                }}
              >
                <View style={{ flex: 1 }}>
                  <ListKeyValue
                    rightvalue
                    data={[
                      {
                        key: "Biaya Adm Mitra",
                        value: IDRFormat(
                          data.plafond * (data.c_adm_sumdan / 100),
                        ),
                        currency: true,
                      },
                      {
                        key: "Biaya Adm Koperasi",
                        value: IDRFormat(data.plafond * (data.c_adm / 100)),
                        currency: true,
                      },
                      {
                        key: "Biaya Asuransi",
                        value: IDRFormat(
                          data.plafond * (data.c_insurance / 100),
                        ),
                        currency: true,
                      },
                      {
                        key: "Biaya Provisi Mitra",
                        value: IDRFormat(
                          data.plafond * (data.c_provisi_sumdan / 100),
                        ),
                        currency: true,
                      },
                      {
                        key: "Biaya Provisi Koperasi",
                        value: IDRFormat(data.plafond * (data.c_provisi / 100)),
                        currency: true,
                      },
                      {
                        key: "Biaya Tatalaksana",
                        value: IDRFormat(data.c_gov),
                        currency: true,
                      },
                      {
                        key: "Biaya Buka Rekening",
                        value: IDRFormat(data.c_account),
                        currency: true,
                      },

                      {
                        key: "Biaya Flagging",
                        value: IDRFormat(data.c_infomation),
                        currency: true,
                      },
                      {
                        key: "Biaya Materai",
                        value: IDRFormat(data.c_stamp),
                        currency: true,
                      },
                      {
                        key: "Biaya Mutasi",
                        value: IDRFormat(data.c_mutasi),
                        currency: true,
                      },
                      {
                        key: "TOTAL BIAYA",
                        value: IDRFormat(dapem.biaya),
                        currency: true,
                        style: {
                          fontWeight: "bold",
                          borderTop: "1px solid #aaa",
                          borderStyle: "dashed",
                        },
                      },
                    ]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <ListKeyValue
                    rightvalue
                    data={[
                      {
                        key: "Terima Kotor",
                        value: `${IDRFormat(data.plafond - dapem.biaya)}`,
                        currency: true,
                        style: {
                          borderBottom: "1px solid #aaa",
                          borderStyle: "dashed",
                        },
                      },
                      {
                        key: `Blokir Angsuran (${data.c_blokir}x)`,
                        value: IDRFormat(data.c_blokir * angsSumdan),
                        currency: true,
                      },
                      // {
                      //   key: `Retensi Angsuran (${data.c_retensi}x)`,
                      //   value: IDRFormat(retensi),
                      //   currency: true,
                      // },
                      {
                        key: `Bpp`,
                        value: `${IDRFormat(data.c_bpp)}`,
                        currency: true,
                      },
                      {
                        key: "Nominal Takeover",
                        value: `${IDRFormat(data.c_takeover)}`,
                        style: {
                          borderBottom: "1px solid #aaa",
                          borderStyle: "dashed",
                        },
                        currency: true,
                      },
                      {
                        key: "TERIMA BERSIH",
                        value: `${IDRFormat(dapem.tb)}`,
                        style: { fontWeight: "bold" },
                        currency: true,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                gap: 20,
              }}
            >
              <View style={{ flex: 1, textAlign: "center" }}>
                <Text>Mengetahui</Text>
                <View style={{ height: 50 }}></View>
                <Text style={{ borderTop: "1px solid #aaa" }}>
                  Admin Kredit
                </Text>
              </View>
              <View style={{ flex: 1, textAlign: "center" }}>
                <Text>Mengetahui</Text>
                <View style={{ height: 50 }}></View>
                <Text style={{ borderTop: "1px solid #aaa" }}>
                  Analis Kredit
                </Text>
              </View>
              <View style={{ flex: 1, textAlign: "center" }}>
                <Text>Menyetujui</Text>
                <View style={{ height: 50 }}></View>
                <Text style={{ borderTop: "1px solid #aaa" }}>
                  Komite Kredit
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                fontStyle: "italic",
                display: "flex",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Text style={{ width: 50 }}>Note :</Text>
              <View style={{ flex: 1 }}>
                <ListUnorderMin
                  data={[
                    ...(data.JenisPembiayaan.status_takeover
                      ? [
                          {
                            value: `Instansi takeover ${data.takeover_from} dengan estimasi pelaksanaan tanggal ${moment(data.takeover_date).format("DD MMMM YYYY")}`,
                          },
                        ]
                      : []),
                    ...(data.JenisPembiayaan.status_mutasi
                      ? [
                          {
                            value: `Akan dilakukan mutasi kantor bayar gaji pensiun dari ${data.mutasi_from} ke ${data.mutasi_to}`,
                          },
                        ]
                      : []),
                  ]}
                />
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
