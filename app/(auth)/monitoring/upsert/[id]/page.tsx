import { headers } from "next/headers";
import UpsertPermohonan from "../../Utils";

type IParams = {
  id: string;
};

export default async function Page({ params }: { params: Promise<IParams> }) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  const origin = `${protocol}://${host}`;
  const { id } = await params;
  const { data } = await fetch(origin + "/api/dapem?id=" + id, {
    method: "PATCH",
    cache: "no-store",
  }).then((res) => res.json());
  if (!data) {
    return (
      <div className="flex items-center justify-center font-bold text-xl text-red-500 opacity-70 w-full my-20">
        Not Found Data
      </div>
    );
  }
  return (
    <div>
      <UpsertPermohonan record={data} />
    </div>
  );
}
