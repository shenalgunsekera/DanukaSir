"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Lang = "en" | "si";

interface I18nCtx {
  lang: Lang;
  busy: boolean;
  toggle: () => void;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<I18nCtx | undefined>(undefined);

const CACHE_KEY = "tr_si_cache_v1";
const LANG_KEY = "site_lang";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [busy, setBusy] = useState(false);

  // Engine state (kept in refs so it survives re-renders without re-creating)
  const dict = useRef<Record<string, string>>({}); // english(trimmed) -> sinhala
  const originals = useRef(new WeakMap<Text, string>());
  const tracked = useRef(new Set<Text>());
  const phOriginals = useRef(new WeakMap<Element, string>());
  const phTracked = useRef(new Set<Element>());
  const observer = useRef<MutationObserver | null>(null);
  const applying = useRef(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabled = useRef(false);

  // ---- helpers ----------------------------------------------------------
  const loadCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) dict.current = JSON.parse(raw);
    } catch {}
  };
  const saveCache = () => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(dict.current));
    } catch {}
  };

  const wantText = (n: Text) => {
    const v = n.nodeValue;
    if (!v) return false;
    const t = v.trim();
    if (t.length < 2) return false;
    if (!/[A-Za-z]/.test(t)) return false; // only enqueue Latin source text
    const p = n.parentElement;
    if (!p || SKIP_TAGS.has(p.tagName)) return false;
    if (p.closest("[data-no-translate]")) return false;
    return true;
  };

  const collectTextNodes = () => {
    const out: Text[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        wantText(n as Text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    let cur: Node | null;
    while ((cur = walker.nextNode())) out.push(cur as Text);
    return out;
  };

  const collectPlaceholders = () =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        "[placeholder]:not([data-no-translate]), [aria-label]:not([data-no-translate])"
      )
    );

  const fetchMissing = async (texts: string[]) => {
    const missing = texts.filter((t) => dict.current[t] === undefined);
    const unique = Array.from(new Set(missing));
    if (!unique.length) return;
    // chunk to keep requests reasonable
    for (let i = 0; i < unique.length; i += 120) {
      const batch = unique.slice(i, i + 120);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ q: batch, target: "si" }),
        });
        const data = await res.json();
        (data.t || []).forEach((tr: string, idx: number) => {
          dict.current[batch[idx]] = tr || batch[idx];
        });
      } catch {
        // leave untranslated on failure
      }
    }
    saveCache();
  };

  const applyText = (nodes: Text[]) => {
    applying.current = true;
    for (const n of nodes) {
      let orig = originals.current.get(n);
      if (orig === undefined) {
        orig = n.nodeValue ?? "";
        originals.current.set(n, orig);
      }
      const key = orig.trim();
      const tr = dict.current[key];
      if (!tr) continue;
      const lead = orig.match(/^\s*/)?.[0] ?? "";
      const trail = orig.match(/\s*$/)?.[0] ?? "";
      const next = lead + tr + trail;
      if (n.nodeValue !== next) n.nodeValue = next;
      tracked.current.add(n);
    }
    setTimeout(() => (applying.current = false), 0);
  };

  const applyPlaceholders = (els: HTMLElement[]) => {
    applying.current = true;
    for (const el of els) {
      const attr = el.hasAttribute("placeholder") ? "placeholder" : "aria-label";
      let orig = phOriginals.current.get(el);
      if (orig === undefined) {
        orig = el.getAttribute(attr) ?? "";
        phOriginals.current.set(el, orig);
      }
      const key = orig.trim();
      if (!key || !/[A-Za-z]/.test(key)) continue;
      const tr = dict.current[key];
      if (tr && el.getAttribute(attr) !== tr) el.setAttribute(attr, tr);
      phTracked.current.add(el);
    }
    setTimeout(() => (applying.current = false), 0);
  };

  const translatePass = async () => {
    const nodes = collectTextNodes();
    const phEls = collectPlaceholders();
    // record originals + gather strings
    const strings: string[] = [];
    for (const n of nodes) {
      let orig = originals.current.get(n);
      if (orig === undefined) {
        orig = n.nodeValue ?? "";
        originals.current.set(n, orig);
      }
      strings.push(orig.trim());
    }
    for (const el of phEls) {
      const attr = el.hasAttribute("placeholder") ? "placeholder" : "aria-label";
      let orig = phOriginals.current.get(el);
      if (orig === undefined) {
        orig = el.getAttribute(attr) ?? "";
        phOriginals.current.set(el, orig);
      }
      const k = orig.trim();
      if (k && /[A-Za-z]/.test(k)) strings.push(k);
    }
    await fetchMissing(strings);
    applyText(nodes);
    applyPlaceholders(phEls);
  };

  const scheduleTranslate = () => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (enabled.current) translatePass();
    }, 250);
  };

  const startObserver = () => {
    if (observer.current) return;
    observer.current = new MutationObserver((muts) => {
      if (applying.current) return;
      let relevant = false;
      for (const m of muts) {
        if (m.type === "childList" && m.addedNodes.length) relevant = true;
        if (m.type === "characterData") relevant = true;
        if (relevant) break;
      }
      if (relevant) scheduleTranslate();
    });
    observer.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  };

  const stopObserver = () => {
    observer.current?.disconnect();
    observer.current = null;
  };

  const restoreAll = () => {
    applying.current = true;
    for (const n of tracked.current) {
      if (!n.isConnected) continue;
      const orig = originals.current.get(n);
      if (orig !== undefined && n.nodeValue !== orig) n.nodeValue = orig;
    }
    for (const el of phTracked.current) {
      if (!el.isConnected) continue;
      const attr = el.hasAttribute("placeholder") ? "placeholder" : "aria-label";
      const orig = phOriginals.current.get(el);
      if (orig !== undefined) el.setAttribute(attr, orig);
    }
    setTimeout(() => (applying.current = false), 0);
  };

  // ---- public actions ---------------------------------------------------
  const enable = async () => {
    enabled.current = true;
    document.documentElement.lang = "si";
    setBusy(true);
    await translatePass();
    startObserver();
    setBusy(false);
  };

  const disable = () => {
    enabled.current = false;
    document.documentElement.lang = "en";
    stopObserver();
    restoreAll();
  };

  const setLang = (l: Lang) => {
    if (l === lang) return;
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
    if (l === "si") enable();
    else disable();
  };

  const toggle = () => setLang(lang === "en" ? "si" : "en");

  // restore persisted language on first mount
  useEffect(() => {
    loadCache();
    let saved: Lang = "en";
    try {
      saved = (localStorage.getItem(LANG_KEY) as Lang) || "en";
    } catch {}
    if (saved === "si") {
      setLangState("si");
      // let the page paint first, then translate
      const t = setTimeout(() => enable(), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<I18nCtx>(() => ({ lang, busy, toggle, setLang }), [lang, busy]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanguage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
