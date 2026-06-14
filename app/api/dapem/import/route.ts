import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response(
      JSON.stringify({ message: "Mohon unggah sebuah file!" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  try {
    const buff = await file.arrayBuffer();
    const workbook = xlsx.read(buff, {
      type: "buffer",
      cellDates: true,
      dateNF: "dd/mm/yyyy",
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet);
    for (const data of jsonData) {
      const record = {
        fullname: String((data as any).fullname || "").trim(),
        nik: String((data as any).nik || "").trim(),
        birthdate: String((data as any).birthdate || "").trim(),
        birthplace: String((data as any).birthplace || "").trim(),
        gender: String((data as any).gender || "").trim(),
        address: String((data as any).address || "").trim(),
        ward: String((data as any).ward || "").trim(),
        district: String((data as any).district || "").trim(),
        city: String((data as any).city || "").trim(),
        province: String((data as any).province || "").trim(),
        pos_code: String((data as any).pos_code || "").trim(),
        curr_address: String((data as any).curr_address || "").trim(),
        curr_ward: String((data as any).curr_ward || "").trim(),
        curr_district: String((data as any).curr_district || "").trim(),
        curr_city: String((data as any).curr_city || "").trim(),
        curr_province: String((data as any).curr_province || "").trim(),
        curr_pos_code: String((data as any).curr_pos_code || "").trim(),
        phone: String((data as any).phone || "").trim(),
        npwp: String((data as any).npwp || "").trim(),
        religion: String((data as any).religion || "").trim(),
        ktp_expired: String((data as any).ktp_expired || "").trim(),
        geo_location: String((data as any).geo_location || "").trim(),
        education: String((data as any).education || "").trim(),
        job_year: String((data as any).job_year || "").trim(),
        house_status: String((data as any).house_status || "").trim(),
        house_year: String((data as any).house_year || "").trim(),
        job: String((data as any).job || "").trim(),
        job_address: String((data as any).job_address || "").trim(),
        business: String((data as any).business || "").trim(),
        marriage_status: String((data as any).marriage_status || "").trim(),
        aw_name: String((data as any).aw_name || "").trim(),
        aw_nik: String((data as any).aw_nik || "").trim(),
        aw_birthdate: String((data as any).aw_birthdate || "").trim(),
        aw_birthplace: String((data as any).aw_birthplace || "").trim(),
        aw_ktp_expired: String((data as any).aw_ktp_expired || "").trim(),
        aw_address: String((data as any).aw_address || "").trim(),
        aw_phone: String((data as any).aw_phone || "").trim(),
        aw_relate: String((data as any).aw_relate || "").trim(),
        family_name: String((data as any).family_name || "").trim(),
        family_phone: String((data as any).family_phone || "").trim(),
        family_address: String((data as any).family_address || "").trim(),
        family_relate: String((data as any).family_relate || "").trim(),
        nopen: String((data as any).nopen || "").trim(),
        no_skep: String((data as any).no_skep || "").trim(),
        group_skep: String((data as any).group_skep || "").trim(),
        name_skep: String((data as any).name_skep || "").trim(),
        rank_skep: String((data as any).rank_skep || "").trim(),
        publisher_skep: String((data as any).publisher_skep || "").trim(),
        tmt_skep: String((data as any).tmt_skep || "").trim(),
        tgl_skep: String((data as any).tgl_skep || "").trim(),
        purpose_use: String((data as any).purpose_use || "").trim(),
        pay_office: String((data as any).pay_office || "").trim(),
        mutasi_to: String((data as any).mutasi_to || "").trim(),
        instansi_takeover: String((data as any).instansi_takeover || "").trim(),
        account_name: String((data as any).account_name || "").trim(),
        bank_name: String((data as any).bank_name || "").trim(),
        salary: Number((data as any).salary || ""),
        type: String((data as any).type || "").trim(),
        product: String((data as any).product || "").trim(),
        mitra: String((data as any).mitra || "").trim(),
        margin_type: String((data as any).margin_type || "").trim(),
        tenor: Number((data as any).tenor || ""),
        plafon: Number((data as any).plafon || ""),
        margin: Number((data as any).margin || ""),
        c_adm: Number((data as any).c_adm || ""),
        c_adm_mitra: Number((data as any).c_adm_mitra || ""),
        c_insurance: Number((data as any).c_insurance || ""),
        c_gov: Number((data as any).c_gov || ""),
        c_stamp: Number((data as any).c_stamp || ""),
        c_account: Number((data as any).c_account || ""),
        c_mutasi: Number((data as any).c_mutasi || ""),
        c_provisi: Number((data as any).c_provisi || ""),
        c_provisi_mitra: Number((data as any).c_provisi_mitra || ""),
        c_informasi: Number((data as any).c_informasi || ""),
        c_blokir: Number((data as any).c_blokir || ""),
        c_takeover: Number((data as any).c_takeover || ""),
        cabang: String((data as any).cabang || "").trim(),
        user: String((data as any).user || "").trim(),
        user_position: String((data as any).user_position || "").trim(),
        user_cabang: String((data as any).user_cabang || "").trim(),
        user_area: String((data as any).user_area || "").trim(),
      };
    }
    return NextResponse.json(
      { message: "File berhasil diproses!", data: jsonData },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses file!" },
      { status: 500 },
    );
  }
};
