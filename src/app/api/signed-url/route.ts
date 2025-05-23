import { b2 } from "../../../lib/b2"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Invalid or missing file path" }, { status: 400 });
    }

    const [bucketName, ...fileParts] = path.split("/");
    const fileName = fileParts.join("/");

    if (!bucketName || !fileName) {
      return NextResponse.json({ error: "Invalid path format" }, { status: 400 });
    }

    await b2.authorize();

    const { data: authData } = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID!,
      fileNamePrefix: fileName,
      validDurationInSeconds: 3600, // 1 hour
    });

    const signedUrl = `https://f004.backblazeb2.com/file/${bucketName}/${encodeURIComponent(fileName)}?Authorization=${authData.authorizationToken}`;

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}
