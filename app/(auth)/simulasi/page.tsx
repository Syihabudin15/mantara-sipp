"use client";

import { FormInput } from "@/components";
import {
  GetAngsuran,
  GetDapem,
  GetFullAge,
  GetMaxPlafond,
  GetMaxTenor,
  IDRFormat,
  IDRToNumber,
} from "@/components/utils/PembiayaanUtil";
import { IDapem, IDebitur, ISumdan } from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  HistoryOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Debitur,
  JenisPembiayaan,
  ProdukPembiayaan,
  Sumdan,
} from "@prisma/client";
import {
  App,
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  Modal,
  Select,
} from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

export default function Page() {
  const [data, setData] = useState<IDapemSimulasi>(defaultData);
  const [jenis, setJenis] = useState<JenisPembiayaan[]>([]);
  const [sumdan, setSumdan] = useState<ISumdan[]>([]);
  const [sumdanAv, setSumdanAv] = useState<ISumdan[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { hasAccess } = useAccess(window.location.pathname);
  const { message } = App.useApp();

  useEffect(() => {
    const { year, month } = GetFullAge(data.Debitur.birthdate, data.created_at);
    const newAv = sumdan.map((s) => {
      const prod = s.ProdukPembiayaans.filter(
        (p) => year >= p.min_age && year < p.max_age,
      );
      return { ...s, ProdukPembiayaans: prod };
    });
    setSumdanAv(newAv);
    if (
      data.produkPembiayaanId &&
      newAv.flatMap((a) => a.ProdukPembiayaans).length === 0
    ) {
      message.error("Produk tidak tersedia!");
      setData({
        ...defaultData,
        Debitur: {
          birthdate: data.Debitur.birthdate,
          salary: data.Debitur.salary,
        } as IDebitur,
        created_at: data.created_at,
      });
      return;
    }
    const maxTenn = GetMaxTenor(data.ProdukPembiayaan.max_paid, year, month);
    const maxTen =
      parseInt(String(maxTenn)) > data.ProdukPembiayaan.max_tenor
        ? data.ProdukPembiayaan.max_tenor
        : parseInt(String(maxTenn));
    const maxPlaff = parseInt(
      String(
        GetMaxPlafond(
          data.c_margin + data.c_margin_sumdan,
          data.tenor,
          (data.Debitur.salary * data.Sumdan.dsr) / 100,
        ),
      ),
    );

    const maxPlaf =
      maxPlaff > data.ProdukPembiayaan.max_plafond
        ? data.ProdukPembiayaan.max_plafond
        : maxPlaff;
    const angs = GetAngsuran(
      data.plafond,
      data.tenor,
      data.c_margin + data.c_margin_sumdan,
      data.margin_type,
      data.Sumdan.rounded,
      data.c_ned,
    ).angsuran;
    if (angs > data.Debitur.salary * (data.Sumdan.dsr / 100)) {
      message.error(
        "Angsuran lebih dari 95%, mohon sesuaikan kembali pembiayaan!",
      );
      setData((prev) => ({ ...prev, tenor: 0, plafond: 0 }));
      return;
    }
    setData((prev) => ({
      ...prev,
      max_tenor: maxTen,
      max_plafond: maxPlaf,
      angsuran: angs,
      tenor: prev.tenor > maxTen ? maxTen : prev.tenor,
      plafon: prev.plafond > maxPlaf ? maxPlaf : prev.plafond,
    }));
  }, [
    data.created_at,
    data.plafond,
    data.tenor,
    data.Debitur.birthdate,
    data.Debitur.salary,
    data.c_margin,
    data.margin_type,
    data.ProdukPembiayaan,
  ]);

  const handleSearch = async () => {
    setLoading(true);
    await fetch("/api/debitur?nopen=" + data.nopen, { method: "PATCH" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setData({
            ...data,
            Debitur: { ...data.Debitur, ...res.data },
          });
        }
      });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([
        fetch("/api/jenis?limit=100")
          .then((res) => res.json())
          .then((res) => setJenis(res.data)),
        fetch("/api/sumdan?limit=1000")
          .then((res) => res.json())
          .then((res) => setSumdan(res.data)),
      ]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row">
      <Card
        loading={loading}
        style={{ flex: 1 }}
        styles={{
          title: { margin: 0, padding: 0 },
          body: { margin: 12, padding: 0 },
        }}
      >
        <FormInput
          data={{
            label: "Tanggal Simulasi",
            type: "date",
            mode: "vertical",
            class: "flex-1",
            disabled: !hasAccess("proses"),
            value: moment(data.created_at).format("YYYY-MM-DD"),
            onChange: (e: string) =>
              setData({ ...data, created_at: new Date(e) }),
          }}
        />
        <div className="flex gap-2 flex-wrap">
          <FormInput
            data={{
              label: "Nomor Pensiun",
              type: "text",
              mode: "vertical",
              class: "flex-1",
              value: data.nopen,
              onChange: (e: string) => setData({ ...data, nopen: e }),
              suffix: (
                <Button
                  size="small"
                  type="primary"
                  icon={<SearchOutlined />}
                  loading={loading}
                  onClick={() => handleSearch()}
                ></Button>
              ),
            }}
          />
          <FormInput
            data={{
              label: "Nama Lengkap",
              type: "text",
              mode: "vertical",
              class: "flex-1",
              value: data.Debitur.fullname,
              onChange: (e: string) =>
                setData({ ...data, Debitur: { ...data.Debitur, fullname: e } }),
            }}
          />
          <FormInput
            data={{
              label: "Tanggal Lahir",
              type: "date",
              mode: "vertical",
              class: "flex-1",
              value: moment(data.Debitur.birthdate).format("YYYY-MM-DD"),
              onChange: (e: string) =>
                setData({
                  ...data,
                  Debitur: { ...data.Debitur, birthdate: new Date(e) },
                }),
            }}
          />
          {data.Debitur.birthdate &&
            (() => {
              const { year, month, day } = GetFullAge(
                data.Debitur.birthdate,
                data.created_at,
              );
              return (
                <div className="w-full">
                  <p>Usia Pemohon</p>
                  <div className="flex gap-2">
                    <Input
                      disabled
                      style={{ color: "black" }}
                      value={year}
                      suffix={
                        <span className="text-xs italic opacity-70">Thn</span>
                      }
                    />
                    <Input
                      disabled
                      style={{ color: "black" }}
                      value={month}
                      suffix={
                        <span className="text-xs italic opacity-70">Bln</span>
                      }
                    />
                    <Input
                      disabled
                      style={{ color: "black" }}
                      value={day}
                      suffix={
                        <span className="text-xs italic opacity-70">Hr</span>
                      }
                    />
                  </div>
                </div>
              );
            })()}
          <FormInput
            data={{
              label: "Gaji Pensiun",
              type: "text",
              mode: "vertical",
              class: "flex-1",
              value: IDRFormat(data.Debitur.salary),
              onChange: (e: string) =>
                setData({
                  ...data,
                  Debitur: { ...data.Debitur, salary: IDRToNumber(e || "0") },
                }),
            }}
          />
          <FormInput
            data={{
              label: "Jenis Pembiayaan",
              type: "select",
              mode: "vertical",
              class: "flex-1",
              options: jenis.map((j) => ({ label: j.name, value: j.id })),
              value: data.jenisPembiayaanId,
              onChange: (e: string) => {
                const find = jenis.find((f) => f.id === e);
                if (find) {
                  setData({
                    ...data,
                    JenisPembiayaan: find,
                    c_mutasi: find.c_mutasi,
                    c_blokir: find.c_blokir,
                    jenisPembiayaanId: find.id,
                  });
                }
              },
            }}
          />
          <div className="w-full">
            <p>Produk Pembiayaan</p>
            <Select
              className="w-full"
              options={sumdanAv.map((j) => ({
                label: j.name,
                options: j.ProdukPembiayaans.map((p) => ({
                  label: `${p.name}`,
                  value: p.id,
                })),
              }))}
              value={data.produkPembiayaanId}
              onChange={(e: string) => {
                const find = sumdan
                  .flatMap((s) => s.ProdukPembiayaans)
                  .find((f) => f.id === e);
                if (find) {
                  const findSumdan = sumdan.find((s) => s.id === find.sumdanId);
                  if (findSumdan) {
                    setData({
                      ...data,
                      Sumdan: findSumdan as Sumdan,
                      ProdukPembiayaan: find,
                      produkPembiayaanId: find.id,
                      c_margin_sumdan: findSumdan.c_margin,
                      c_margin: find.c_margin,
                      c_adm_sumdan: findSumdan.c_adm_sumdan,
                      c_adm: findSumdan.c_adm,
                      c_adm_mitra: findSumdan.c_adm_mitra,
                      c_adm_ff: findSumdan.c_adm_ff,
                      c_provisi_sumdan: findSumdan.c_provisi_sumdan,
                      c_fee_ao: findSumdan.c_fee_ao,
                      c_fee_cabang: findSumdan.c_fee_cabang,
                      c_fee_area: findSumdan.c_fee_area,
                      c_fee_bpp: findSumdan.c_fee_bpp,
                      c_fee_bpb: findSumdan.c_fee_bpb,
                      c_account: findSumdan.c_account,
                      c_account_sumdan: findSumdan.c_account_sumdan,
                      c_gov: findSumdan.c_gov,
                      c_stamp: findSumdan.c_stamps,
                      c_flagging: findSumdan.c_flagging,
                      c_infomation: findSumdan.c_information,
                      c_insurance: find.c_insurance,
                      rounded: findSumdan.rounded,
                      c_ned: findSumdan.c_ned,
                    });
                  }
                }
              }}
              allowClear
            />
          </div>
          <FormInput
            data={{
              label: "Margin",
              type: "number",
              mode: "vertical",
              class: "flex-1",
              value: data.c_margin + data.c_margin_sumdan,
              disabled: !hasAccess("proses"),
              // onChange: (e: string) =>
              //   setData({ ...data, c_margin: Number(e) }),
            }}
          />
          <div className="w-full bg-gray-800 text-gray-50 p-2 rounded">
            Rekomendasi Pembiayaan
          </div>
          <div className="flex gap-2 ">
            <FormInput
              data={{
                label: "Tenor",
                type: "number",
                mode: "vertical",
                class: "flex-1",
                value: data.tenor,
                onChange: (e: string) => setData({ ...data, tenor: Number(e) }),
              }}
            />
            <FormInput
              data={{
                label: "Max Tenor",
                type: "number",
                mode: "vertical",
                class: "flex-1",
                disabled: true,
                value: data.max_tenor,
              }}
            />
          </div>
          <div className="flex gap-2">
            <FormInput
              data={{
                label: "Plafond",
                type: "text",
                mode: "vertical",
                class: "flex-1",
                value: IDRFormat(data.plafond || 0),
                onChange: (e: string) =>
                  setData({ ...data, plafond: IDRToNumber(e || "0") }),
              }}
            />
            <FormInput
              data={{
                label: "Max Plafond",
                type: "text",
                mode: "vertical",
                class: "flex-1",
                disabled: true,
                value: IDRFormat(data.max_plafond || 0),
              }}
            />
          </div>
          <div className="flex  gap-2">
            <FormInput
              data={{
                label: "Angsuran",
                type: "text",
                mode: "vertical",
                class: "flex-1",
                disabled: true,
                value: IDRFormat(data.angsuran || 0),
              }}
            />
            <FormInput
              data={{
                label: "Max Angsuran",
                type: "text",
                mode: "vertical",
                class: "flex-1",
                disabled: true,
                value: IDRFormat(
                  (data.Debitur.salary * data.Sumdan.dsr) / 100 || 0,
                ),
                onChange: (e: string) =>
                  setData({
                    ...data,
                    Debitur: { ...data.Debitur, salary: IDRToNumber(e || "0") },
                  }),
              }}
            />
          </div>
        </div>
      </Card>
      <Card
        loading={loading}
        style={{ flex: 1 }}
        styles={{
          title: { margin: 0, padding: 0 },
          body: { margin: 12, padding: 0 },
        }}
      >
        <div className="w-full bg-red-500 text-gray-50 p-2 rounded mb-1">
          Rincian Biaya
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Administrasi</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              style={{ width: 80 }}
              // disabled={!hasAccess("proses")}
              disabled
              suffix={<span className="text-xs italic opacity-70">%</span>}
              value={
                data.c_adm_sumdan +
                data.c_adm +
                data.c_adm_mitra +
                data.c_adm_ff
              }
              // onChange={(e) =>
              //   setData({ ...data, c_adm: Number(e.target.value || "0") })
              // }
              type={"number"}
            />
            <Input
              size="small"
              disabled
              value={IDRFormat(
                (data.plafond *
                  (data.c_adm_sumdan +
                    data.c_adm +
                    data.c_adm_mitra +
                    data.c_adm_ff)) /
                  100 || 0,
              )}
              style={{ textAlign: "right", color: "black" }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Asuransi</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              style={{ width: 80 }}
              disabled={!hasAccess("proses")}
              suffix={<span className="text-xs italic opacity-70">%</span>}
              value={data.c_insurance}
              onChange={(e) =>
                setData({
                  ...data,
                  c_insurance: Number(e.target.value || "0"),
                })
              }
              type={"number"}
            />
            <Input
              size="small"
              disabled
              value={IDRFormat((data.plafond * data.c_insurance) / 100 || 0)}
              style={{ textAlign: "right", color: "black" }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Provisi</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              style={{ width: 80 }}
              // disabled={!hasAccess("proses")}
              disabled
              suffix={<span className="text-xs italic opacity-70">%</span>}
              value={
                data.c_provisi_sumdan +
                data.c_fee_ao +
                data.c_fee_cabang +
                data.c_fee_area +
                data.c_fee_bpp +
                data.c_fee_bpb
              }
              // onChange={(e) =>
              //   setData({ ...data, c_provisi: Number(e.target.value || "0") })
              // }
              type={"number"}
            />
            <Input
              size="small"
              disabled
              value={IDRFormat(
                (data.plafond *
                  (data.c_provisi_sumdan +
                    data.c_fee_ao +
                    data.c_fee_cabang +
                    data.c_fee_area +
                    data.c_fee_bpp +
                    data.c_fee_bpb)) /
                  100 || 0,
              )}
              style={{ textAlign: "right", color: "black" }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Tatalaksana</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              disabled={!hasAccess("proses")}
              value={IDRFormat(data.c_gov)}
              style={{ textAlign: "right", color: "black" }}
              onChange={(e) =>
                setData({ ...data, c_gov: IDRToNumber(e.target.value || "0") })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Buka Rekening</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              // disabled={!hasAccess}
              disabled
              value={IDRFormat(data.c_account + data.c_account_sumdan)}
              style={{ textAlign: "right", color: "black" }}
              // onChange={(e) =>
              //   setData({
              //     ...data,
              //     c_account: IDRToNumber(e.target.value || "0"),
              //   })
              // }
            />
          </div>
        </div>

        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Flagging</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              disabled={!hasAccess("proses")}
              value={IDRFormat(data.c_flagging)}
              style={{ textAlign: "right", color: "black" }}
              onChange={(e) =>
                setData({
                  ...data,
                  c_flagging: IDRToNumber(e.target.value || "0"),
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Informasi</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              disabled={!hasAccess("proses")}
              value={IDRFormat(data.c_infomation)}
              style={{ textAlign: "right", color: "black" }}
              onChange={(e) =>
                setData({
                  ...data,
                  c_infomation: IDRToNumber(e.target.value || "0"),
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Materai</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              disabled={!hasAccess("proses")}
              value={IDRFormat(data.c_stamp)}
              style={{ textAlign: "right", color: "black" }}
              onChange={(e) =>
                setData({
                  ...data,
                  c_stamp: IDRToNumber(e.target.value || "0"),
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Biaya Mutasi</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              disabled={!hasAccess("proses")}
              value={IDRFormat(data.c_mutasi)}
              style={{ textAlign: "right", color: "black" }}
              onChange={(e) =>
                setData({
                  ...data,
                  c_mutasi: IDRToNumber(e.target.value || "0"),
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 font-bold text-red-500 border-t mt-2">
          <div className="flex-1">Total Biaya</div>
          <div className="text-right">
            {IDRFormat(GetDapem(data as unknown as IDapem).biaya || 0)}
          </div>
        </div>
        <div className="w-full bg-blue-800 text-gray-50 p-2 rounded mb-1">
          Rincian Pembiayaan
        </div>
        <div className="flex gap-2 justify-between items-center my-1 font-bold text-blue-500 border-b border-dashed">
          <div className="flex-1">Terima Kotor</div>
          <div className="text-right">
            {IDRFormat(
              data.plafond - GetDapem(data as unknown as IDapem).biaya || 0,
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">BOP Pembiayaan</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              value={IDRFormat(data.c_bop)}
              style={{ textAlign: "right", color: "black" }}
              disabled={!hasAccess("proses")}
              onChange={(e) =>
                setData({
                  ...data,
                  c_bop:
                    IDRToNumber(e.target.value || "0") > data.Sumdan.max_bop
                      ? data.Sumdan.max_bop
                      : IDRToNumber(e.target.value || "0"),
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 text-red-500 border-b border-dashed">
          <div className="flex-1">Nominal Takeover</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              value={IDRFormat(data.c_takeover)}
              style={{ textAlign: "right", color: "black" }}
              onChange={(e) =>
                setData({
                  ...data,
                  c_takeover: IDRToNumber(e.target.value || "0"),
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Blokir Angsuran</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              style={{ width: 80 }}
              suffix={<span className="text-xs italic opacity-70">x</span>}
              value={data.c_blokir}
              onChange={(e) =>
                setData({
                  ...data,
                  c_blokir: IDRToNumber(e.target.value || "0"),
                })
              }
              type={"number"}
            />
            <Input
              size="small"
              disabled
              value={IDRFormat(data.c_blokir * data.angsuran || 0)}
              style={{ textAlign: "right", color: "black" }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 font-bold text-green-500 border-t mt-2">
          <div className="flex-1">Terima Bersih</div>
          <div className="text-right">
            {IDRFormat(GetDapem(data as unknown as IDapem).tb || 0)}
          </div>
        </div>
        <Divider style={{ marginBottom: 5 }}>Informasi Tambahan</Divider>
        <div className="italic">
          <div className="flex justify-between border-b border-dashed">
            <div>Sisa Gaji</div>
            <div>{IDRFormat(data.Debitur.salary - data.angsuran)}</div>
          </div>
          <div className="flex justify-between border-b border-dashed">
            <div>Debt Service Ratio</div>
            <div>
              {((data.angsuran / data.Debitur.salary) * 100 || 0).toFixed(2)} %
              / {data.Sumdan.dsr} %
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-between">
          <Button
            danger
            icon={<HistoryOutlined />}
            onClick={() => setData(defaultData)}
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => setOpen(true)}
          >
            Cetak
          </Button>
        </div>
      </Card>
      <ModalDetailPembiayaan data={data} setOpen={setOpen} open={open} />
    </div>
  );
}

const ModalDetailPembiayaan = ({
  data,
  open,
  setOpen,
}: {
  data: IDapemSimulasi;
  open: boolean;
  setOpen: Function;
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (printRef.current === null) return;

    try {
      const dataUrl = await toPng(printRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `Analisa-${data.Debitur.fullname || "Pembiayaan"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mendownload gambar", err);
    }
  };
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={[]}
      width={1100}
      style={{ top: 10 }}
    >
      <div ref={printRef} style={{ padding: "10px", backgroundColor: "#fff" }}>
        <p className="font-bold text-lg mb-1">PERHITUNGAN PEMBIAYAAN</p>
        <div className="flex gap-2 flex-col sm:flex-row justify-between">
          <div className="flex-1">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item
                label="Tanggal Simulasi"
                style={{ padding: 5 }}
              >
                {moment(data.created_at).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Nomor Pensiun" style={{ padding: 5 }}>
                {data.nopen}
              </Descriptions.Item>
              <Descriptions.Item label="Nama Lengkap" style={{ padding: 5 }}>
                {data.Debitur.fullname}
              </Descriptions.Item>
              <Descriptions.Item label="Gaji Pensiun" style={{ padding: 5 }}>
                {IDRFormat(data.Debitur.salary)}
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal Lahir" style={{ padding: 5 }}>
                {moment(data.Debitur.birthdate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Usia Pemohon" style={{ padding: 5 }}>
                {(() => {
                  const { year, month, day } = GetFullAge(
                    data.Debitur.birthdate,
                    data.created_at,
                  );
                  return `${year} Thn ${month} Bln ${day} Hr`;
                })()}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="flex-1">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item
                label="Jenis Pembiayaan"
                style={{ padding: 5 }}
              >
                {data.JenisPembiayaan.name}
              </Descriptions.Item>
              <Descriptions.Item
                label="Produk Pembiayaan"
                style={{ padding: 5 }}
              >
                {data.ProdukPembiayaan.name} ({data.Sumdan.code})
              </Descriptions.Item>
              <Descriptions.Item label="Margin" style={{ padding: 5 }}>
                {data.c_margin + data.c_margin_sumdan}%
              </Descriptions.Item>
              <Descriptions.Item label="Plafond" style={{ padding: 5 }}>
                {IDRFormat(data.plafond)}
              </Descriptions.Item>
              <Descriptions.Item label="Tenor" style={{ padding: 5 }}>
                {data.tenor}
              </Descriptions.Item>
              <Descriptions.Item
                label="Usia/Tanggal Lunas"
                style={{ fontSize: 12, padding: 5 }}
              >
                {(() => {
                  const { year, month, day } = GetFullAge(
                    data.Debitur.birthdate,
                    moment(data.created_at).add(data.tenor, "month").toDate(),
                  );
                  return `${year} Thn ${month} Bln ${day} Hr (${moment(data.created_at).add(data.tenor, "month").format("DD/MM/YYYY")})`;
                })()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row my-1 justify-between">
          <div className="flex-1">
            <div className="font-bold italic p-2 bg-red-600 text-gray-50 rounded my-2">
              Rincian Biaya
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Administrasi</span>
                <span>
                  {IDRFormat(
                    (data.plafond *
                      (data.c_adm_sumdan +
                        data.c_adm +
                        data.c_adm_mitra +
                        data.c_adm_ff)) /
                      100,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Asuransi</span>
                <span>
                  {IDRFormat((data.plafond * data.c_insurance) / 100)}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Provisi</span>
                <span>
                  {IDRFormat(
                    (data.plafond *
                      (data.c_provisi_sumdan +
                        data.c_fee_ao +
                        data.c_fee_cabang +
                        data.c_fee_area +
                        data.c_fee_bpp +
                        data.c_fee_bpb)) /
                      100,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Tatalaksana</span>
                <span>
                  {IDRFormat(
                    data.c_gov +
                      data.c_flagging +
                      data.c_infomation +
                      data.c_mutasi +
                      data.c_stamp,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Buka Rekening</span>
                <span>{IDRFormat(data.c_account + data.c_account_sumdan)}</span>
              </div>
              <div className="flex justify-between gap-2 font-bold text-red-500 border-t mt-2">
                <span>TOTAL BIAYA</span>
                <span>
                  {IDRFormat(GetDapem(data as unknown as IDapem).biaya)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="italic mb-1 border-b rounded p-1">
              <div className="flex justify-between border-b border-dashed">
                <div>Angsuran</div>
                <div>{IDRFormat(data.angsuran)}</div>
              </div>
              <div className="flex justify-between border-b border-dashed">
                <div>Sisa Gaji</div>
                <div>{IDRFormat(data.Debitur.salary - data.angsuran)}</div>
              </div>
              <div className="flex justify-between">
                <div>Debt Service Ratio</div>
                <div>
                  {((data.angsuran / data.Debitur.salary) * 100).toFixed(2)}% /{" "}
                  {data.Sumdan.dsr}%
                </div>
              </div>
            </div>
            <Descriptions
              bordered
              column={1}
              size="small"
              title="Analisa Akhir"
              styles={{ header: { marginBottom: 2 } }}
            >
              <Descriptions.Item label="Terima Kotor" style={{ padding: 5 }}>
                {IDRFormat(
                  data.plafond - GetDapem(data as unknown as IDapem).biaya,
                )}
              </Descriptions.Item>
              <Descriptions.Item label="BOP Pembiayaan" style={{ padding: 5 }}>
                {IDRFormat(data.c_bop)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Nominal Takeover"
                style={{ padding: 5 }}
              >
                {IDRFormat(data.c_takeover)}
              </Descriptions.Item>
              <Descriptions.Item
                label={`Blokir Angsuran ${data.c_blokir}X`}
                style={{ padding: 5 }}
              >
                {IDRFormat(data.c_blokir * data.angsuran)}
              </Descriptions.Item>
              {/* <Descriptions.Item
                label={`Retensi Angsuran ${data.c_retensi}X`}
                style={{ padding: 5 }}
              >
                {IDRFormat(data.c_retensi * data.angsuran)}
              </Descriptions.Item> */}

              <Descriptions.Item
                label="Terima Bersih"
                style={{ fontWeight: "bold", color: "green", padding: 5 }}
              >
                {IDRFormat(GetDapem(data as unknown as IDapem).tb)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handleDownloadImage}
        >
          Cetak
        </Button>
      </div>
    </Modal>
  );
};

interface IDapemSimulasi extends IDapem {
  Sumdan: Sumdan;
  angsuran: number;
  angsuran_sumdan: number;
  max_plafond: number;
  max_tenor: number;
}
const defaultData: IDapemSimulasi = {
  nopen: "",
  Sumdan: { max_bop: 3000000 } as Sumdan,
  Debitur: { birthdate: new Date(), salary: 0 } as Debitur,
  ProdukPembiayaan: {} as ProdukPembiayaan,
  JenisPembiayaan: {} as JenisPembiayaan,
  c_margin: 0,
  c_margin_sumdan: 0,
  c_adm_sumdan: 0,
  c_adm: 0,
  c_adm_mitra: 0,
  c_adm_ff: 0,
  c_fee_ao: 0,
  c_fee_cabang: 0,
  c_fee_area: 0,
  c_fee_bpp: 0,
  c_fee_bpb: 0,
  c_insurance: 0,
  c_gov: 0,
  c_account_sumdan: 0,
  c_account: 0,
  c_blokir: 0,
  c_mutasi: 0,
  c_stamp: 0,
  c_flagging: 0,
  c_infomation: 0,
  c_takeover: 0,
  c_bop: 0,
  angsuran: 0,
  max_plafond: 0,
  max_tenor: 0,
  c_ned: 0,
  margin_type: "ANUITAS",
  created_at: new Date(),
} as IDapemSimulasi;
