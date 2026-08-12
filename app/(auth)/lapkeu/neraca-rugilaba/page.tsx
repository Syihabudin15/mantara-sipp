"use client";

import { printRL } from "@/components/pdfutils/lapkeu/rugilaba";
import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { ICategoryOfAccount, IJournalDetail } from "@/libs/IInterfaces";
import {
  PrinterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Spin, Card, Statistic, Divider } from "antd";
import { useEffect, useState, useMemo } from "react";

const { RangePicker } = DatePicker;

export default function LaporanRugiLaba() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    pendapatan: IJournalDetail[];
    beban: IJournalDetail[];
  }>({ pendapatan: [], beban: [] });
  const [backdate, setBackdate] = useState<string | null>(null);

  const getData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (backdate) params.append("backdate", backdate);

      // Gunakan method GET jika hanya mengambil data, atau pastikan API mendukung POST
      const res = await fetch(`/api/neraca?${params.toString()}`);
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [backdate]);

  // Kalkulasi menggunakan useMemo
  const pendapatanCategories = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; JournalDetails: IJournalDetail[] }
    >();
    data.pendapatan.forEach((item) => {
      const category = item.CategoryOfAccount;
      if (!category) return;
      const existing = map.get(category.id);
      if (existing) {
        existing.JournalDetails.push(item);
      } else {
        map.set(category.id, {
          id: category.id,
          name: category.name,
          JournalDetails: [item],
        });
      }
    });
    return Array.from(map.values()) as ICategoryOfAccount[];
  }, [data.pendapatan]);

  const bebanCategories = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; JournalDetails: IJournalDetail[] }
    >();
    data.beban.forEach((item) => {
      const category = item.CategoryOfAccount;
      if (!category) return;
      const existing = map.get(category.id);
      if (existing) {
        existing.JournalDetails.push(item);
      } else {
        map.set(category.id, {
          id: category.id,
          name: category.name,
          JournalDetails: [item],
        });
      }
    });
    return Array.from(map.values()) as ICategoryOfAccount[];
  }, [data.beban]);

  const totalPendapatan = useMemo(
    () =>
      data.pendapatan.reduce(
        (acc, curr) => acc + (curr.credit - curr.debit),
        0,
      ),
    [data.pendapatan],
  );

  const totalBeban = useMemo(
    () => data.beban.reduce((acc, curr) => acc + (curr.debit - curr.credit), 0),
    [data.beban],
  );

  const labaBersih = totalPendapatan - totalBeban;

  return (
    <Card className="shadow-md">
      <Spin spinning={loading}>
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-xl font-bold uppercase">Laporan Rugi Laba</h1>
          <h2 className="text-md text-gray-500">
            {process.env.NEXT_PUBLIC_APP_FULLNAME}
          </h2>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-normal text-gray-400">Periode:</span>
            <RangePicker
              size="small"
              onChange={(_, dateStr) => setBackdate(dateStr.join(","))}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() =>
                printRL(
                  pendapatanCategories,
                  bebanCategories,
                  backdate || undefined,
                )
              }
            >
              Cetak
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
          {/* SEKSI PENDAPATAN */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpOutlined className="text-green-500" />
              <h3 className="font-bold text-lg">PENDAPATAN</h3>
            </div>
            <div className="space-y-2">
              {pendapatanCategories.map((d) => (
                <div
                  className="flex justify-between border-b border-gray-100 pb-1"
                  key={d.id}
                >
                  <span className="text-gray-600">{d.name}</span>
                  <span className="font-mono text-gray-800">
                    {IDRFormat(
                      d.JournalDetails.reduce(
                        (acc, curr) => acc + (curr.credit - curr.debit),
                        0,
                      ),
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 p-2 bg-green-50 rounded">
              <span className="font-bold text-green-700">TOTAL PENDAPATAN</span>
              <span className="font-bold text-green-700">
                {IDRFormat(totalPendapatan)}
              </span>
            </div>
          </div>

          {/* SEKSI BEBAN */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownOutlined className="text-red-500" />
              <h3 className="font-bold text-lg">BEBAN</h3>
            </div>
            <div className="space-y-2">
              {bebanCategories.map((d) => (
                <div
                  className="flex justify-between border-b border-gray-100 pb-1"
                  key={d.id}
                >
                  <span className="text-gray-600">{d.name}</span>
                  <span className="font-mono text-gray-800">
                    {IDRFormat(
                      d.JournalDetails.reduce(
                        (acc, curr) => acc + (curr.debit - curr.credit),
                        0,
                      ),
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 p-2 bg-red-50 rounded">
              <span className="font-bold text-red-700">TOTAL BEBAN</span>
              <span className="font-bold text-red-700">
                {IDRFormat(totalBeban)}
              </span>
            </div>
          </div>
        </div>

        <Divider />

        {/* RINGKASAN AKHIR */}
        <div className="flex justify-center">
          <Card
            className={`w-full md:w-1/2 border-2 ${labaBersih >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <Statistic
              title={labaBersih >= 0 ? "LABA BERSIH" : "RUGI BERSIH"}
              value={labaBersih}
              formatter={(val) => (
                <span className="font-bold text-2xl font-mono">
                  {IDRFormat(Number(val))}
                </span>
              )}
              valueStyle={{ color: labaBersih >= 0 ? "#3f8600" : "#cf1322" }}
            />
          </Card>
        </div>
      </Spin>
    </Card>
  );
}
