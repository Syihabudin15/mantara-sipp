"use client";

import { FormInput } from "@/components";
import { TypeAccount } from "@/components/utils/CompUtils";
import {
  IActionTable,
  ICategoryOfAccount,
  IPageProps,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { AccountType, CategoryOfAccount } from "@prisma/client";
import {
  App,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Space,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { useEffect, useState, useMemo } from "react";

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<ICategoryOfAccount>>({
    page: 1,
    limit: 50,
    total: 0,
    data: [],
    search: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<IActionTable<ICategoryOfAccount>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const { modal } = App.useApp();
  const { hasAccess } = useAccess("/lapkeu/coa");

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", pageProps.page.toString());
    params.append("limit", pageProps.limit.toString());
    if (pageProps.search) params.append("search", pageProps.search);
    if (pageProps.type) params.append("type", pageProps.type);

    try {
      const res = await fetch(`/api/coa?${params.toString()}`);
      const json = await res.json();
      setPageProps((prev) => ({
        ...prev,
        data: json.data,
        total: json.total,
      }));
    } catch (error) {
      console.error("Failed to fetch COA data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 300); // Sedikit di-delay untuk debounce pencarian
    return () => clearTimeout(timeout);
  }, [pageProps.page, pageProps.limit, pageProps.search, pageProps.type]);

  // Fungsi untuk mengubah flat array menjadi nested tree
  const treeData = useMemo(() => {
    const data = JSON.parse(JSON.stringify(pageProps.data)); // Deep copy
    const tree: any[] = [];
    const lookup: Record<string, any> = {};

    data.forEach((item: any) => {
      lookup[item.id] = { ...item, children: [] };
    });

    data.forEach((item: any) => {
      if (item.parentId && lookup[item.parentId]) {
        lookup[item.parentId].children.push(lookup[item.id]);
      } else {
        tree.push(lookup[item.id]);
      }
    });

    // Hapus array children yang kosong agar Antd tidak menampilkan icon expand yang tidak perlu
    const cleanEmptyChildren = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length === 0) {
          delete node.children;
        } else if (node.children) {
          cleanEmptyChildren(node.children);
        }
      });
    };
    cleanEmptyChildren(tree);

    return tree;
  }, [pageProps.data]);

  const getSifatSaldo = (type: string) => {
    if (type === "ASSET" || type === "BEBAN") return "D";
    if (type === "KEWAJIBAN" || type === "PENDAPATAN" || type === "MODAL")
      return "K";
    return "";
  };

  const columns: TableProps<ICategoryOfAccount>["columns"] = [
    {
      title: "ID / Kode",
      dataIndex: "id",
      key: "id",
      width: 150,
      render: (value) => (
        <span className="font-semibold text-gray-700">{value}</span>
      ),
    },
    {
      title: "Nama Akun",
      dataIndex: "name",
      key: "name",
      render(value, record) {
        return (
          <div>
            <span className="text-gray-500 mr-2 text-xs">
              [{getSifatSaldo(record.type)}]
            </span>
            <span className={!record.parentId ? "font-semibold" : ""}>
              {record.name}
            </span>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => {
        let color = "default";
        if (type === "ASSET") color = "blue";
        if (type === "KEWAJIBAN") color = "volcano";
        if (type === "MODAL") color = "purple";
        if (type === "PENDAPATAN") color = "green";
        if (type === "BEBAN") color = "orange";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {hasAccess("update") && (
            <Tooltip title="Edit Akun">
              <Button
                icon={<EditOutlined />}
                size="small"
                type="primary"
                ghost
                onClick={() =>
                  setSelected({ ...selected, selected: record, upsert: true })
                }
              />
            </Tooltip>
          )}
          {hasAccess("delete") && (
            <Tooltip title="Hapus Akun">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                type="primary"
                danger
                ghost
                onClick={() =>
                  setSelected({ ...selected, delete: true, selected: record })
                }
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <SnippetsOutlined /> Chart Of Account
        </div>
      }
      styles={{ body: { padding: 16 } }}
      className="shadow-sm border border-gray-200"
    >
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <div className="flex gap-2">
          {hasAccess("write") && (
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={() =>
                setSelected({ ...selected, selected: undefined, upsert: true })
              }
            >
              Tambah Akun
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            placeholder="Filter Tipe..."
            options={[
              { label: "ASSET", value: "ASSET" },
              { label: "KEWAJIBAN", value: "KEWAJIBAN" },
              { label: "MODAL", value: "MODAL" },
              { label: "PENDAPATAN", value: "PENDAPATAN" },
              { label: "BEBAN", value: "BEBAN" },
            ]}
            onChange={(e) => setPageProps({ ...pageProps, type: e })}
            allowClear
            style={{ width: 170 }}
          />
          <Input.Search
            style={{ width: 220 }}
            placeholder="Cari nama akun..."
            allowClear
            onChange={(e) =>
              setPageProps({ ...pageProps, search: e.target.value })
            }
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={treeData} // Gunakan treeData disini
        size="small"
        loading={loading}
        rowKey="id"
        bordered
        scroll={{ x: 800, y: "calc(100vh - 300px)" }}
        pagination={{
          current: pageProps.page,
          pageSize: pageProps.limit,
          total: pageProps.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPageProps((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }));
          },
          pageSizeOptions: ["50", "100", "500", "1000"],
        }}
      />

      <UpsertData
        open={selected.upsert}
        setOpen={(val: boolean) =>
          setSelected({ ...selected, upsert: val, selected: undefined })
        }
        record={selected.selected}
        getData={getData}
        hook={modal}
        key={selected.selected ? "upsert" + selected.selected.id : "create"}
        // Tetap gunakan pageProps.data (flat) agar dropdown parent mudah dicari
        lists={pageProps.data}
      />

      {selected.selected && (
        <DeleteData
          open={selected.delete}
          setOpen={(val: boolean) =>
            setSelected({ ...selected, delete: val, selected: undefined })
          }
          record={selected.selected}
          getData={getData}
          hook={modal}
          key={selected.selected ? "delete" + selected.selected.id : "delete"}
        />
      )}
    </Card>
  );
}

const UpsertData = ({
  open,
  setOpen,
  getData,
  hook,
  record,
  lists,
}: {
  open: boolean;
  setOpen: Function;
  getData: Function;
  hook: HookAPI;
  record?: CategoryOfAccount;
  lists: CategoryOfAccount[];
}) => {
  const [data, setData] = useState<CategoryOfAccount>(record || defaultdata);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { ...data };
    if ("Parent" in payload) delete (payload as any).Parent;
    if ("Childrens" in payload) delete (payload as any).Childrens; // <--- Pakai 's' sesuai schema
    if ("JournalDetails" in payload) delete (payload as any).JournalDetails;

    try {
      const res = await fetch("/api/coa?id=" + (record?.id || ""), {
        method: record ? "PUT" : "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      if (res.status === 200 || json.status === 200) {
        setOpen(false);
        await getData();
        hook.success({
          content: `Data berhasil ${record ? "diperbarui" : "disimpan"}`,
        });
      } else {
        hook.error({
          title: "ERROR!!",
          content: json.msg || "Terjadi kesalahan",
        });
      }
    } catch (err) {
      hook.error({ title: "ERROR!!", content: "Koneksi ke server gagal." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={record ? "Edit Akun" : "Tambah Akun Baru"}
      loading={loading}
      onOk={handleSubmit}
      okText="Simpan"
      cancelText="Batal"
      destroyOnHidden
    >
      <div className="my-4 flex flex-col gap-4">
        <FormInput
          data={{
            label: "ID/No Akun",
            value: data.id,
            onChange: (e: string) => setData({ ...data, id: e }),
            type: "text",
          }}
        />
        <FormInput
          data={{
            label: "Nama Akun",
            value: data.name,
            onChange: (e: string) => setData({ ...data, name: e }),
            type: "text",
          }}
        />
        <FormInput
          data={{
            label: "Tipe Akun",
            value: data.type,
            onChange: (e: string) =>
              setData({ ...data, type: e as AccountType }),
            type: "select",
            options: [
              { label: "D - ASSET", value: "ASSET" },
              { label: "K - KEWAJIBAN", value: "KEWAJIBAN" },
              { label: "K - MODAL", value: "MODAL" },
              { label: "K - PENDAPATAN", value: "PENDAPATAN" },
              { label: "D - BEBAN", value: "BEBAN" },
            ],
          }}
        />
        <FormInput
          data={{
            label: "Parent Akun",
            value: data.parentId,
            onChange: (e: any) => setData({ ...data, parentId: e ? e : null }),
            type: "select",
            // Hindari memilih diri sendiri sebagai parent
            options: lists
              .filter((d) => d.id !== record?.id && !d.parentId)
              .map((d) => ({
                label: `(${d.id}) ${d.name}`,
                value: d.id,
              })),
          }}
        />
      </div>
    </Modal>
  );
};

const DeleteData = ({
  open,
  setOpen,
  record,
  getData,
  hook,
}: {
  open: boolean;
  setOpen: Function;
  record: CategoryOfAccount;
  getData: Function;
  hook: HookAPI;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coa?id=" + record.id, { method: "DELETE" });
      const json = await res.json();
      if (res.status === 200 || json.status === 200) {
        await getData();
        setOpen(false);
        hook.success({ content: "Data berhasil dihapus" });
      } else {
        hook.error({ content: json.msg || "Gagal menghapus data" });
      }
    } catch (err) {
      hook.error({
        content: `Internal Server Error!! Hapus data COA ${record.id} gagal`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Konfirmasi Hapus"
      loading={loading}
      onOk={handleDelete}
      okText="Hapus"
      cancelText="Batal"
      okButtonProps={{ danger: true }}
    >
      <p className="my-3 text-gray-700">
        Apakah Anda yakin ingin menghapus COA{" "}
        <strong>
          {record.name} ({record.id})
        </strong>
        ? Penghapusan ini mungkin tidak dapat dibatalkan.
      </p>
    </Modal>
  );
};

const defaultdata: CategoryOfAccount = {
  id: "",
  name: "",
  type: "ASSET",
  parentId: null,
  status: true,
};
