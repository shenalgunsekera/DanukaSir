"use client";

import { createContext, useContext, type ReactNode } from "react";

interface Brand {
  name: string;
}

const Ctx = createContext<Brand>({ name: "Tutor" });

/** Supplies the tutor's display name (set in the admin panel) to all client
 *  components so the name is never hardcoded anywhere in the UI. */
export function BrandProvider({ name, children }: { name: string; children: ReactNode }) {
  return <Ctx.Provider value={{ name: name || "Tutor" }}>{children}</Ctx.Provider>;
}

export function useBrand() {
  return useContext(Ctx);
}
