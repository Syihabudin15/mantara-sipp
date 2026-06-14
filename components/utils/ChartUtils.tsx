"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface ITempChart {
  month: string;
  approved: number;
  pending: number;
  cancel: number;
  rejected: number;
}

export const StatusDapemChart = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: data.map((d) => d.name),
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },

    dataLabels: {
      enabled: true,
      formatter: (_val: number, opts: any) => {
        const value = opts.w.globals.series[opts.seriesIndex]; // nilai asli
        return `Rp ${value.toLocaleString("id-ID")}`;
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="w-full h-full">
      <Chart
        options={options}
        series={data.map((d) => d.value)}
        type="pie"
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};

export function PencapaianChart({ data }: { data: any[] }) {
  const series = [
    {
      name: "Total Pencapaian",
      data: data.map((d) =>
        d.data.reduce((acc: number, curr: any) => acc + curr.plafond, 0),
      ),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
    },
    xaxis: {
      categories: data.map((item) => item.month),
    },
    tooltip: {
      y: {
        formatter: (val) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `Rp ${val.toLocaleString("id-ID")}`,
    },
  };

  return (
    <div className="w-full h-full">
      <Chart
        options={options}
        series={series}
        type="area"
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
}

export const BarChart = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        // columnWidth: "45%",
        distributed: true, // penting agar tiap batang beda warna
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
    },
    xaxis: {
      categories: data.map((d) => d.name),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
    legend: { show: false }, // karena sudah jelas batangnya
  };

  const series = [
    {
      name: "Total",
      data: data.map((d) => d.value),
    },
  ];

  return (
    <div className="w-full h-full">
      <Chart
        options={options}
        series={series}
        type="bar"
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};
