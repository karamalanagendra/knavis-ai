import Link from "next/link";

const LINKS: Record<string,string[]> = {
  Platform:  ["Protocol Authoring","Site Feasibility","Explainable AI","Amendment Prevention","Integrations"],
  Company:   ["About Us","Our Story","Careers","Press","Contact"],
  Resources: ["Documentation","Blog","Case Studies","Changelog","FAQ"],
  Legal:     ["Privacy Policy","Terms of Service","Security","HIPAA Compliance"],
};

export default function Footer() {
  return (
    <footer style={{ background:"var(--bg2)", borderTop:"1px solid var(--border)", padding:"80px 24px 40px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:"48px", marginBottom:"64px" }}>
          <div>
            <Link href="/" style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px", textDecoration:"none" }}>
              <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:"linear-gradient(135deg,#00D4FF,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"14px", fontWeight:700, color:"#fff" }}>P</span>
              </div>
              <span style={{ fontSize:"16px", fontWeight:800, letterSpacing:"-0.03em", color:"#fff" }}>Protocol<span style={{color:"var(--accent)"}}>IQ</span></span>
            </Link>
            <p style={{ fontSize:"14px", color:"var(--muted)", lineHeight:1.7, maxWidth:"240px", marginBottom:"20px" }}>The AI-native platform accelerating clinical trials from protocol design to regulatory submission.</p>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"var(--muted)" }}>knavis-ai.com</div>
          </div>
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#fff", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"16px", fontFamily:"'JetBrains Mono',monospace" }}>{title}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {links.map(l => <Link key={l} href="#" style={{ fontSize:"13px", color:"var(--muted)", textDecoration:"none" }}>{l}</Link>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ width:"100%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", marginBottom:"28px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
          <span style={{ fontSize:"13px", color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace" }}>© 2025 ProtocolIQ · knavis-ai.com · All rights reserved</span>
          <div style={{ display:"flex", gap:"20px" }}>
            {["Twitter/X","LinkedIn","GitHub"].map(s => <Link key={s} href="#" style={{ fontSize:"13px", color:"var(--muted)", textDecoration:"none" }}>{s}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
