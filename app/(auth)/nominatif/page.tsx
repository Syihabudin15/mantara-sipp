"use client";

import { ViewFiles } from "@/components";
import { useUser } from "@/components/UserContext";
import {
  ExportToExcel,
  FilterData,
  GetBerkasStatusTag,
  GetDroppingStatusTag,
  MappingToExcelDapem,
} from "@/components/utils/CompUtils";
import { DetailDapem } from "@/components/utils/LayoutUtils";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IAgentFronting,
  IDapem,
  IPageProps,
  IPayOffice,
  IViewFiles,
} from "@/libs/IInterfaces";

import {
  ArrowRightOutlined,
  BankOutlined,
  FileFilled,
  FileProtectOutlined,
  FolderOutlined,
  PayCircleOutlined,
  PrinterOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { JenisPembiayaan, Sumdan } from "@prisma/client";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Progress,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IDapem>>({
    page: 1,
    limit: 50,
    total: 0,
    data: [],
    search: "",
    sumdanId: "",
    jenisPembiayaanId: "",
    document_status: "",
    guarantee_status: "",
    payOfficeId: "",
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
  const [pays, setPays] = useState<IPayOffice[]>([]);
  const [agents, setAgents] = useState<IAgentFronting[]>([]);
  const user = useUser();
  const [views, setViews] = useState<IViewFiles>({
    open: false,
    data: [],
  });

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageProps.page.toString(),
      limit: pageProps.limit.toString(),
      approv_status: "DISETUJUI",
      ...(pageProps.search && { search: pageProps.search }),
      ...(pageProps.sumdanId && { sumdanId: pageProps.sumdanId }),
      ...(pageProps.jenisPembiayaanId && {
        jenisPembiayaanId: pageProps.jenisPembiayaanId,
      }),
      ...(pageProps.document_status && {
        document_status: pageProps.document_status,
      }),
      ...(pageProps.guarantee_status && {
        guarantee_status: pageProps.guarantee_status,
      }),
      ...(pageProps.agentFrontingId && {
        agentFrontingId: pageProps.agentFrontingId,
      }),
      ...(pageProps.payOfficeId && { payOfficeId: pageProps.payOfficeId }),
      ...(pageProps.backdate && { backdate: pageProps.backdate }),
      includes: "true",
    });

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
    pageProps.document_status,
    pageProps.guarantee_status,
    pageProps.payOfficeId,
    pageProps.agentFrontingId,
  ]);

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetch("/api/sumdan?limit=500")
          .then((res) => res.json())
          .then((res) => setSumdans(res.data)),
        fetch("/api/jenis?limit=50")
          .then((res) => res.json())
          .then((res) => setJeniss(res.data)),
        fetch("/api/payoffice?limit=100")
          .then((res) => res.json())
          .then((res) => setPays(res.data)),
        fetch("/api/agent?limit=100")
          .then((res) => res.json())
          .then((res) => setAgents(res.data)),
      ]);
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
        const detail = GetDetailDapem(record);
        return (
          <div className="text-xs">
            <div className="flex gap-2 items-center">
              <Tag color={"blue"}>
                <BankOutlined /> {IDRFormat(detail.detail.angsuran_sumdan)}
              </Tag>
              <Tag color={"blue"}>
                {IDRFormat(detail.angsuran - detail.detail.angsuran_sumdan)}
              </Tag>
            </div>
            <div className="flex justify-center">
              <Tag color={"blue"}> {IDRFormat(detail.angsuran)}</Tag>
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
      title: "Status Berkas",
      dataIndex: "berkas_status",
      key: "berkas_status",
      width: 250,
      render: (_, record, i) => {
        return (
          <div>
            <div className="flex gap-1">
              {GetBerkasStatusTag(record.document_status)}
              <Button
                size="small"
                icon={<FileFilled />}
                disabled={!record.Berkas || !record.Berkas.file_sub}
                onClick={() =>
                  setViews({
                    open: true,
                    data: [
                      {
                        name: "Pengiriman",
                        url: record.Berkas?.file_sub || "",
                      },
                      {
                        name: "Bukti Terima",
                        url: record.Berkas?.file_proof || "",
                      },
                    ],
                  })
                }
              ></Button>
              {record.Berkas && record.Berkas.process_at && (
                <span className="text-xs opacity-80">
                  Send : {moment(record.Berkas.process_at).format("DD/MM/YYYY")}
                </span>
              )}
            </div>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: "collapsible",
              }}
              style={{ fontSize: 11 }}
            >
              {record.document_desc}
            </Paragraph>
          </div>
        );
      },
    },
    {
      title: "Status Jaminan",
      dataIndex: "Jaminan_status",
      key: "Jaminan_status",
      width: 350,
      render: (_, record, i) => {
        const isTbo =
          moment().isAfter(record.tbo_date, "date") &&
          (!record.Jaminan || !record.Jaminan.status);
        return (
          <div>
            <div className="flex gap-1">
              {GetBerkasStatusTag(record.guarantee_status)}
              <Tag color={isTbo ? "red" : "blue"} variant="solid">
                {isTbo ? "LEWAT TBO" : "MASA TBO"}
              </Tag>
              <Button
                size="small"
                icon={<FileFilled />}
                disabled={!record.Jaminan || !record.Jaminan.file_sub}
                onClick={() =>
                  setViews({
                    open: true,
                    data: [
                      {
                        name: "Pengiriman",
                        url: record.Jaminan?.file_sub || "",
                      },
                      {
                        name: "Bukti Terima",
                        url: record.Jaminan?.file_proof || "",
                      },
                    ],
                  })
                }
              ></Button>
              <div className="text-xs opacity-80">
                <div>TBO : {moment(record.tbo_date).format("DD/MM/YYYY")}</div>
                {record.Jaminan && record.Jaminan.process_at && (
                  <div>
                    Send :{" "}
                    {moment(record.Jaminan.process_at).format("DD/MM/YYYY")}
                  </div>
                )}
              </div>
            </div>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: "collapsible",
              }}
              style={{ fontSize: 11 }}
            >
              {record.guarantee_desc}
            </Paragraph>
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
                  record.c_account +
                  record.c_mutasi,
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: "Takeover",
      dataIndex: "c_takeover",
      key: "c_takeover",
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
        const angs = GetDetailDapem(record).angsuran;
        return (
          <div className="text-xs text-right">
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
            clearfilter={() =>
              setPageProps((prev) => ({
                ...prev,
                sumdanId: "",
                jenisPembiayaanId: "",
                agentFrontingId: "",
                payOfficeId: "",
                document_status: "",
                guarantee_status: "",
                backdate: "",
              }))
            }
            children={
              <>
                <div className="my-2">
                  <p>Periode :</p>
                  <RangePicker
                    size="small"
                    value={pageProps.backdate}
                    onChange={(date, dateStr) =>
                      setPageProps({ ...pageProps, backdate: dateStr, page: 1 })
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
                      value={pageProps.sumdanId}
                      onChange={(e) =>
                        setPageProps({ ...pageProps, sumdanId: e, page: 1 })
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
                    value={pageProps.jenisPembiayaanId}
                    onChange={(e) =>
                      setPageProps({
                        ...pageProps,
                        jenisPembiayaanId: e,
                        page: 1,
                      })
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
                    value={pageProps.agentFrontingId}
                    onChange={(e) =>
                      setPageProps({
                        ...pageProps,
                        agentFrontingId: e,
                        page: 1,
                      })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Kantor Bayar :</p>
                  <Select
                    size="small"
                    placeholder="Pilih Kantor Bayar..."
                    options={pays.map((s) => ({
                      label: s.code || s.name,
                      value: s.id,
                    }))}
                    value={pageProps.payOfficeId}
                    onChange={(e) =>
                      setPageProps({
                        ...pageProps,
                        payOfficeId: e,
                        page: 1,
                      })
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
                    value={pageProps.document_status}
                    onChange={(e) =>
                      setPageProps({
                        ...pageProps,
                        document_status: e,
                        page: 1,
                      })
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
                    value={pageProps.guarantee_status}
                    onChange={(e) =>
                      setPageProps({
                        ...pageProps,
                        guarantee_status: e,
                        page: 1,
                      })
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
            (acc, item) => acc + GetDetailDapem(item).angsuran,
            0,
          );
          const angsSumdan = pageData.reduce(
            (acc, item) => acc + GetDetailDapem(item).detail.angsuran_sumdan,
            0,
          );
          const admAngsuran = Math.ceil(angs - angsSumdan);
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
            (acc, curr) => acc + curr.c_blokir * GetDetailDapem(curr).angsuran,
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
                  {IDRFormat(angsSumdan)} + {IDRFormat(admAngsuran)}
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
    </Card>
  );
}
