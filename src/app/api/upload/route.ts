import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────
//  File upload — two backends, chosen automatically:
//
//  1. Vercel Blob (when BLOB_READ_WRITE_TOKEN is present, i.e. on
//     Vercel with a Blob store linked). Free tier, works on the
//     serverless / read-only filesystem.
//  2. Local folder store (public/uploads/...) for self-hosting and
//     local dev, where the filesystem is writable.
//
//  Either way a random token is added to the filename so paths are
//  not guessable.
// ─────────────────────────────────────────────────────────────

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_FOLDERS = new Set(["notes", "previews", "slips", "images", "misc"]);

function safeName(name: string) {
  const base = path.basename(name).replace(/[^\w.\-]+/g, "_");
  return base.slice(-80) || "file";
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart/form-data." }, { status: 400 });
  }

  const file = form.get("file");
  const folderRaw = String(form.get("folder") || "misc").toLowerCase();
  const folder = ALLOWED_FOLDERS.has(folderRaw) ? folderRaw : "misc";

  if (!(file instanceof Blob)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File exceeds the 20MB limit." }, { status: 413 });
  }

  const originalName = (file as File).name || "upload";
  const contentType = (file as File).type || "application/octet-stream";
  const token = randomBytes(8).toString("hex");
  const fileName = `${Date.now()}-${token}-${safeName(originalName)}`;

  try {
    // 1) Vercel Blob (managed, free tier) when available.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${folder}/${fileName}`, file, {
        access: "public",
        contentType,
        addRandomSuffix: false,
      });
      return NextResponse.json({ ok: true, url: blob.url, name: originalName, size: file.size });
    }

    // 2) Local folder store (writable filesystem).
    const { mkdir, writeFile } = await import("fs/promises");
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, fileName), buffer);
    return NextResponse.json({ ok: true, url: `/uploads/${folder}/${fileName}`, name: originalName, size: file.size });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Storage write failed: " + (e?.message || "unknown error") },
      { status: 500 }
    );
  }
}
