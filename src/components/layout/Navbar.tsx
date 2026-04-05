"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Platform",    href: "/platform" },
  { label: "Feasibility", href: "/platform#feasibility" },
  { label: "About",       href: "/about" },
  { label: "Blog",        href: "/blog" },
  { label: "FAQ",         href: "/#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 32px",
      background: scrolled ? "rgba(6,6,15,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition:"all 0.3s" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:"68px" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:"linear-gradient(135deg,#00D4FF,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 16px rgba(0,212,255,0.25)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"14px", fontWeight:700, color:"#fff" }}>P</span>
          </div>
          <div>
            <div style={{ fontSize:"16px", fontWeight:800, letterSpacing:"-0.03em", color:"#fff" }}>Protocol<span style={{color:"var(--accent)"}}>IQ</span></div>
            <div style={{ fontSize:"9px", color:"var(--muted)", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace" }}>knavis-ai.com</div>
          </div>
        </Link>
        <div style={{ display:"flex", gap:"2px" }}>
          {NAV_LINKS.map(link => (
            <Link key={link.label} href={link.href} style={{ padding:"6px 14px", color: pathname===link.href ? "#fff" : "var(--muted)", fontSize:"14px", fontWeight:500, textDecoration:"none", borderRadius:"6px", background: pathname===link.href ? "rgba(255,255,255,0.06)" : "transparent", transition:"all 0.2s" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <Link href="https://app.knavis-ai.com" style={{ padding:"7px 16px", color:"var(--muted)", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>Sign in</Link>
          <Link href="/demo" style={{ padding:"9px 22px", background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(124,58,237,0.15))", border:"1px solid rgba(0,212,255,0.3)", borderRadius:"8px", color:"#fff", fontSize:"13px", fontWeight:600, textDecoration:"none" }}>Book a Demo →</Link>
        </div>
      </div>
    </nav>
  );
}
