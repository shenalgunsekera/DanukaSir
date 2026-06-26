import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n";
import { BrandProvider } from "@/lib/brand";
import { SITE } from "@/lib/site-config";
import { getProfile } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.name || "Tutor";
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${name} — ${profile.headline ? "Private Tutoring" : SITE.tagline}`,
      template: `%s · ${name}`,
    },
    description: profile.headline || SITE.description,
    keywords: ["tutor", "private tutor", "exam preparation", "student progress", name],
    openGraph: {
      title: `${name} — ${SITE.tagline}`,
      description: profile.headline || SITE.description,
      type: "website",
      url: SITE.url,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body
        className="font-sans antialiased"
        style={{ ["--bg" as any]: profile.theme?.bgColor || "#0A0A0A" }}
      >
        <BrandProvider name={profile.name}>
        <AuthProvider>
          <LanguageProvider>
          <div className="relative z-[2]">{children}</div>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "rgba(18,18,22,0.92)",
                color: "#f5f5f3",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#f4f4f4", secondary: "#000" } },
            }}
          />
          </LanguageProvider>
        </AuthProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
