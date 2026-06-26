import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Node runtime — we write uploaded files to the local filesystem.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────
//  Free, folder-based file store.
//  Images & documents are written into the app's own
//  `public/uploads/<folder>/` directory and served as static files
//  at `/uploads/...`. No Firebase Storage (and no billing) required.
//  A random token is added to every filename so the path is not
//  guessable — paid note files stay effectively private until the
//  download link is revealed after payment approval.
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
  const token = randomBytes(8).toString("hex");
  const fileName = `${Date.now()}-${token}-${safeName(originalName)}`;

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), buffer);

  const url = `/uploads/${folder}/${fileName}`;
  return NextResponse.json({ ok: true, url, name: originalName, size: file.size });
}
