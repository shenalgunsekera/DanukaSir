"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrand } from "@/lib/brand";
import { LanguageToggle } from "./LanguageToggle";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#success", label: "Success" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/notes", label: "Notes" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { name } = useBrand();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container-px">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5",
            scrolled ? "glass-strong shadow-card" : "border border-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-grad text-black">
              <GraduationCap size={18} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-cloud">
              {name}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-mist transition-colors hover:bg-white/5 hover:text-cloud"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-cloud md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass-strong mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-mist hover:bg-white/5 hover:text-cloud"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
