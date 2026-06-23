"use client";

import { useMemo, useState } from "react";
import {
  Upload,
  Card,
  Typography,
  Tag,
  Progress,
  Row,
  Col,
  Statistic,
  Table,
  Alert,
  Spin,
  Empty,
  Divider,
  Space,
  message,
} from "antd";
import type { UploadProps } from "antd";
import {
  InboxOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;

type LoanStatus = "ACTIVE" | "CLOSED";

interface CreditItem {
  instansi: string;
  loan_status: LoanStatus;
  collect: number;
  loan_value: number;
  loan_os: number;
  overdue_amount: number;
  start_date: string;
  end_date: string | null;
  risk_note: string;
}

interface CreditResult {
  msg: string;
  status: number;
  data: {
    score: number;
    risk_level: "LOW" | "MEDIUM" | "HIGH";
    collect: number;
    recommendation: "APPROVE" | "REVIEW" | "REJECT";
    recommendation_reason: string;
    summary: string;
    metrics: {
      total_lender: number;
      active_loan: number;
      closed_loan: number;
      active_loan_value: number;
      active_loan_os: number;
      total_overdue: number;
      worst_collect_history: number;
      has_write_off: boolean;
      has_restructured_loan: boolean;
      utilization_ratio: number;
    };
    risks: string[];
    data: CreditItem[];
  };
}

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getRiskColor = (risk: string) => {
  if (risk === "LOW") return "success";
  if (risk === "MEDIUM") return "warning";
  return "error";
};

const getRecommendationColor = (recommendation: string) => {
  if (recommendation === "APPROVE") return "green";
  if (recommendation === "REVIEW") return "orange";
  return "red";
};

export default function CreditCheckPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreditResult | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const scoreColor = useMemo(() => {
    const score = result?.data.score || 0;

    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#f59e0b";
    return "#dc2626";
  }, [result]);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".pdf",
    showUploadList: false,
    beforeUpload: async (file) => {
      if (file.type !== "application/pdf") {
        message.error("File harus berupa PDF");
        return Upload.LIST_IGNORE;
      }

      setLoading(true);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("file", file);

        /**
         * Ganti endpoint ini dengan API kamu.
         * Contoh response API harus mengikuti format JSON seperti yang kamu kirim.
         */
        const response = await fetch(
          "https://console.syreldigital.web.id/api/ai/bank/slik",
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Gagal memproses file PDF");
        }

        const json = await response.json();
        setResult(json);

        // Simulasi agar UI bisa langsung dicoba
        // await new Promise((resolve) => setTimeout(resolve, 900));
        // setResult(dummyResult);

        message.success("PDF berhasil diproses");
      } catch (error) {
        console.error(error);
        message.error("Gagal memproses PDF");
      } finally {
        setLoading(false);
      }

      return false;
    },
  };

  const columns = [
    {
      title: "Instansi",
      dataIndex: "instansi",
      key: "instansi",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <BankOutlined />
          </div>
          <Text strong>{value}</Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "loan_status",
      key: "loan_status",
      render: (value: LoanStatus) => (
        <Tag color={value === "ACTIVE" ? "blue" : "default"}>
          {value === "ACTIVE" ? "Aktif" : "Lunas"}
        </Tag>
      ),
    },
    {
      title: "Kol",
      dataIndex: "collect",
      key: "collect",
      align: "center" as const,
      render: (value: number) => (
        <Tag color={value === 1 ? "green" : "red"}>Kol {value}</Tag>
      ),
    },
    {
      title: "Plafond",
      dataIndex: "loan_value",
      key: "loan_value",
      align: "right" as const,
      render: (value: number) => formatRupiah(value),
    },
    {
      title: "Outstanding",
      dataIndex: "loan_os",
      key: "loan_os",
      align: "right" as const,
      render: (value: number) => (
        <Text strong={value > 0}>{formatRupiah(value)}</Text>
      ),
    },
    {
      title: "Tunggakan",
      dataIndex: "overdue_amount",
      key: "overdue_amount",
      align: "right" as const,
      render: (value: number) => (
        <Text type={value > 0 ? "danger" : "success"}>
          {formatRupiah(value)}
        </Text>
      ),
    },
    {
      title: "Mulai",
      dataIndex: "start_date",
      key: "start_date",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Selesai",
      dataIndex: "end_date",
      key: "end_date",
      render: (value: string | null) => formatDate(value),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur">
                <SafetyCertificateOutlined />
                Sistem Analisis Kredit PDF
              </div>

              <Title level={2} className="mb-2! text-white!">
                Credit Risk Analyzer
              </Title>

              <Paragraph className="mb-0! max-w-2xl text-slate-100!">
                Upload file PDF debitur, lalu sistem akan menampilkan skor,
                rekomendasi, kolektibilitas, outstanding, tunggakan, dan riwayat
                fasilitas kredit secara ringkas.
              </Paragraph>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur">
              <Text className="text-slate-200!">Format</Text>
              <div className="mt-1 flex items-center justify-center gap-2 text-xl font-semibold">
                <FilePdfOutlined />
                PDF
              </div>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card className="rounded-3xl border-0 shadow-sm">
              <Title level={4}>Upload Dokumen</Title>
              <Text type="secondary">
                Pilih file PDF untuk dianalisis oleh sistem.
              </Text>

              <div className="mt-5">
                <Dragger
                  {...uploadProps}
                  className="rounded-2xl! border-dashed! border-blue-300! bg-blue-50/40!"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-blue-600!" />
                  </p>
                  <p className="ant-upload-text font-semibold!">
                    Klik atau tarik file PDF ke sini
                  </p>
                  <p className="ant-upload-hint">
                    Hanya mendukung file dengan format PDF.
                  </p>
                </Dragger>
              </div>

              {fileName && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <Text type="secondary">File dipilih</Text>
                  <div className="mt-1 flex items-center gap-2">
                    <FilePdfOutlined className="text-red-500" />
                    <Text strong>{fileName}</Text>
                  </div>
                </div>
              )}

              <Divider />

              <Alert
                type="info"
                showIcon
                message="Catatan"
                description="Endpoint API masih disiapkan sebagai placeholder. Ganti bagian fetch ke endpoint backend milik kamu."
              />
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            {loading ? (
              <Card className="flex min-h-90 items-center justify-center rounded-3xl border-0 shadow-sm">
                <div className="text-center">
                  <Spin size="large" />
                  <Title level={4} className="mt-5!">
                    Menganalisis PDF...
                  </Title>
                  <Text type="secondary">
                    Sistem sedang membaca data kredit debitur.
                  </Text>
                </div>
              </Card>
            ) : !result ? (
              <Card className="flex min-h-90 items-center justify-center rounded-3xl border-0 shadow-sm">
                <Empty
                  description={
                    <span>
                      Belum ada hasil analisis. Upload PDF terlebih dahulu.
                    </span>
                  }
                />
              </Card>
            ) : (
              <div className="space-y-6">
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={9}>
                    <Card className="h-full rounded-3xl border-0 shadow-sm">
                      <div className="text-center">
                        <Progress
                          type="dashboard"
                          percent={result.data.score}
                          strokeColor={scoreColor}
                          size={170}
                        />

                        <Title level={3} className="mb-1!">
                          Score {result.data.score}
                        </Title>

                        <Tag
                          color={getRiskColor(result.data.risk_level)}
                          className="rounded-full px-4 py-1 text-sm"
                        >
                          Risk {result.data.risk_level}
                        </Tag>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} md={15}>
                    <Card className="h-full rounded-3xl border-0 shadow-sm">
                      <Space direction="vertical" size={14} className="w-full">
                        <div>
                          <Text type="secondary">Rekomendasi</Text>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <Tag
                              color={getRecommendationColor(
                                result.data.recommendation,
                              )}
                              className="rounded-full px-4 py-1 text-base font-semibold"
                            >
                              <CheckCircleOutlined />{" "}
                              {result.data.recommendation}
                            </Tag>

                            <Tag className="rounded-full px-4 py-1">
                              Kol {result.data.collect}
                            </Tag>
                          </div>
                        </div>

                        <Alert
                          type={
                            result.data.recommendation === "APPROVE"
                              ? "success"
                              : result.data.recommendation === "REVIEW"
                                ? "warning"
                                : "error"
                          }
                          showIcon
                          message={result.data.recommendation_reason}
                        />

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <Text type="secondary">Ringkasan</Text>
                          <Paragraph className="mb-0! mt-1!">
                            {result.data.summary}
                          </Paragraph>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={12} md={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                      <Statistic
                        title="Total Lender"
                        value={result.data.metrics.total_lender}
                      />
                    </Card>
                  </Col>

                  <Col xs={12} md={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                      <Statistic
                        title="Aktif"
                        value={result.data.metrics.active_loan}
                      />
                    </Card>
                  </Col>

                  <Col xs={12} md={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                      <Statistic
                        title="Lunas"
                        value={result.data.metrics.closed_loan}
                      />
                    </Card>
                  </Col>

                  <Col xs={12} md={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                      <Statistic
                        title="Kol Terburuk"
                        value={`Kol ${result.data.metrics.worst_collect_history}`}
                      />
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                      <Statistic
                        title="Plafond Aktif"
                        value={result.data.metrics.active_loan_value}
                        formatter={(value) => formatRupiah(Number(value))}
                      />
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                      <Statistic
                        title="Outstanding Aktif"
                        value={result.data.metrics.active_loan_os}
                        formatter={(value) => formatRupiah(Number(value))}
                      />
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                      <Statistic
                        title="Total Tunggakan"
                        value={result.data.metrics.total_overdue}
                        formatter={(value) => formatRupiah(Number(value))}
                        valueStyle={{
                          color:
                            result.data.metrics.total_overdue > 0
                              ? "#dc2626"
                              : "#16a34a",
                        }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Card className="rounded-3xl border-0 shadow-sm">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <Title level={4} className="mb-1!">
                        Riwayat Fasilitas Kredit
                      </Title>
                      <Text type="secondary">
                        Daftar fasilitas kredit aktif maupun yang sudah lunas.
                      </Text>
                    </div>

                    {result.data.risks.length === 0 ? (
                      <Tag
                        color="green"
                        className="rounded-full px-4 py-1 text-sm"
                      >
                        Tidak ada risiko terdeteksi
                      </Tag>
                    ) : (
                      <Tag
                        color="red"
                        className="rounded-full px-4 py-1 text-sm"
                      >
                        <WarningOutlined /> {result.data.risks.length} Risiko
                      </Tag>
                    )}
                  </div>

                  <Table
                    rowKey={(record) =>
                      `${record.instansi}-${record.start_date}`
                    }
                    columns={columns}
                    dataSource={result.data.data}
                    pagination={false}
                    scroll={{ x: 1000 }}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div className="rounded-xl bg-slate-50 p-4">
                          <Text strong>Catatan Risiko:</Text>
                          <Paragraph className="mb-0! mt-1!">
                            {record.risk_note}
                          </Paragraph>
                        </div>
                      ),
                    }}
                  />
                </Card>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </main>
  );
}
