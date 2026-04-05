"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#06060F; --bg2:#0B0B1A; --surface:#0E0E1C; --srf2:#131325;
      --border:rgba(255,255,255,0.065); --text:#EEEEFF;
      --muted:#64648A; --muted2:#9090B0;
      --accent:#00D4FF; --violet:#7C3AED; --green:#00FF94; --orange:#FF8A3D; --red:#FF5E7A;
    }
    html { scroll-behavior: smooth; }
    body { background:var(--bg); color:var(--text); font-family:'Outfit',sans-serif; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
    ::selection { background:rgba(0,212,255,0.2); }
    ::-webkit-scrollbar { width:3px; }
    ::-webkit-scrollbar-thumb { background:var(--violet); border-radius:2px; }
    @keyframes shimmer { from{background-position:-300% center} to{background-position:300% center} }
    @keyframes glow    { 0%,100%{opacity:0.5} 50%{opacity:1} }
    @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes gridpulse { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
    @keyframes scan    { 0%{top:0%;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0} }
    .shimmer { background:linear-gradient(90deg,#00FF94,#00D4FF,#7C3AED,#00FF94); background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
    .hover-lift { transition:all 0.3s cubic-bezier(0.22,1,0.36,1); }
    .hover-lift:hover { transform:translateY(-3px); }
    @media(max-width:768px){.desktop-nav{display:none!important;}.mobile-menu-btn{display:block!important;} .hero-grid{grid-template-columns:1fr!important;} section{padding-left:16px!important;padding-right:16px!important;}}
  `}</style>
);

const Label = ({ children, color = "var(--accent)" }) => (
  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"12px" }}>◆ {children}</div>
);

const GridBg = () => (
  <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
    <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle,rgba(0,212,255,0.06) 1px,transparent 1px)`, backgroundSize:"30px 30px", animation:"gridpulse 7s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,255,148,0.25),transparent)", animation:"scan 9s linear infinite", top:0 }}/>
    <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:"800px", height:"500px", background:"radial-gradient(ellipse,rgba(124,58,237,0.08),transparent 70%)", filter:"blur(60px)" }}/>
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label:"Platform",  href:"/#platform"   },
    { label:"Solutions", href:"/#flagship"   },
    { label:"Services",  href:"/#services"   },
    { label:"Agents",    href:"/#multiagent" },
    { label:"About Us",  href:"/about"       },
  ];
  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 20px",
        background: scrolled||menuOpen ? "rgba(6,6,15,0.97)" : "transparent",
        backdropFilter: scrolled||menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled||menuOpen ? "1px solid var(--border)" : "1px solid transparent",
        transition:"all 0.3s" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:"64px" }}>
          <a href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
            <img src="/knavis-logo.png" alt="KNavis Systems" style={{ height:"60px", width:"auto", display:"block", borderRadius:"10px", mixBlendMode:"lighten", filter:"brightness(1.05) contrast(1.05)" }}/>
          </a>
          <div className="desktop-nav" style={{ display:"flex", gap:"2px" }}>
            {links.map(l => (
              <a key={l.label} href={l.href} style={{ padding:"6px 12px", color: l.href==="/about"?"#fff":"var(--muted)", fontSize:"13px", fontWeight:500, textDecoration:"none", borderRadius:"6px", background: l.href==="/about"?"rgba(255,255,255,0.06)":"transparent" }}>{l.label}</a>
            ))}
          </div>
          <a href="/demo" className="desktop-nav" style={{ padding:"8px 18px", background:"rgba(0,255,148,0.08)", border:"1px solid rgba(0,255,148,0.3)", borderRadius:"8px", color:"#fff", fontSize:"12px", fontWeight:600, textDecoration:"none" }}>Book a Demo →</a>
          <button onClick={() => setMenuOpen(o=>!o)} className="mobile-menu-btn" style={{ display:"none", background:"transparent", border:"none", cursor:"pointer", padding:"8px", color:"#fff", fontSize:"20px", lineHeight:1 }}>{menuOpen?"✕":"☰"}</button>
        </div>
      </nav>
      {menuOpen && (
        <div style={{ position:"fixed", top:"64px", left:0, right:0, zIndex:99, background:"rgba(6,6,15,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", padding:"16px 20px 24px" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={()=>setMenuOpen(false)} style={{ display:"block", padding:"13px 8px", color:"var(--muted2)", fontSize:"16px", fontWeight:500, textDecoration:"none", borderBottom:"1px solid var(--border)" }}>{l.label}</a>
          ))}
          <a href="/demo" onClick={()=>setMenuOpen(false)} style={{ display:"block", marginTop:"16px", textAlign:"center", padding:"13px", background:"rgba(0,255,148,0.08)", border:"1px solid rgba(0,255,148,0.3)", borderRadius:"8px", color:"#fff", fontSize:"14px", fontWeight:600, textDecoration:"none" }}>Book a Demo →</a>
        </div>
      )}
    </>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const s = i => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{delay:0.1+i*0.12,duration:0.8,ease:[0.22,1,0.36,1]} });
  return (
    <section style={{ position:"relative", padding:"140px 24px 100px", overflow:"hidden" }}>
      <GridBg />
      <div style={{ position:"relative", zIndex:1, maxWidth:"900px", margin:"0 auto", textAlign:"center" }}>
        <motion.div {...s(0)}><Label>About KNavis</Label></motion.div>
        <motion.h1 {...s(1)} style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:"clamp(36px,6vw,72px)", lineHeight:1.05, letterSpacing:"-0.04em", marginBottom:"24px" }}>
          Built from inside<br/>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", fontWeight:400, fontSize:"0.88em", color:"var(--muted2)" }}>clinical trials,</span>{" "}
          <span className="shimmer">not above them</span>
        </motion.h1>
        <motion.p {...s(2)} style={{ fontSize:"18px", color:"var(--muted2)", lineHeight:1.8, maxWidth:"640px", margin:"0 auto 40px" }}>
          KNavis is an AI-native clinical technology company. We build platforms and services that accelerate
          drug development — grounded in 18+ years of hands-on clinical trial expertise and 5 US patents in
          clinical data automation and agentic AI.
        </motion.p>
        <motion.div {...s(3)} style={{ display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:"center" }}>
          <a href="#mission" style={{ padding:"12px 28px", background:"rgba(0,255,148,0.08)", border:"1px solid rgba(0,255,148,0.3)", borderRadius:"9px", color:"#fff", fontSize:"14px", fontWeight:700, textDecoration:"none" }}>Our Mission →</a>
          <a href="/demo" style={{ padding:"12px 24px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"9px", color:"#bbb", fontSize:"14px", fontWeight:500, textDecoration:"none" }}>Book a Demo</a>
        </motion.div>
      </div>
    </section>
  );
};

