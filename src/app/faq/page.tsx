"use client";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <h1 style={{ fontFamily:"'JetBrains Mono',monospace", color:"var(--accent)", fontSize:"24px" }}>FAQ</h1>
        <p style={{ color:"var(--muted)", marginTop:"12px" }}>Coming soon — see <Link href="/#faq" style={{color:"var(--accent)"}}>FAQ section on homepage</Link></p>
      </div>
    </div>
  );
}
