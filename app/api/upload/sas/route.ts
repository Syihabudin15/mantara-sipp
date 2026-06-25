import { getContainerClient, sharedKeyCredential } from "@/libs/Azure";
import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { NextRequest, NextResponse } from "next/server";

const folderName = process.env.NEXT_PUBLIC_APP_FOLDER!;
const nestedFolderName = process.env.NEXT_PUBLIC_APP_NESTED_FOLDER!;
const containerClient = getContainerClient();

export const POST = async (req: NextRequest) => {
  try {
    const { filename, filetype } = await req.json();

    if (!filename) {
      return NextResponse.json(
        { message: "Filename required", status: 400 },
        { status: 400 },
      );
    }

    // 1. Tentukan path file di Azure
    const blobName = `${folderName}/${nestedFolderName}/${filename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // 2. Set waktu kedaluwarsa token (misal: berlaku 15 menit saja)
    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + 15);

    // 3. Buat Hak Akses (Hanya boleh "Write/Upload")
    const sasPermissions = new BlobSASPermissions();
    sasPermissions.write = true;

    // 4. Generate token SAS menggunakan credential internal Azure
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: containerClient.containerName,
        blobName: blobName,
        permissions: sasPermissions,
        expiresOn: expiresOn,
        startsOn: new Date(),
      },
      sharedKeyCredential, // 🔥 Gunakan langsung di sini, tanpa lewat containerClient
    ).toString();

    // 5. Gabungkan URL Blob asli dengan SAS Token
    const uploadUrl = `${blockBlobClient.url}?${sasToken}`;

    return NextResponse.json(
      {
        status: 200,
        uploadUrl, // URL khusus untuk dipakai di frontend
        secure_url: blockBlobClient.url, // URL bersih untuk disimpan ke database MySQL Anda nanti
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: 500, message: "Failed to generate SAS token" },
      { status: 500 },
    );
  }
};
