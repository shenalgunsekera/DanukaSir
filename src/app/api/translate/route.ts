import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Server-side translation proxy. Translates an array of strings to the target
// language and caches results in-process so repeated text (and repeat visits)
// don't re-hit the upstream service. No API key required.
//
// This powers the site-wide "Translate" toggle which walks the live DOM, so
// ANY text — including reviews/comments added later — gets translated with no
// hardcoded dictionaries.

const cache = new Map<string, string>(); // key: `${target}:${text}` -> translation

async function translateOne(text: string, target: string): Promise<string> {
  const key = `${target}:${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
    encodeURIComponent(target) +
    "&dt=t&q=" +
    encodeURIComponent(text);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = (await res.json()) as any;
    // data[0] is an array of [translatedChunk, originalChunk, ...]
    const out: string = Array.isArray(data?.[0])
      ? data[0].map((seg: any[]) => seg?.[0] ?? "").join("")
      : text;
    const translated = out || text;
    cache.set(key, translated);
    return translated;
  } catch {
    return text; // graceful fallback: leave original text
  }
}

// Limited-concurrency map to be polite to the upstream endpoint.
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

export async function POST(req: Request) {
  let body: { q?: unknown; target?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const target = typeof body.target === "string" ? body.target : "si";
  const q = Array.isArray(body.q) ? body.q.filter((x): x is string => typeof x === "string") : [];

  if (!q.length) return NextResponse.json({ t: [] });
  if (q.length > 400) return NextResponse.json({ error: "Too many strings" }, { status: 413 });

  const t = await mapPool(q, 6, (text) => translateOne(text, target));
  return NextResponse.json({ t });
}
