"use client";

import { FormInput, ViewFiles } from "@/components";
import { useUser } from "@/components/UserContext";
import {
  ExportToExcel,
  FilterData,
  GetBerkasStatusTag,
  GetDroppingStatusTag,
  MappingToExcelDapem,
} from "@/components/utils/CompUtils";
import { DetailDapem } from "@/components/utils/LayoutUtils";
import {
  GetAngsuran,
  GetDapem,
  IDRFormat,
  IDRToNumber,
} from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IAgentFronting,
  ICashDesc,
  IDapem,
  IPageProps,
  IViewFiles,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";

import {
  ArrowRightOutlined,
  BankOutlined,
  EditOutlined,
  FileFilled,
  FileProtectOutlined,
  FolderOutlined,
  PayCircleOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { EDapemStatus, JenisPembiayaan, Sumdan } from "@prisma/client";
import {
  App,
  Button,
  Card,
  DatePicker,
  Input,
  Modal,
  Progress,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IDapem>>({
    page: 1,
    limit: 50,
    total: 0,
    data: [],
    search: "",
    sumdanId: "",
    jenisPembiayaanId: "",
    takeover_status: "",
    mutasi_status: "",
    flagging_status: "",
    cash_status: "",
    document_status: "",
    guarantee_status: "",
    agentFrontingId: "",
    backdate: "",
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<IActionTable<IDapem>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [sumdans, setSumdans] = useState<Sumdan[]>([]);
  const [jeniss, setJeniss] = useState<JenisPembiayaan[]>([]);
  const [agents, setAgents] = useState<IAgentFronting[]>([]);
  const { modal } = App.useApp();
  const { hasAccess } = useAccess("/nominatif");
  const user = useUser();
  const [views, setViews] = useState<IViewFiles>({
    open: false,
    data: [],
  });

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", pageProps.page.toString());
    params.append("limit", pageProps.limit.toString());
    params.append("approv_status", "DISETUJUI");
    if (pageProps.search) params.append("search", pageProps.search);

    if (pageProps.sumdanId) params.append("sumdanId", pageProps.sumdanId);
    if (pageProps.jenisPembiayaanId)
      params.append("jenisPembiayaanId", pageProps.jenisPembiayaanId);
    if (pageProps.backdate) params.append("backdate", pageProps.backdate);
    if (pageProps.takeover_status)
      params.append("takeover_status", pageProps.takeover_status);
    if (pageProps.mutasi_status)
      params.append("mutasi_status", pageProps.mutasi_status);
    if (pageProps.flagging_status)
      params.append("flagging_status", pageProps.flagging_status);
    if (pageProps.cash_status)
      params.append("cash_status", pageProps.cash_status);
    if (pageProps.document_status)
      params.append("document_status", pageProps.document_status);
    if (pageProps.guarantee_status)
      params.append("guarantee_status", pageProps.guarantee_status);
    if (pageProps.agentFrontingId)
      params.append("agentFrontingId", pageProps.agentFrontingId);

    const res = await fetch(`/api/dapem?${params.toString()}`);
    const json = await res.json();
    setPageProps((prev) => ({
      ...prev,
      data: json.data,
      total: json.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.sumdanId,
    pageProps.jenisPembiayaanId,
    pageProps.backdate,
    pageProps.takeover_status,
    pageProps.mutasi_status,
    pageProps.flagging_status,
    pageProps.cash_status,
    pageProps.document_status,
    pageProps.guarantee_status,
    pageProps.agentFrontingId,
  ]);

  useEffect(() => {
    (async () => {
      await fetch("/api/sumdan")
        .then((res) => res.json())
        .then((res) => setSumdans(res.data));
      await fetch("/api/jenis")
        .then((res) => res.json())
        .then((res) => setJeniss(res.data));
      await fetch("/api/jenis")
        .then((res) => res.json())
        .then((res) => setJeniss(res.data));
      await fetch("/api/agent")
        .then((res) => res.json())
        .then((res) => setAgents(res.data));
    })();
  }, []);

  const columns: TableProps<IDapem>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return (
          <div>
            <div>{(pageProps.page - 1) * pageProps.limit + index + 1}</div>
            <div className="opacity-80 text-xs">{record.id}</div>
          </div>
        );
      },
    },
    {
      title: "Pemohon",
      dataIndex: "pemohon",
      key: "pemohon",
      fixed: window.innerWidth < 600 ? false : true,
      render(value, record, index) {
        return (
          <div>
            <p className="font-bold">{record.Debitur.fullname}</p>
            <div className="text-xs opacity-80">
              <p>@{record.Debitur.nopen}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Permohonan",
      dataIndex: "permohonan",
      key: "permohonan",
      render(value, record, index) {
        return (
          <div>
            <div>
              Plafond : <Tag color={"blue"}>{IDRFormat(record.plafond)}</Tag>
            </div>
            <div>
              Tenor : <Tag color={"blue"}>{record.tenor} Bulan</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Angsuran",
      dataIndex: "angsuran",
      key: "angsuran",
      render(value, record, index) {
        const total = GetAngsuran(
          record.plafond,
          record.tenor,
          record.c_margin + record.c_margin_sumdan,
          record.margin_type,
          record.rounded,
          record.c_ned,
        ).angsuran;
        const mitra = GetAngsuran(
          record.plafond,
          record.tenor,
          record.c_margin_sumdan,
          record.margin_type,
          record.rounded_sumdan,
        ).angsuran;
        return (
          <div className="text-xs">
            <div className="flex gap-2 items-center">
              <Tag color={"blue"}>
                <BankOutlined /> {IDRFormat(mitra)}
              </Tag>
              <Tag color={"blue"}>{IDRFormat(total - mitra)}</Tag>
            </div>
            <div className="flex justify-center">
              <Tag color={"blue"}> {IDRFormat(total)}</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Produk Pembiayaan",
      dataIndex: "produk",
      key: "produk",
      render(value, record, index) {
        return (
          <div>
            <p>
              {record.ProdukPembiayaan.name}{" "}
              <span>({record.ProdukPembiayaan.Sumdan.code})</span>
            </p>
            <p className="opacity-80 text-xs">{record.JenisPembiayaan.name}</p>
          </div>
        );
      },
    },
    {
      title: "AO & UP",
      dataIndex: "aoup",
      key: "aoup",
      render(value, record, index) {
        const ao = record.AO || record.AOCabang || record.AOArea;
        return (
          <div>
            <div>{ao?.fullname}</div>
            <div className="text-xs opacity-80">
              {ao?.Cabang.name} | {ao?.Cabang.Area.name}
            </div>
          </div>
        );
      },
    },
    {
      title: "Agent Fronting",
      dataIndex: "agentFrontingId",
      key: "agentFrontingId",
      render(value, record, index) {
        return (
          <div>
            <div>{record.AgentFronting?.name}</div>
            <div className="text-xs opacity-80">
              {record.AgentFronting?.code}
            </div>
          </div>
        );
      },
    },
    {
      title: "Nomor Akad",
      dataIndex: "dataakad",
      key: "dataakad",
      render(value, record, index) {
        return (
          <div>
            {record.no_contract && <div>{record.no_contract}</div>}
            {record.date_contract && (
              <div className="text-xs opacity-80">
                {moment(record.date_contract).format("DD/MM/YYYY")}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Mutasi & Takeover",
      dataIndex: "produk",
      key: "produk",
      width: 350,
      render(value, record, index) {
        return (
          <div>
            {record.JenisPembiayaan.status_mutasi && (
              <div style={{ fontSize: 9 }}>
                <SwapOutlined />{" "}
                <Tag style={{ fontSize: 9 }} color={"red"}>
                  {record.prev_payoffice}
                </Tag>{" "}
                <ArrowRightOutlined style={{ fontSize: 9 }} />{" "}
                <Tag style={{ fontSize: 9 }} color={"blue"}>
                  {record.PayOffice.code || record.PayOffice.name}
                </Tag>
              </div>
            )}
            {record.JenisPembiayaan.status_takeover && (
              <div style={{ fontSize: 9 }}>
                <PayCircleOutlined />{" "}
                <Tag color={"blue"} style={{ fontSize: 9 }}>
                  {record.takeover_from} (
                  {moment(record.takeover_date).format("DD/MM/YYYY")})
                </Tag>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Status Dropping",
      dataIndex: "dropping_status",
      key: "dropping_status",
      width: 180,
      render: (_, record, i) => {
        return (
          <div className="flex gap-1">
            {GetDroppingStatusTag(record.dropping_status)}
            {record.Dropping && record.Dropping.process_at && (
              <div className="text-xs">
                {moment(record.Dropping.process_at).format("DD/MM/YYYY HH:mm")}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (date, record) => {
        let percent = 40;
        if (record.takeover_status === "DISETUJUI") percent += 10;
        if (record.mutasi_status === "DISETUJUI") percent += 10;
        if (record.flagging_status === "DISETUJUI") percent += 10;
        if (record.cash_status === "DISETUJUI") percent += 10;
        if (record.document_status === "MITRA") percent += 10;
        if (record.guarantee_status === "MITRA") percent += 10;
        return <Progress percent={percent} />;
      },
    },
    {
      title: "Progres Tagihan",
      dataIndex: "progres",
      key: "progres",
      width: 150,
      render(value, record, index) {
        const filter = record.Angsurans.filter((f) => f.date_paid !== null);
        return (
          <Tooltip title={`${filter.length} / ${record.tenor}`}>
            <Progress
              percent={parseFloat(
                String(((filter.length / record.tenor) * 100).toFixed(2)),
              )}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Asuransi",
      dataIndex: "biaya_sumdan",
      key: "biaya_sumdan",
      render(value, record, index) {
        const asuransi = record.plafond * (record.c_insurance / 100);
        return (
          <div className="text-xs text-right">
            <span>{IDRFormat(asuransi)}</span>
          </div>
        );
      },
    },
    {
      title: "Biaya Sumdan",
      dataIndex: "biaya_sumdan",
      key: "biaya_sumdan",
      render(value, record, index) {
        const adm = record.plafond * (record.c_adm_sumdan / 100);
        const provisi = record.plafond * (record.c_provisi_sumdan / 100);
        const total = adm + provisi + record.c_account_sumdan;
        return (
          <div className="text-xs text-right">
            <span>{IDRFormat(total)}</span>
          </div>
        );
      },
    },
    {
      title: "Adm Koperasi",
      dataIndex: "biaya",
      key: "biaya",
      render(value, record, index) {
        const adm = record.plafond * (record.c_adm / 100);
        const adm_mitra = record.plafond * (record.c_adm_mitra / 100);
        const adm_ff = record.plafond * (record.c_adm_ff / 100);
        const total = adm + adm_mitra + adm_ff;
        return (
          <div className="text-xs text-right">
            <span>{IDRFormat(total)}</span>
          </div>
        );
      },
    },
    {
      title: "Prov Koperasi",
      dataIndex: "biaya",
      key: "biaya",
      render(value, record, index) {
        const ao = record.plafond * (record.c_fee_ao / 100);
        const cabang = record.plafond * (record.c_fee_cabang / 100);
        const area = record.plafond * (record.c_fee_area / 100);
        const bpp = record.plafond * (record.c_fee_bpp / 100);
        const bpb = record.plafond * (record.c_fee_bpb / 100);
        const total = ao + cabang + area + bpp + bpb;
        return (
          <div className="text-xs text-right">
            <span>{IDRFormat(total)}</span>
          </div>
        );
      },
    },
    {
      title: "Tatalaksana",
      dataIndex: "biaya",
      key: "biaya",
      render(value, record, index) {
        return (
          <div className="text-xs text-right">
            <span className="text-right">
              {IDRFormat(
                record.c_gov +
                  record.c_flagging +
                  record.c_infomation +
                  record.c_stamp +
                  record.c_bop +
                  record.c_mutasi,
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: "Rek/Anggota",
      dataIndex: "blokir",
      key: "blokir",
      render(value, record, index) {
        return (
          <div className="text-xs text-right">
            <span>{IDRFormat(record.c_takeover)}</span>
          </div>
        );
      },
    },
    {
      title: "Takeover",
      dataIndex: "blokir",
      key: "blokir",
      render(value, record, index) {
        return (
          <div className="text-xs text-right">
            <span>{IDRFormat(record.c_takeover)}</span>
          </div>
        );
      },
    },
    {
      title: "Blokir Angsuran",
      dataIndex: "blokir",
      key: "blokir",
      render(value, record, index) {
        const angs = GetAngsuran(
          record.plafond,
          record.tenor,
          record.c_margin + record.c_margin_sumdan,
          record.margin_type,
          record.rounded,
          record.c_ned,
        ).angsuran;
        return (
          <div className="text-xs">
            <p>
              {record.c_blokir} x {IDRFormat(angs)}
            </p>
            <p>{IDRFormat(record.c_blokir * angs)}</p>
          </div>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render(value, record, index) {
        return (
          <div>
            <div>{record.User.fullname}</div>
            <div className="opacity-80 text-xs">
              {moment(record.created_at).format("DD/MM/YYYY")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2">
          {hasAccess("update") && (
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              onClick={() =>
                setSelected({ ...selected, proses: true, selected: record })
              }
            ></Button>
          )}
          <Tooltip
            title={`Detail Data ${record.Debitur.fullname} (${record.nopen})`}
          >
            <Button
              icon={<FolderOutlined />}
              type="primary"
              size="small"
              onClick={() =>
                setSelected({ ...selected, upsert: true, selected: record })
              }
            ></Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <FileProtectOutlined /> Daftar Nominatif
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1 gap-2 overflow-auto">
        <div className="flex gap-2">
          <FilterData
            children={
              <>
                <div className="my-2">
                  <p>Periode :</p>
                  <RangePicker
                    size="small"
                    onChange={(date, dateStr) =>
                      setPageProps({ ...pageProps, backdate: dateStr })
                    }
                    style={{ width: "100%" }}
                  />
                </div>
                {user && !user.sumdanId && (
                  <div className="my-2">
                    <p>Mitra pembiayaan :</p>
                    <Select
                      size="small"
                      placeholder="Pilih Mitra..."
                      options={sumdans.map((s) => ({
                        label: s.code,
                        value: s.id,
                      }))}
                      onChange={(e) =>
                        setPageProps({ ...pageProps, sumdanId: e })
                      }
                      allowClear
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                <div className="my-2">
                  <p>Jenis Pembiayaan :</p>
                  <Select
                    size="small"
                    placeholder="Pilih Jenis..."
                    options={jeniss.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, jenisPembiayaanId: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Agent Fronting :</p>
                  <Select
                    size="small"
                    placeholder="Pilih Agent..."
                    options={agents.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, agentFrontingId: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Status Takeover :</p>
                  <Select
                    size="small"
                    placeholder="Status Takeover..."
                    options={[
                      { label: "DRAFT", value: "DRAFT" },
                      { label: "PENDING", value: "PENDING" },
                      { label: "PROSES", value: "PROSES" },
                      { label: "SELESAI", value: "DISETUJUI" },
                    ]}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, takeover_status: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Status Mutasi :</p>
                  <Select
                    size="small"
                    placeholder="Status Mutasi..."
                    options={[
                      { label: "DRAFT", value: "DRAFT" },
                      { label: "PENDING", value: "PENDING" },
                      { label: "PROSES", value: "PROSES" },
                      { label: "SELESAI", value: "DISETUJUI" },
                    ]}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, mutasi_status: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Status Flagging : </p>
                  <Select
                    size="small"
                    placeholder="Status Flagging..."
                    options={[
                      { label: "DRAFT", value: "DRAFT" },
                      { label: "PENDING", value: "PENDING" },
                      { label: "PROSES", value: "PROSES" },
                      { label: "SELESAI", value: "DISETUJUI" },
                    ]}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, flagging_status: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Status Terima Bersih : </p>
                  <Select
                    size="small"
                    placeholder="Status TB..."
                    options={[
                      { label: "DRAFT", value: "DRAFT" },
                      { label: "PENDING", value: "PENDING" },
                      { label: "PROSES", value: "PROSES" },
                      { label: "SELESAI", value: "DISETUJUI" },
                    ]}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, cash_status: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Status Penyerahan Berkas : </p>
                  <Select
                    size="small"
                    placeholder="Status Berkas..."
                    options={[
                      { label: "UNIT", value: "UNIT" },
                      { label: "PUSAT", value: "PUSAT" },
                      { label: "DELIVERY", value: "DELIVERY" },
                      { label: "MITRA", value: "MITRA" },
                    ]}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, document_status: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="my-2">
                  <p>Status Penyerahan Jaminan : </p>
                  <Select
                    size="small"
                    placeholder="Status Jaminan..."
                    options={[
                      { label: "UNIT", value: "UNIT" },
                      { label: "PUSAT", value: "PUSAT" },
                      { label: "DELIVERY", value: "DELIVERY" },
                      { label: "MITRA", value: "MITRA" },
                    ]}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, guarantee_status: e })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
              </>
            }
          />
        </div>
        <div className="flex gap-2">
          <Button
            icon={<PrinterOutlined />}
            size="small"
            type="primary"
            onClick={() =>
              ExportToExcel(
                [
                  {
                    sheetname: "alldata",
                    data: MappingToExcelDapem(pageProps.data),
                  },
                ],
                "nominatif",
              )
            }
          >
            Excel
          </Button>
          <Input.Search
            size="small"
            style={{ width: 170 }}
            placeholder="Cari nama..."
            onChange={(e) =>
              setPageProps({ ...pageProps, search: e.target.value })
            }
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={pageProps.data}
        size="small"
        loading={loading}
        rowKey={"id"}
        bordered
        scroll={{ x: "max-content", y: "48vh" }}
        pagination={{
          current: pageProps.page,
          pageSize: pageProps.limit,
          total: pageProps.total,
          onChange: (page, pageSize) => {
            setPageProps((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }));
          },
          pageSizeOptions: [50, 100, 500, 1000],
          showSizeChanger: true,
        }}
        summary={(pageData) => {
          const angs = pageData.reduce(
            (acc, item) =>
              acc +
              GetAngsuran(
                item.plafond,
                item.tenor,
                item.c_margin + item.c_margin_sumdan,
                item.margin_type,
                item.rounded,
                item.c_ned,
              ).angsuran,
            0,
          );
          const angsSumdan = pageData.reduce(
            (acc, item) =>
              acc +
              GetAngsuran(
                item.plafond,
                item.tenor,
                item.c_margin_sumdan,
                item.margin_type,
                item.rounded_sumdan,
              ).angsuran,
            0,
          );
          const adm_sumdan = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_adm_sumdan / 100),
            0,
          );
          const prov_sumdan = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_provisi_sumdan / 100),
            0,
          );
          const rek_sumdan = pageData.reduce(
            (acc, curr) => acc + curr.c_account_sumdan,
            0,
          );
          const adm = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_adm / 100),
            0,
          );
          const adm_mitra = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_adm_mitra / 100),
            0,
          );
          const adm_ff = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_adm_ff / 100),
            0,
          );
          const asuransi = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_insurance / 100),
            0,
          );
          const tatalaksana = pageData.reduce(
            (acc, curr) => acc + curr.c_gov,
            0,
          );
          const materai = pageData.reduce((acc, curr) => acc + curr.c_stamp, 0);
          const flagging = pageData.reduce(
            (acc, curr) => acc + curr.c_flagging,
            0,
          );
          const inform = pageData.reduce(
            (acc, curr) => acc + curr.c_infomation,
            0,
          );
          const mutasi = pageData.reduce((acc, curr) => acc + curr.c_mutasi, 0);
          const rek = pageData.reduce((acc, curr) => acc + curr.c_account, 0);
          const fee_ao = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_fee_ao / 100),
            0,
          );
          const fee_cabang = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_fee_cabang / 100),
            0,
          );
          const fee_area = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_fee_area / 100),
            0,
          );
          const fee_bpp = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_fee_bpp / 100),
            0,
          );
          const fee_bpb = pageData.reduce(
            (acc, curr) => acc + curr.plafond * (curr.c_fee_bpb / 100),
            0,
          );
          const bop = pageData.reduce((acc, curr) => acc + curr.c_bop, 0);
          const takeover = pageData.reduce(
            (acc, curr) => acc + curr.c_takeover,
            0,
          );

          const blokir = pageData.reduce(
            (acc, curr) =>
              acc +
              curr.c_blokir *
                GetAngsuran(
                  curr.plafond,
                  curr.tenor,
                  curr.c_margin + curr.c_margin_sumdan,
                  curr.margin_type,
                  curr.rounded,
                  curr.c_ned,
                ).angsuran,
            0,
          );

          return (
            <Table.Summary.Row className="text-xs bg-blue-400">
              <Table.Summary.Cell index={0} colSpan={2} className="text-center">
                <b>SUMMARY</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} className="text-center">
                <b>
                  {IDRFormat(
                    pageData.reduce((acc, item) => acc + item.plafond, 0),
                  )}{" "}
                </b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} className="text-center font-bold">
                <div>
                  {IDRFormat(angs)} - {IDRFormat(angs - angsSumdan)}
                </div>
                <div className="border-t border-gray-500">
                  {IDRFormat(angs)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                index={5}
                colSpan={8}
                className="text-center font-bold"
              ></Table.Summary.Cell>

              <Table.Summary.Cell index={12} className="font-bold">
                <div className="text-right">{IDRFormat(asuransi)}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={14} className="font-bold">
                <div className="text-right">
                  {IDRFormat(adm_sumdan + prov_sumdan + rek_sumdan)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={14} className="font-bold">
                <div className="text-right">
                  {IDRFormat(adm + adm_mitra + adm_ff)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={15} className="font-bold">
                <div className="text-right">
                  {IDRFormat(
                    fee_ao + fee_cabang + fee_area + fee_bpp + fee_bpb,
                  )}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={16} className="font-bold">
                <div className="text-right">
                  {IDRFormat(
                    tatalaksana +
                      rek +
                      materai +
                      flagging +
                      inform +
                      mutasi +
                      bop,
                  )}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={17} className="font-bold">
                <div className="text-right">{IDRFormat(rek)}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={18} className="font-bold">
                <div className="text-right">{IDRFormat(takeover)}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={19} className="font-bold">
                <div className="text-right">{IDRFormat(blokir)}</div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />

      {selected.selected && selected.upsert && (
        <DetailDapem
          open={selected.upsert}
          setOpen={(val: boolean) =>
            setSelected({ ...selected, selected: undefined, upsert: val })
          }
          data={selected.selected}
          key={"detail" + selected.selected.id}
          allowprogres={true}
        />
      )}
      <ViewFiles
        setOpen={(v: boolean) => setViews({ ...views, open: v })}
        data={{ ...views }}
      />
      {/* {selected.selected && selected.proses && (
        <UpdateStatus
          open={selected.proses}
          setOpen={(val: boolean) =>
            setSelected({ ...selected, proses: val, selected: undefined })
          }
          getData={getData}
          dapem={selected.selected}
          key={"upsert" + selected.selected.id}
          hook={modal}
        />
      )} */}
    </Card>
  );
}

const UpdateStatus = ({
  open,
  setOpen,
  getData,
  dapem,
  hook,
}: {
  open: boolean;
  setOpen: Function;
  getData: Function;
  dapem: IDapem;
  hook: HookAPI;
}) => {
  const [cashdesc, setCashdesc] = useState<ICashDesc[]>(
    dapem.cash_desc
      ? (JSON.parse(dapem.cash_desc) as ICashDesc[])
      : [defaultCashDesc],
  );
  const [data, setData] = useState<IDapem>(dapem);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    data.cash_desc = JSON.stringify(cashdesc);
    await fetch("/api/dapem", {
      method: "PUT",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 200) {
          hook.success({
            title: "BERHASIL",
            content: "Data Pembiayaan berhasil diupdate",
          });
          await getData();
          setOpen(false);
        } else {
          hook.error({ title: "ERROR!!", content: res.msg });
        }
      });
    setLoading(false);
  };

  return (
    <Modal
      title={"Update Data " + dapem.id}
      open={open}
      onCancel={() => setOpen(false)}
      width={1200}
      loading={loading}
      onOk={handleSubmit}
      style={{ top: 20 }}
    >
      <div className="my-4 flex gap-2 flex-col sm:flex-row">
        <div className="flex-1">
          <FormInput
            data={{
              label: "Pemohon",
              class: "flex-1",
              type: "text",
              disabled: true,
              value: `${dapem.Debitur.fullname} (${dapem.nopen})`,
            }}
          />
          <div className="flex flex-wrap gap-2 border-b py-2">
            <FormInput
              data={{
                label: "Status Takeover",
                required: true,
                class: "flex-1",
                mode: "vertical",
                type: "select",
                options: [
                  { label: "DRAFT", value: "DRAFT" },
                  { label: "PENDING", value: "PENDING" },
                  { label: "PROSES", value: "PROSES" },
                  { label: "SELESAI", value: "DISETUJUI" },
                ],
                value: data.takeover_status,
                onChange: (e: string) =>
                  setData({ ...data, takeover_status: e as EDapemStatus }),
              }}
            />
            <FormInput
              data={{
                label: "Tanggal Takeover",
                required: true,
                mode: "vertical",
                type: "date",
                class: "flex-1",
                value: moment(data.takeover_date_exc).format("YYYY-MM-DD"),
                onChange: (e: string) =>
                  setData({ ...data, takeover_date_exc: new Date(e) }),
              }}
            />
            <FormInput
              data={{
                label: "Keterangan",
                required: true,
                class: "flex-1",
                type: "textarea",
                value: data.takeover_desc,
                onChange: (e: string) => setData({ ...data, takeover_desc: e }),
              }}
            />
            <FormInput
              data={{
                label: "File",
                required: true,
                mode: "vertical",
                class: "flex-1",
                type: "upload",
                value: data.file_takeover,
                onChange: (e: string) => setData({ ...data, file_takeover: e }),
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 border-b py-2">
            <FormInput
              data={{
                label: "Status Mutasi",
                required: true,
                mode: "vertical",
                class: "flex-1",
                type: "select",
                options: [
                  { label: "DRAFT", value: "DRAFT" },
                  { label: "PENDING", value: "PENDING" },
                  { label: "PROSES", value: "PROSES" },
                  { label: "SELESAI", value: "DISETUJUI" },
                ],
                value: data.mutasi_status,
                onChange: (e: string) =>
                  setData({ ...data, mutasi_status: e as EDapemStatus }),
              }}
            />
            <FormInput
              data={{
                label: "Tanggal Mutasi",
                required: true,
                type: "date",
                mode: "vertical",
                class: "flex-1",
                value: moment(data.mutasi_date_exc).format("YYYY-MM-DD"),
                onChange: (e: string) =>
                  setData({ ...data, mutasi_date_exc: new Date(e) }),
              }}
            />
            <FormInput
              data={{
                label: "Keterangan",
                required: true,
                mode: "vertical",
                class: "flex-1",
                type: "textarea",
                value: data.mutasi_desc,
                onChange: (e: string) => setData({ ...data, mutasi_desc: e }),
              }}
            />
            <FormInput
              data={{
                label: "File",
                required: true,
                mode: "vertical",
                class: "flex-1",
                type: "upload",
                value: data.file_mutasi,
                onChange: (e: string) => setData({ ...data, file_mutasi: e }),
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 py-2">
            <FormInput
              data={{
                label: "Status Flagging",
                required: true,
                mode: "vertical",
                type: "select",
                class: "flex-1",
                options: [
                  { label: "DRAFT", value: "DRAFT" },
                  { label: "PENDING", value: "PENDING" },
                  { label: "PROSES", value: "PROSES" },
                  { label: "SELESAI", value: "DISETUJUI" },
                ],
                value: data.flagging_status,
                onChange: (e: string) =>
                  setData({ ...data, flagging_status: e as EDapemStatus }),
              }}
            />
            <FormInput
              data={{
                label: "Tanggal Flagging",
                required: true,
                type: "date",
                mode: "vertical",
                class: "flex-1",
                value: moment(data.flagging_date_exc).format("YYYY-MM-DD"),
                onChange: (e: string) =>
                  setData({ ...data, flagging_date_exc: new Date(e) }),
              }}
            />
            <FormInput
              data={{
                label: "Keterangan",
                required: true,
                type: "textarea",
                mode: "vertical",
                class: "flex-1",
                value: data.flagging_desc,
                onChange: (e: string) => setData({ ...data, flagging_desc: e }),
              }}
            />
            <FormInput
              data={{
                label: "File",
                required: true,
                mode: "vertical",
                class: "flex-1",
                type: "upload",
                value: data.file_flagging,
                onChange: (e: string) => setData({ ...data, file_flagging: e }),
              }}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <FormInput
            data={{
              label: "Status TB",
              required: true,
              mode: "horizontal",
              type: "select",
              options: [
                { label: "DRAFT", value: "DRAFT" },
                { label: "PENDING", value: "PENDING" },
                { label: "PROSES", value: "PROSES" },
                { label: "SELESAI", value: "DISETUJUI" },
              ],
              value: data.cash_status,
              onChange: (e: string) =>
                setData({ ...data, cash_status: e as EDapemStatus }),
            }}
          />
          {cashdesc.map((c, i) => (
            <div
              className="w-full flex flex-wrap gap-2 border-b border-gray-400 py-1"
              key={i}
            >
              <FormInput
                data={{
                  label: `Nominal (${i + 1})`,
                  required: true,
                  type: "text",
                  mode: "vertical",
                  class: "flex-1",
                  value: IDRFormat(cashdesc[i].amount),
                  onChange: (e: string) =>
                    setCashdesc(
                      cashdesc.map((cd, id) => ({
                        ...cd,
                        ...(i === id && { amount: IDRToNumber(e || "0") }),
                      })),
                    ),
                }}
              />
              <FormInput
                data={{
                  label: `Tanggal TB (${i + 1})`,
                  required: true,
                  type: "date",
                  mode: "vertical",
                  class: "flex-1",
                  value: moment(cashdesc[i].date).format("YYYY-MM-DD"),
                  onChange: (e: string) =>
                    setCashdesc(
                      cashdesc.map((cd, id) => ({
                        ...cd,
                        ...(i === id && { date: new Date(e) }),
                      })),
                    ),
                }}
              />
              <FormInput
                data={{
                  label: `Keterangan (${i + 1})`,
                  required: true,
                  type: "textarea",
                  mode: "vertical",
                  class: "flex-1",
                  value: cashdesc[i].desc,
                  onChange: (e: string) =>
                    setCashdesc(
                      cashdesc.map((cd, id) => ({
                        ...cd,
                        ...(i === id && { desc: e }),
                      })),
                    ),
                }}
              />
              <FormInput
                data={{
                  label: "File",
                  required: true,
                  mode: "vertical",
                  class: "flex-1",
                  type: "upload",
                  value: cashdesc[i].file,
                  onChange: (e: string) =>
                    setCashdesc(
                      cashdesc.map((cd, id) => ({
                        ...cd,
                        ...(i === id && { file: e }),
                      })),
                    ),
                }}
              />
            </div>
          ))}
          <div className="w-full">
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              block
              onClick={() => setCashdesc([...cashdesc, defaultCashDesc])}
            >
              Add More
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const defaultCashDesc: ICashDesc = {
  amount: 0,
  date: new Date(),
  desc: "",
  file: "",
};
