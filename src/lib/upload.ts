"use client";

export interface UploadResult {
  url: string;
  name: string;
  size: number;
}

/** Uploads a file to the app's own folder store (`/api/upload` → public/uploads).
 *  Free, no Firebase Storage / billing required. Returns a static URL the
 *  browser can load directly. */
export async function uploadFile(file: File | Blob, folder: string): Promise<UploadResult> {
  const fd = new FormData();
  const name = (file as File).name || "upload";
  fd.append("file", file, name);
  fd.append("folder", folder);

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Upload failed.");
  }
  return { url: data.url as string, name: data.name as string, size: data.size as number };
}

/** Builds a small preview PDF containing only the first `maxPages` pages of a
 *  PDF file, uploads it to the folder store, and reports the total page count.
 *  The full document is never exposed here — only this trimmed preview is. */
export async function makePdfPreview(
  file: File,
  maxPages = 2
): Promise<{ previewUrl: string; total: number; shown: number }> {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const shown = Math.min(maxPages, total);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, Array.from({ length: shown }, (_, i) => i));
  pages.forEach((p) => out.addPage(p));
  const outBytes = await out.save();

  const previewFile = new File([outBytes as unknown as BlobPart], `preview-${file.name}`, { type: "application/pdf" });
  const { url } = await uploadFile(previewFile, "previews");
  return { previewUrl: url, total, shown };
}
