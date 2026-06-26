import { getContainerClient, sharedKeyCredential } from "@/libs/Azure";
import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { NextRequest, NextResponse } from "next/server";

const folderName = process.env.NEXT_PUBLIC_APP_FOLDER!;
const nestedFolderName = process.env.NEXT_PUBLIC_APP_NESTED_FOLDER!;
const containerClient = getContainerClient();

function safeFileName(filename: string) {
  const ext = filename.split(".").pop();
  const nameOnly = filename.replace(/\.[^/.]+$/, "");

  const cleanName = nameOnly
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "");

  return `${cleanName}_${Date.now()}.${ext}`;
}

export const POST = async (req: NextRequest) => {
  try {
    const { filename, filetype } = await req.json();

    if (!filename) {
      return NextResponse.json(
        { message: "Filename required", status: 400 },
        { status: 400 },
      );
    }

    const finalFilename = safeFileName(filename);

    const blobName = `${folderName}/${nestedFolderName}/${finalFilename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const startsOn = new Date();
    startsOn.setMinutes(startsOn.getMinutes() - 5);

    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + 15);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: containerClient.containerName,
        blobName,
        permissions: BlobSASPermissions.parse("cw"),
        startsOn,
        expiresOn,
      },
      sharedKeyCredential,
    ).toString();

    const uploadUrl = `${blockBlobClient.url}?${sasToken}`;

    return NextResponse.json(
      {
        status: 200,
        uploadUrl,
        secure_url: blockBlobClient.url,
        blobName,
        contentType: filetype,
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
