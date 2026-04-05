import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ProtocolIQ — AI-Native Clinical Trial Platform", template: "%s | ProtocolIQ" },
  description: "ProtocolIQ is the first AI-native platform unifying protocol authoring, site feasibility scoring, and regulatory intelligence — backed by 18+ years of clinical expertise.",
  keywords: ["clinical trial protocol","AI protocol authoring","site feasibility","clinical AI","ProtocolIQ","knavis-ai","CDISC","SDTM","ADaM"],
  authors: [{ name: "Nagendra Kumar K", url: "https://knavis-ai.com" }],
  openGraph: {
    title: "ProtocolIQ — AI-Native Clinical Trial Platform",
    description: "Design smarter protocols. Score site feasibility. Prevent amendments. In minutes, not months.",
    url: "https://knavis-ai.com", siteName: "ProtocolIQ", type: "website",
  },
  twitter: { card: "summary_large_image", title: "ProtocolIQ — AI-Native Clinical Trial Platform", description: "Design smarter protocols. Score site feasibility. Prevent amendments." },
  metadataBase: new URL("https://knavis-ai.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