// ─── COMPANY STATS ────────────────────────────────────────────────────────────
const Stats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <section ref={ref} style={{ padding:"0 24px 80px" }}>
      <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6}}
          style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", background:"var(--surface)", border:"1px solid rgba(0,255,148,0.15)", borderRadius:"16px", overflow:"hidden" }}>
          {[
            { n:"18+",  l:"Years clinical expertise", c:"var(--green)"  },
            { n:"5",    l:"US Patents",               c:"var(--accent)" },
            { n:"1M+",  l:"Real trials analysed",     c:"var(--violet)" },
            { n:"3×",   l:"Innovator of the Year",    c:"var(--green)"  },
            { n:"7+",   l:"Global data sources",      c:"var(--accent)" },
          ].map(({ n, l, c }, i, arr) => (
            <div key={n} style={{ padding:"28px 20px", textAlign:"center", borderRight: i<arr.length-1?"1px solid var(--border)":"none" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"28px", fontWeight:900, color:c, letterSpacing:"-0.04em" }}>{n}</div>
              <div style={{ fontSize:"12px", color:"var(--muted)", marginTop:"4px" }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─── WHO WE ARE ───────────────────────────────────────────────────────────────
const WhoWeAre = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  return (
    <section ref={ref} style={{ padding:"80px 24px", background:"var(--bg2)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.2),transparent)" }}/>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
          <motion.div initial={{opacity:0,x:-24}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.8}}>
            <Label>Who We Are</Label>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,42px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:"20px" }}>
              A clinical AI company<br/>
              <span style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", fontWeight:400, color:"var(--muted2)" }}>built by practitioners</span>
            </h2>
            <p style={{ fontSize:"15px", color:"var(--muted2)", lineHeight:1.8, marginBottom:"20px" }}>
              KNavis was founded with one conviction: clinical AI is only as good as the clinical knowledge behind it.
              We are not a technology company that learned pharma. We are a clinical organisation that mastered AI.
            </p>
            <p style={{ fontSize:"15px", color:"var(--muted2)", lineHeight:1.8 }}>
              Our team brings senior-level expertise across the full drug development lifecycle — from protocol design
              and CDM through regulatory submission and post-market surveillance — combined with deep expertise in
              LLMs, multi-agent systems, RAG pipelines, and agentic AI architectures.
            </p>
          </motion.div>
          <motion.div initial={{opacity:0,x:24}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:0.2,duration:0.8}}>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {[
                { icon:"🔬", title:"Clinical-First Design", desc:"Every feature starts with a clinical workflow problem, not a technology capability. We automate what practitioners actually need automated.", accent:"var(--green)" },
                { icon:"🛡️", title:"Regulatory Integrity", desc:"ICH E6(R2), CDISC, FDA/EMA compliance is embedded in everything we build — not bolted on as an afterthought.", accent:"var(--accent)" },
                { icon:"🤝", title:"Human-in-the-Loop", desc:"Our AI accelerates clinical teams, not replaces them. Every workflow preserves expert judgment where it matters most.", accent:"var(--violet)" },
                { icon:"🔍", title:"Full Explainability", desc:"Every AI output carries a traceable citation chain from raw data to final recommendation. No black boxes — ever.", accent:"var(--green)" },
              ].map(item => (
                <div key={item.title} style={{ display:"flex", gap:"14px", alignItems:"flex-start", padding:"16px 18px", background:"var(--surface)", borderRadius:"12px", border:"1px solid var(--border)", borderLeft:`2px solid ${item.accent}` }}>
                  <span style={{ fontSize:"20px", flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:"14px", fontWeight:700, color:"#fff", marginBottom:"4px" }}>{item.title}</div>
                    <div style={{ fontSize:"13px", color:"var(--muted2)", lineHeight:1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── WHAT WE BUILD ────────────────────────────────────────────────────────────
const WhatWeBuild = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  return (
    <section ref={ref} style={{ padding:"100px 24px" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6}} style={{ textAlign:"center", marginBottom:"56px" }}>
          <Label color="var(--green)">What We Build</Label>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,44px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1 }}>
            Two ways we <span className="shimmer">accelerate</span> trials
          </h2>
        </motion.div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
          {[
            {
              tag:"Platform", icon:"⬡", accent:"#00D4FF",
              title:"ProtocolIQ",
              desc:"An AI-native SaaS platform unifying protocol authoring, site feasibility scoring, regulatory intelligence, and clinical data management. Five specialised AI agents. Seven global data sources. One workspace.",
              features:["Protocol authoring in <10 minutes","Site feasibility across 15+ dimensions","5 Claude-powered AI agents","pgvector RAG pipeline","Full citation chain per output"],
              cta:"Explore the Platform", href:"/#platform",
            },
            {
              tag:"Services", icon:"✦", accent:"#00FF94",
              title:"CRO Programming Services",
              desc:"Expert-led, AI-augmented clinical programming services — SDTM, ADaM, TFLs, Define.xml, and regulatory submission support. Senior SME oversight with AI execution speed. Submission-ready in ~2 weeks.",
              features:["SDTM & ADaM programming","Tables, Listings & Figures (TFLs)","eCTD submission support","Oncology, Rare Disease, ISS/ISE","2-week sprint delivery model"],
              cta:"View Services", href:"/#services",
            },
          ].map(item => (
            <motion.div key={item.tag}
              initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
              transition={{delay:item.tag==="Platform"?0.1:0.2, duration:0.7, ease:[0.22,1,0.36,1]}}
              style={{ background:"var(--surface)", border:`1px solid ${item.accent}25`, borderRadius:"18px", padding:"36px 32px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg,transparent,${item.accent},transparent)` }}/>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:`${item.accent}15`, border:`1px solid ${item.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", color:item.accent }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:"10px", color:item.accent, fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase" }}>{item.tag}</div>
                  <div style={{ fontSize:"18px", fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{item.title}</div>
                </div>
              </div>
              <p style={{ fontSize:"14px", color:"var(--muted2)", lineHeight:1.75, marginBottom:"24px" }}>{item.desc}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"24px" }}>
                {item.features.map(f => (
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ color:item.accent, fontSize:"11px" }}>✓</span>
                    <span style={{ fontSize:"13px", color:"var(--muted2)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href={item.href} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"10px 20px", background:`${item.accent}12`, border:`1px solid ${item.accent}30`, borderRadius:"8px", color:item.accent, fontSize:"13px", fontWeight:600, textDecoration:"none" }}>{item.cta} →</a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── OUR EDGE ─────────────────────────────────────────────────────────────────
const OurEdge = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  return (
    <section ref={ref} style={{ padding:"100px 24px", background:"var(--bg2)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,255,148,0.2),transparent)" }}/>
      <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6}} style={{ textAlign:"center", marginBottom:"52px" }}>
          <Label color="var(--green)">Our Edge</Label>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,44px)", fontWeight:800, letterSpacing:"-0.03em" }}>
            Why KNavis is different
          </h2>
          <p style={{ fontSize:"15px", color:"var(--muted2)", marginTop:"16px", maxWidth:"520px", margin:"16px auto 0", lineHeight:1.7 }}>
            The difference between clinical AI that works and clinical AI that gets rejected starts with who built it.
          </p>
        </motion.div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
          {[
            { n:"01", title:"18+ years inside clinical trials", desc:"Not reading about them. Not consulting on them. Actually building SDTM pipelines, writing protocols, managing edit checks, and navigating FDA submissions. That experience is baked into every line of ProtocolIQ." },
            { n:"02", title:"5 US patents in clinical AI", desc:"Our IP covers SDTM automation, adaptive TFL generation, protocol deviation detection, and agentic orchestration — innovations earned through solving real problems, not hypothetical ones." },
            { n:"03", title:"Domain knowledge as a competitive moat", desc:"Generic LLMs don't know why ICH E6(R2) matters or how a single endpoint flaw triggers a $20M amendment. Our systems do. That difference is the product." },
            { n:"04", title:"Speed without compromising compliance", desc:"We deliver CDISC programming packages in ~2 weeks and protocol drafts in under 10 minutes — while maintaining the regulatory integrity that regulators actually inspect against." },
          ].map((item, i) => (
            <motion.div key={item.n}
              initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
              transition={{delay:i*0.1,duration:0.6,ease:[0.22,1,0.36,1]}}
              style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"14px", padding:"28px 24px" }}>
              <div style={{ fontFamily:"monospace", fontSize:"28px", fontWeight:900, color:"rgba(0,255,148,0.15)", letterSpacing:"-0.04em", marginBottom:"12px" }}>{item.n}</div>
              <h3 style={{ fontSize:"16px", fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:"10px" }}>{item.title}</h3>
              <p style={{ fontSize:"13px", color:"var(--muted2)", lineHeight:1.7 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── MISSION ──────────────────────────────────────────────────────────────────
const Mission = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  return (
    <section id="mission" ref={ref} style={{ padding:"100px 24px", position:"relative", overflow:"hidden" }}>
      <GridBg />
      <div style={{ position:"relative", zIndex:1, maxWidth:"760px", margin:"0 auto", textAlign:"center" }}>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}}>
          <Label color="var(--green)">Our Mission</Label>
          <h2 style={{ fontSize:"clamp(24px,4.5vw,54px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1.05, marginBottom:"24px" }}>
            Accelerate the journey from<br/>
            <span className="shimmer">molecule to market</span>
          </h2>
          <p style={{ fontSize:"17px", color:"var(--muted2)", lineHeight:1.8, marginBottom:"48px", maxWidth:"580px", margin:"0 auto 48px" }}>
            Every delayed trial is a delayed treatment. Every unnecessary amendment costs months of clinical progress.
            KNavis exists to eliminate the manual, error-prone work that slows clinical development —
            so researchers can focus on what only humans can do: judgment, creativity, and care.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", marginBottom:"48px" }}>
            {[
              { icon:"⬡", title:"Evidence-First",       desc:"Every AI output is grounded in real data. Full citations. No hallucinations.", accent:"var(--green)"  },
              { icon:"◎", title:"Domain-Native",         desc:"Built by clinical experts. Designed for clinical teams. No translation needed.", accent:"var(--accent)" },
              { icon:"△", title:"Human-in-the-Loop",     desc:"AI accelerates. Humans decide. Expert judgment is always preserved.", accent:"var(--violet)" },
            ].map(v => (
              <div key={v.title} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"12px", padding:"24px 20px", textAlign:"center" }}>
                <div style={{ fontSize:"22px", color:v.accent, marginBottom:"10px" }}>{v.icon}</div>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#fff", marginBottom:"6px" }}>{v.title}</div>
                <div style={{ fontSize:"12px", color:"var(--muted2)", lineHeight:1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/demo" style={{ padding:"14px 32px", background:"rgba(0,255,148,0.08)", border:"1px solid rgba(0,255,148,0.3)", borderRadius:"10px", color:"#fff", fontSize:"15px", fontWeight:700, textDecoration:"none" }}>Book a Demo</a>
            <a href="/#platform" style={{ padding:"14px 28px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#bbb", fontSize:"15px", fontWeight:500, textDecoration:"none" }}>Explore the Platform →</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ borderTop:"1px solid var(--border)", padding:"28px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px", background:"var(--bg2)" }}>
    <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
      <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:"linear-gradient(135deg,#00D4FF,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:"12px", fontWeight:700, color:"#fff" }}>P</span>
      </div>
      <span style={{ fontFamily:"monospace", fontSize:"12px", color:"var(--muted)" }}>© 2025 ProtocolIQ · knavis-ai.com</span>
    </div>
    <div style={{ display:"flex", gap:"24px" }}>
      {["Home","Platform","Services","Demo"].map(l => (
        <a key={l} href={l==="Home"?"/":`/${l.toLowerCase()}`} style={{ fontSize:"13px", color:"var(--muted)", textDecoration:"none" }}>{l}</a>
      ))}
    </div>
  </footer>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"'Outfit',sans-serif" }}>
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <WhoWeAre />
        <WhatWeBuild />
        <OurEdge />
        <Mission />
      </main>
      <Footer />
    </div>
  );
}
