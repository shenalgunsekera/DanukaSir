import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: number | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", opts ?? { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(value: number | null) {
  if (!value) return "Never";
  const seconds = Math.floor((Date.now() - value) / 1000);
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let unit = "second";
  let amount = seconds;
  for (const [size, name] of units) {
    if (amount < size) {
      unit = name;
      break;
    }
    amount = Math.floor(amount / size);
  }
  if (amount <= 0) return "Just now";
  return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
}

/** Cryptographically-flavoured short code, e.g. "7K4-Q9X2" */
export function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  const pick = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${pick(3)}-${pick(4)}`;
}

/** URL-safe private token for parent links */
export function generateToken(): string {
  const part = () => Math.random().toString(36).slice(2, 10);
  return `${part()}${part()}${part()}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function average(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export function fileKind(name: string): "pdf" | "word" | "excel" | "other" {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["xls", "xlsx", "csv"].includes(ext)) return "excel";
  return "other";
}
