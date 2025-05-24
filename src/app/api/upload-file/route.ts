import { b2 } from "../../../lib/b2"
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await b2.authorize();

    const { data: uploadData } = await b2.getUploadUrl({
      // bucketId: process.env.B2_BUCKET_ID!,
      bucketId: "bbff04e19a9ef1c0926e081a",
    });

    await b2.uploadFile({
      uploadUrl: uploadData.uploadUrl,
      uploadAuthToken: uploadData.authorizationToken,
      fileName: file.name, // no need for encodeURIComponent here
      data: buffer,
      contentType: file.type || 'application/octet-stream',
      hash: 'do_not_verify',
    });

    // Generate signed download URL for private access
    const { data: authData } = await b2.getDownloadAuthorization({
      // bucketId: process.env.B2_BUCKET_ID!,
      bucketId: "bbff04e19a9ef1c0926e081a",
      fileNamePrefix: file.name,
      validDurationInSeconds: 3600, // 1 hour
    });

    const signedUrl = `https://f004.backblazeb2.com/file/tasks-bucket/${encodeURIComponent(file.name)}?Authorization=${authData.authorizationToken}`;

    return NextResponse.json({
      bucketName: "tasks-bucket",
      fileName: file.name,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}