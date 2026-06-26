"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { uploadFile } from "@/lib/upload";

/** Pick an image from the device, upload it to the folder store, and return
 *  the served URL. Shows a live avatar preview. */
export function ImagePicker({
  name,
  value,
  onChange,
  label = "Photo",
  size = 72,
}: {
  name: string;
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  size?: number;
}) {
  const [busy, setBusy] = useState(false);

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB.");
      return;
    }
    setBusy(true);
    try {
      const res = await uploadFile(file, "images");
      onChange(res.url);
      toast.success("Image uploaded.");
    } catch (e: any) {
      toast.error(e?.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name || "?"} src={value} size={size} ring />
      <div>
        <span className="label-field">{label}</span>
        <div className="flex items-center gap-2">
          <label className="btn-ghost !py-2.5 cursor-pointer">
            <Upload size={15} /> {busy ? "Uploading…" : value ? "Change image" : "Choose image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ash transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-ash">JPG or PNG, up to 8MB — saved to your site automatically.</p>
      </div>
    </div>
  );
}
