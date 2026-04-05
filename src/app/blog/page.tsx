"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── FONTS & CSS VARIABLES ────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:       #06060F;
      --bg2:      #0B0B1A;
      --surface:  #0E0E1C;
      --surface2: #131325;
      --border:   rgba(255,255,255,0.065);
      --text:     #EEEEFF;
      --muted:    #64648A;
      --muted2:   #9090B0;
      --accent:   #00D4FF;
      --violet:   #7C3AED;
      --green:    #00FF94;
      --head:     'Outfit', sans-serif;
      --serif:    'DM Serif Display', serif;
      --mono:     'JetBrains Mono', monospace;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: var(--head); overflow-x: hidden; }
    ::selection { background: rgba(0,212,255,0.2); }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: var(--violet); border-radius: 2px; }

    @keyframes ticker    { to { transform: translateX(-50%); } }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes scan      { 0%{top:0%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
    @keyframes gridpulse { 0%,100%{opacity:0.04} 50%{opacity:0.09} }
    @keyframes shimmer   { from{background-position:-200% center} to{background-position:200% center} }
    @keyframes glow-pulse{ 0%,100%{opacity:0.6} 50%{opacity:1} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes count-up  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

    .shimmer-text {
      background: linear-gradient(90deg, #00D4FF, #7C3AED, #00FF94, #00D4FF);
      background-size: 300% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }
    .card-hover { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
    .card-hover:hover { transform: translateY(-4px); }

    input[type=range] {
      -webkit-appearance: none; width: 100%; height: 4px;
      background: var(--surface2); border-radius: 2px; outline: none;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
      background: linear-gradient(135deg, #00D4FF, #7C3AED);
      cursor: pointer; box-shadow: 0 0 12px rgba(0,212,255,0.5);
      transition: box-shadow 0.2s;
    }
    input[type=range]::-webkit-slider-thumb:hover {
      box-shadow: 0 0 20px rgba(0,212,255,0.8);
    }
  `}</style>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ fontFamily:"var(--mono)", fontSize:"11px", color:"var(--accent)",
    letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"14px" }}>
    ◆ {children}
  </div>
);

const SectionHeading = ({ children, center=true }) => (
  <h2 style={{ fontSize:"clamp(30px,4.5vw,54px)", fontWeight:800,
    letterSpacing:"-0.03em", lineHeight:1.08, color:"var(--text)",
    textAlign: center ? "center" : "left" }}>
    {children}
  </h2>
);

const Divider = () => (
  <div style={{ width:"100%", height:"1px",
    background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)",
    margin:"0 auto" }} />
);

// ─── GRID BACKGROUND ──────────────────────────────────────────────────────────
const GridBg = ({ intense = false }) => (
  <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
    <div style={{
      position:"absolute", inset:0,
      backgroundImage:`radial-gradient(circle, rgba(0,212,255,${intense?0.14:0.08}) 1px, transparent 1px)`,
      backgroundSize:"30px 30px", animation:"gridpulse 7s ease-in-out infinite",
    }}/>
    <div style={{ position:"absolute", left:0, right:0, height:"1px",
      background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.35),transparent)",
      animation:"scan 8s linear infinite", top:0 }}/>
    <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
      width:"800px", height:"500px",
      background:"radial-gradient(ellipse,rgba(124,58,237,0.1) 0%,rgba(0,212,255,0.05) 40%,transparent 70%)",
      filter:"blur(60px)" }}/>
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Platform","Feasibility","About","Blog","FAQ"];
  return (
    <motion.nav initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}}
      transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
      style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 32px",
        background: scrolled ? "rgba(6,6,15,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition:"all 0.3s" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex",
        alignItems:"center", justifyContent:"space-between", height:"68px" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer" }}>
          <div style={{ position:"relative", width:"34px", height:"34px" }}>
            <div style={{ width:"34px", height:"34px", borderRadius:"9px",
              background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"var(--mono)", fontSize:"14px", fontWeight:700, color:"#fff" }}>P</span>
            </div>
            <div style={{ position:"absolute", inset:0, borderRadius:"9px",
              background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
              filter:"blur(10px)", opacity:0.35, zIndex:-1 }}/>
          </div>
          <div>
            <div style={{ fontSize:"16px", fontWeight:800, letterSpacing:"-0.03em", color:"#fff" }}>
              Protocol<span style={{ color:"var(--accent)" }}>IQ</span>
            </div>
            <div style={{ fontSize:"9px", color:"var(--muted)", letterSpacing:"0.15em",
              textTransform:"uppercase", fontFamily:"var(--mono)", lineHeight:1 }}>knavis-ai.com</div>
          </div>
        </div>
        {/* Links */}
        <div style={{ display:"flex", gap:"2px" }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ padding:"6px 14px",
              color:"var(--muted)", fontSize:"14px", fontWeight:500, textDecoration:"none",
              borderRadius:"6px", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.target.style.color="#fff";e.target.style.background="rgba(255,255,255,0.05)"}}
              onMouseLeave={e=>{e.target.style.color="var(--muted)";e.target.style.background="transparent"}}>
              {l}
            </a>
          ))}
        </div>
        {/* CTAs */}
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <a href="#" style={{ padding:"7px 16px", color:"var(--muted)", fontSize:"13px",
            fontWeight:500, textDecoration:"none", transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color="#fff"}
            onMouseLeave={e=>e.target.style.color="var(--muted)"}>Sign in</a>
          <a href="#demo" style={{ padding:"9px 22px",
            background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(124,58,237,0.15))",
            border:"1px solid rgba(0,212,255,0.3)", borderRadius:"8px",
            color:"#fff", fontSize:"13px", fontWeight:600, textDecoration:"none",
            transition:"all 0.25s" }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 24px rgba(0,212,255,0.25)";e.currentTarget.style.borderColor="rgba(0,212,255,0.6)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="rgba(0,212,255,0.3)"}}>
            Book a Demo →
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const WordCycle = () => {
  const words = ["Protocol Design","Site Feasibility","Regulatory Planning","Amendment Prevention"];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(()=>setIdx(i=>(i+1)%words.length), 2800); return ()=>clearInterval(t); }, []);
  return (
    <span style={{ position:"relative", display:"block", height:"1.15em", overflow:"hidden", textAlign:"center" }}>
      {words.map((w,i) => (
        <motion.span key={w} initial={{opacity:0,y:20}}
          animate={{opacity:i===idx?1:0, y:i===idx?0:-20}}
          transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
          style={{ position:"absolute", left:0, right:0, top:0,
            display:"block", textAlign:"center" }}
          className="shimmer-text">{w}</motion.span>
      ))}
    </span>
  );
};

const Hero = () => {
  const s = (i) => ({ initial:{opacity:0,y:28}, animate:{opacity:1,y:0},
    transition:{delay:0.15+i*0.12, duration:0.8, ease:[0.22,1,0.36,1]} });
  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex",
      flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"120px 24px 100px", overflow:"hidden" }}>
      <GridBg intense />
      {/* badge */}
      <motion.div {...s(0)} style={{ display:"inline-flex", alignItems:"center", gap:"8px",
        padding:"5px 14px 5px 8px", background:"rgba(0,212,255,0.06)",
        border:"1px solid rgba(0,212,255,0.2)", borderRadius:"100px",
        marginBottom:"28px", fontSize:"11px", fontFamily:"var(--mono)",
        color:"var(--accent)", letterSpacing:"0.06em" }}>
        <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"var(--green)",
          display:"inline-block", boxShadow:"0 0 8px var(--green)", animation:"glow-pulse 2s infinite" }}/>
        AI-Native Clinical Trial Platform · Now in Beta
      </motion.div>
      {/* headline */}
      <motion.h1 {...s(1)} style={{ fontFamily:"var(--head)", fontWeight:800,
        fontSize:"clamp(22px,2.8vw,36px)", lineHeight:1.15, letterSpacing:"-0.02em",
        textAlign:"center", maxWidth:"600px", color:"var(--text)", marginBottom:"8px" }}>
        Smarter Clinical Trials<br/>
        <span style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontWeight:400,
          fontSize:"0.88em", color:"var(--muted2)" }}>start with</span>
        <WordCycle />
      </motion.h1>
      {/* sub */}
      <motion.p {...s(2)} style={{ fontSize:"clamp(14px,1.4vw,16px)", color:"var(--muted2)",
        maxWidth:"500px", textAlign:"center", lineHeight:1.7, margin:"20px 0 36px",
        fontWeight:400 }}>
        ProtocolIQ is the first AI-native platform unifying <b style={{color:"#ccc"}}>protocol authoring</b>,{" "}
        <b style={{color:"#ccc"}}>site feasibility scoring</b>, and{" "}
        <b style={{color:"#ccc"}}>regulatory intelligence</b> — backed by 18+ years of clinical expertise.
      </motion.p>
      {/* CTAs */}
      <motion.div {...s(3)} style={{ display:"flex", gap:"14px", flexWrap:"wrap", justifyContent:"center", marginBottom:"64px" }}>
        <a href="#platform" style={{ display:"inline-flex", alignItems:"center", gap:"8px",
          padding:"14px 32px", background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
          borderRadius:"10px", color:"#fff", fontSize:"15px", fontWeight:700,
          textDecoration:"none", boxShadow:"0 0 40px rgba(0,212,255,0.22),0 0 80px rgba(124,58,237,0.12)",
          transition:"all 0.25s" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 0 60px rgba(0,212,255,0.35),0 0 100px rgba(124,58,237,0.22)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 0 40px rgba(0,212,255,0.22),0 0 80px rgba(124,58,237,0.12)"}}>
          See ProtocolIQ in Action
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <a href="#roi" style={{ display:"inline-flex", alignItems:"center", gap:"8px",
          padding:"14px 28px", background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px",
          color:"#bbb", fontSize:"15px", fontWeight:500, textDecoration:"none", transition:"all 0.25s" }}
          onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"}}
          onMouseLeave={e=>{e.currentTarget.style.color="#bbb";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
          </svg>
          Calculate Your Savings
        </a>
      </motion.div>
      {/* trust row */}
      <motion.div {...s(4)} style={{ display:"flex", gap:"40px", flexWrap:"wrap", justifyContent:"center" }}>
        {[["1M+","Real trials analyzed"],["18+","Years clinical expertise"],["5","US Patents"],["7+","Global data sources"]].map(([n,t])=>(
          <div key={n} style={{ textAlign:"center" }}>
            <div style={{ fontSize:"26px", fontWeight:800, color:"#fff", letterSpacing:"-0.04em", fontFamily:"var(--mono)" }}>{n}</div>
            <div style={{ fontSize:"12px", color:"var(--muted)", marginTop:"3px", letterSpacing:"0.04em" }}>{t}</div>
          </div>
        ))}
      </motion.div>
      {/* scroll hint */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
        style={{ position:"absolute", bottom:"36px", left:"50%", transform:"translateX(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
        <span style={{ fontSize:"10px", color:"var(--muted)", letterSpacing:"0.12em",
          textTransform:"uppercase", fontFamily:"var(--mono)" }}>scroll</span>
        <div style={{ width:"1px", height:"36px",
          background:"linear-gradient(180deg,rgba(0,212,255,0.5),transparent)" }}/>
      </motion.div>
    </section>
  );
};

// ─── DATA SOURCES TICKER ──────────────────────────────────────────────────────
const DataTicker = () => {
  const items = ["ClinicalTrials.gov","IHME GBD","OpenFDA","PubMed","WHO GHO",
    "World Bank","GLOBOCAN","CDISC Standards","EudraVigilance","MedDRA",
    "ClinicalTrials.gov","IHME GBD","OpenFDA","PubMed","WHO GHO",
    "World Bank","GLOBOCAN","CDISC Standards","EudraVigilance","MedDRA"];
  return (
    <div style={{ overflow:"hidden", borderTop:"1px solid var(--border)",
      borderBottom:"1px solid var(--border)", padding:"13px 0",
      background:"rgba(255,255,255,0.015)" }}>
      <div style={{ display:"flex", gap:"48px", width:"max-content", animation:"ticker 24s linear infinite" }}>
        {items.map((s,i)=>(
          <span key={i} style={{ fontFamily:"var(--mono)", fontSize:"11px", color:"var(--muted)",
            letterSpacing:"0.1em", textTransform:"uppercase", whiteSpace:"nowrap",
            display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ width:"4px", height:"4px", borderRadius:"50%",
              background:"var(--accent)", display:"inline-block", opacity:0.5 }}/>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── PLATFORM / FEATURES ─────────────────────────────────────────────────────
const Platform = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [active, setActive] = useState(0);

  const modules = [
    { icon:"⬡", title:"Protocol Authoring", accent:"#00D4FF",
      desc:"AI-generated clinical protocols grounded in ICH E6, FDA guidance, and 1M+ real trials. Our Writer Agent synthesises disease burden data, comparator landscape, and endpoint selection into a draft ready for medical review.",
      bullets:["ICH E6(R2) & FDA compliant templates","Therapeutic area-specific endpoint libraries","Automated comparator arm selection","Version control with audit trail"] },
    { icon:"◎", title:"Site Feasibility", accent:"#7C3AED",
      desc:"Composite country scoring across patient population density, disease burden (IHME GBD), regulatory environment, site infrastructure, and historical enrolment rates — in minutes, not weeks.",
      bullets:["15+ country-level scoring dimensions","Powered by WHO, World Bank, GLOBOCAN","Interactive heatmap visualisation","CRO-ready feasibility report export"] },
    { icon:"⬟", title:"Explainable AI", accent:"#00FF94",
      desc:"Every recommendation is fully traceable from raw data source to final output. No black boxes. No hallucinations. Every protocol section cites its evidence chain — a first in clinical AI.",
      bullets:["Full citation chain per recommendation","Source-level confidence scoring","Human-in-the-loop review workflow","ALCOA+ compliant audit trail"] },
    { icon:"△", title:"Amendment Prevention", accent:"#FF6B6B",
      desc:"Identify high-risk protocol design decisions before IND submission. ProtocolIQ flags historical amendment triggers and suggests pre-emptive mitigations — reducing costly mid-trial changes by up to 50%.",
      bullets:["Amendment risk scoring per section","Pattern matching across 1M+ trials","Regulatory pushback predictor","Cost-of-amendment estimator"] },
  ];

  return (
    <section id="platform" ref={ref} style={{ padding:"120px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"64px" }}>
          <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
            transition={{duration:0.6}}>
            <SectionLabel>The Platform</SectionLabel>
            <SectionHeading>One workspace.<br/><span style={{ fontFamily:"var(--serif)",
              fontStyle:"italic", fontWeight:400, color:"var(--muted2)" }}>Everything you need.</span>
            </SectionHeading>
            <p style={{ color:"var(--muted2)", marginTop:"18px", fontSize:"16px",
              maxWidth:"520px", margin:"18px auto 0", lineHeight:1.7 }}>
              Four tightly integrated modules covering the full protocol lifecycle —
              from blank page to regulatory submission.
            </p>
          </motion.div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:"24px", alignItems:"start" }}>
          {/* Tab list */}
          <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
            {modules.map((m,i) => (
              <motion.button key={m.title}
                initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}}
                transition={{delay:i*0.1, duration:0.6}}
                onClick={() => setActive(i)}
                style={{ display:"flex", alignItems:"center", gap:"12px",
                  padding:"14px 16px", borderRadius:"10px", border:"none",
                  cursor:"pointer", textAlign:"left", transition:"all 0.2s",
                  background: active===i ? "var(--surface2)" : "transparent",
                  borderLeft: active===i ? `2px solid ${m.accent}` : "2px solid transparent",
                }}>
                <span style={{ fontSize:"18px", color:active===i?m.accent:"var(--muted)" }}>{m.icon}</span>
                <span style={{ fontSize:"14px", fontWeight:600,
                  color:active===i?"#fff":"var(--muted)" }}>{m.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
              transition={{duration:0.4,ease:[0.22,1,0.36,1]}}
              style={{ background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:"16px", padding:"40px 36px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px",
                background:`linear-gradient(90deg,transparent,${modules[active].accent},transparent)` }}/>
              <div style={{ fontSize:"36px", marginBottom:"16px", color:modules[active].accent }}>{modules[active].icon}</div>
              <h3 style={{ fontSize:"26px", fontWeight:800, color:"#fff",
                letterSpacing:"-0.03em", marginBottom:"14px" }}>{modules[active].title}</h3>
              <p style={{ color:"var(--muted2)", lineHeight:1.75, fontSize:"15px",
                marginBottom:"28px", maxWidth:"480px" }}>{modules[active].desc}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {modules[active].bullets.map((b,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ width:"6px", height:"6px", borderRadius:"50%",
                      background:modules[active].accent, flexShrink:0 }}/>
                    <span style={{ fontSize:"14px", color:"var(--muted2)" }}>{b}</span>
                  </div>
                ))}
              </div>
              <a href="#demo" style={{ display:"inline-flex", alignItems:"center", gap:"8px",
                marginTop:"32px", padding:"11px 24px",
                background:`rgba(${active===0?"0,212,255":active===1?"124,58,237":active===2?"0,255,148":"255,107,107"},0.12)`,
                border:`1px solid ${modules[active].accent}44`, borderRadius:"8px",
                color:modules[active].accent, fontSize:"14px", fontWeight:600,
                textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${modules[active].accent}22`}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${modules[active].accent}12`}}>
                See it in action →
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// ─── ROI CALCULATOR ───────────────────────────────────────────────────────────
const ROICalc = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [trials, setTrials] = useState(10);
  const [cost, setCost] = useState(5);
  const [amendRate, setAmendRate] = useState(40);

  const setupSaving = trials * cost * 1000000 * 0.006;
  const amendSaving = trials * cost * 1000000 * (amendRate/100) * 0.18;
  const timeSaving = Math.round(trials * 8.5);
  const total = setupSaving + amendSaving;

  const fmt = (n) => n >= 1000000
    ? `$${(n/1000000).toFixed(1)}M`
    : `$${Math.round(n/1000).toLocaleString()}K`;

  return (
    <section id="roi" ref={ref} style={{ padding:"120px 24px", background:"var(--bg2)",
      position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.2),transparent)" }}/>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.7}} style={{ textAlign:"center", marginBottom:"56px" }}>
          <SectionLabel>ROI Calculator</SectionLabel>
          <SectionHeading>What could <span className="shimmer-text">you save</span>?</SectionHeading>
          <p style={{ color:"var(--muted2)", marginTop:"16px", fontSize:"16px",
            maxWidth:"480px", margin:"16px auto 0", lineHeight:1.7 }}>
            Calculate your potential savings based on real data from clinical trial benchmarks.
          </p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"32px" }}>
          {/* Inputs */}
          <motion.div initial={{opacity:0,x:-24}} animate={inView?{opacity:1,x:0}:{}}
            transition={{delay:0.2,duration:0.7}}
            style={{ background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:"16px", padding:"36px" }}>
            <h3 style={{ fontSize:"18px", fontWeight:700, color:"#fff",
              marginBottom:"32px", letterSpacing:"-0.02em" }}>Your Trial Profile</h3>

            {[
              { label:"Trials per year", val:trials, set:setTrials, min:1, max:50, unit:` trials`, color:"var(--accent)" },
              { label:"Average trial cost", val:cost, set:setCost, min:1, max:50, unit:"M USD", color:"var(--violet)" },
              { label:"Amendment rate", val:amendRate, set:setAmendRate, min:10, max:80, unit:"%", color:"var(--green)" },
            ].map(({label,val,set,min,max,unit,color}) => (
              <div key={label} style={{ marginBottom:"28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:"10px" }}>
                  <span style={{ fontSize:"13px", color:"var(--muted2)", fontWeight:500 }}>{label}</span>
                  <span style={{ fontFamily:"var(--mono)", fontSize:"15px",
                    fontWeight:700, color }}>{val}{unit}</span>
                </div>
                <div style={{ position:"relative" }}>
                  <div style={{ position:"absolute", top:"50%", left:0,
                    width:`${((val-min)/(max-min))*100}%`,
                    height:"4px", background:color, borderRadius:"2px",
                    transform:"translateY(-50%)", transition:"width 0.1s",
                    pointerEvents:"none", zIndex:1 }}/>
                  <input type="range" min={min} max={max} value={val}
                    onChange={e=>set(Number(e.target.value))}
                    style={{ position:"relative", zIndex:2 }}/>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Outputs */}
          <motion.div initial={{opacity:0,x:24}} animate={inView?{opacity:1,x:0}:{}}
            transition={{delay:0.3,duration:0.7}}
            style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            {[
              { label:"Protocol setup savings", value:fmt(setupSaving), sub:"Reduced authoring & design time", accent:"var(--accent)" },
              { label:"Amendment reduction savings", value:fmt(amendSaving), sub:"Fewer mid-trial protocol changes", accent:"var(--violet)" },
              { label:"Time saved per year", value:`${timeSaving} hrs`, sub:"Across your trial portfolio", accent:"var(--green)" },
            ].map(({label,value,sub,accent}) => (
              <div key={label} style={{ background:"var(--surface)",
                border:`1px solid ${accent}22`, borderRadius:"12px",
                padding:"22px 24px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0,
                  width:"3px", background:accent, borderRadius:"3px 0 0 3px" }}/>
                <div style={{ fontSize:"12px", color:"var(--muted)", textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:"6px", fontFamily:"var(--mono)" }}>{label}</div>
                <div style={{ fontSize:"32px", fontWeight:800, color:accent,
                  letterSpacing:"-0.04em", fontFamily:"var(--mono)",
                  animation:"count-up 0.4s ease" }}>{value}</div>
                <div style={{ fontSize:"12px", color:"var(--muted)", marginTop:"4px" }}>{sub}</div>
              </div>
            ))}

            {/* Total */}
            <div style={{ background:"linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))",
              border:"1px solid rgba(0,212,255,0.2)", borderRadius:"12px",
              padding:"22px 24px", position:"relative" }}>
              <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px",
                background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)" }}/>
              <div style={{ fontSize:"12px", color:"var(--muted)", textTransform:"uppercase",
                letterSpacing:"0.1em", marginBottom:"6px", fontFamily:"var(--mono)" }}>
                Total Estimated Annual Savings
              </div>
              <div className="shimmer-text" style={{ fontSize:"42px", fontWeight:900,
                letterSpacing:"-0.05em", fontFamily:"var(--mono)" }}>{fmt(total)}</div>
              <a href="#demo" style={{ display:"inline-flex", alignItems:"center", gap:"6px",
                marginTop:"14px", fontSize:"13px", fontWeight:600, color:"var(--accent)",
                textDecoration:"none" }}>
                Book a demo to validate your numbers →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  const quotes = [
    { quote:"ProtocolIQ cut our feasibility assessment from 3 weeks to 2 days. The country scoring model is remarkably accurate — it predicted our top 3 sites correctly every single time.",
      name:"Dr. Priya Mehta", role:"VP Clinical Operations", company:"Global CRO", accent:"#00D4FF" },
    { quote:"The protocol draft was 65–70% similar to our finalized version. That's a week of medical writing saved on day one. The citation chain for every recommendation is what won over our regulatory team.",
      name:"James Okonkwo", role:"Medical Director", company:"Mid-size Pharma", accent:"#7C3AED" },
    { quote:"Amendment prevention is the real differentiator. ProtocolIQ flagged 4 high-risk endpoint choices in our oncology protocol that would have triggered FDA questions. We fixed them pre-IND.",
      name:"Dr. Sarah Chen", role:"Chief Medical Officer", company:"Biotech Startup", accent:"#00FF94" },
  ];

  return (
    <section id="about" ref={ref} style={{ padding:"120px 24px", position:"relative" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.7}} style={{ textAlign:"center", marginBottom:"60px" }}>
          <SectionLabel>Testimonials</SectionLabel>
          <SectionHeading>Trusted by leaders.<br/>
            <span style={{ fontFamily:"var(--serif)", fontStyle:"italic",
              fontWeight:400, color:"var(--muted2)" }}>Backed by science.</span>
          </SectionHeading>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"20px" }}>
          {quotes.map((q,i) => (
            <motion.div key={i} className="card-hover"
              initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
              transition={{delay:i*0.15, duration:0.7, ease:[0.22,1,0.36,1]}}
              style={{ background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:"16px", padding:"32px 28px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px",
                background:`linear-gradient(90deg,transparent,${q.accent}66,transparent)` }}/>
              <div style={{ fontSize:"36px", color:`${q.accent}44`, fontFamily:"var(--serif)",
                lineHeight:1, marginBottom:"16px" }}>"</div>
              <p style={{ fontSize:"15px", color:"var(--muted2)", lineHeight:1.75,
                marginBottom:"24px", fontStyle:"italic" }}>{q.quote}</p>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"38px", height:"38px", borderRadius:"50%",
                  background:`linear-gradient(135deg,${q.accent}33,${q.accent}11)`,
                  border:`1px solid ${q.accent}44`, display:"flex",
                  alignItems:"center", justifyContent:"center",
                  fontSize:"14px", fontWeight:700, color:q.accent }}>
                  {q.name[0]}
                </div>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:700, color:"#fff" }}>{q.name}</div>
                  <div style={{ fontSize:"12px", color:"var(--muted)" }}>{q.role} · {q.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* stats bar */}
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{delay:0.5, duration:0.7}}
          style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"0",
            marginTop:"56px", background:"var(--surface)",
            border:"1px solid var(--border)", borderRadius:"16px", overflow:"hidden" }}>
          {[["32%","Faster feasibility","var(--accent)"],["50%","Fewer amendments","var(--violet)"],
            ["65%","Protocol match accuracy","var(--green)"],["$2.4M","Avg annual savings","#FF6B6B)"]].map(([n,t,c],i,arr) => (
            <div key={n} style={{ flex:"1 1 160px", padding:"28px 24px", textAlign:"center",
              borderRight: i<arr.length-1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize:"32px", fontWeight:900, color:c,
                letterSpacing:"-0.04em", fontFamily:"var(--mono)" }}>{n}</div>
              <div style={{ fontSize:"12px", color:"var(--muted)", marginTop:"4px",
                letterSpacing:"0.04em" }}>{t}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [open, setOpen] = useState(0);

  const faqs = [
    { q:"How does ProtocolIQ handle data privacy and HIPAA compliance?",
      a:"ProtocolIQ processes only publicly available datasets (ClinicalTrials.gov, IHME, OpenFDA, PubMed, WHO). No patient-level data is ingested or processed. All generated protocol content lives within your secure environment. We are SOC 2 Type II compliant and undergo annual penetration testing." },
    { q:"How accurate is the AI-generated protocol compared to manually authored versions?",
      a:"Across our beta cohort, protocol drafts showed 60–70% structural similarity to the finalized version — benchmarked against expert medical writers. The AI handles the scaffolding, evidence synthesis, and regulatory boilerplate; your clinical team applies domain judgment for the remaining nuances." },
    { q:"Which therapeutic areas are supported?",
      a:"ProtocolIQ currently covers Oncology, Cardiovascular, CNS/Neurology, Infectious Disease, Rare Diseases, and Metabolic disorders. Additional TAs are added quarterly based on customer demand. Custom therapeutic area models are available on Enterprise plans." },
    { q:"How does the feasibility scoring work?",
      a:"We score each country across 15+ dimensions: patient population (IHME GBD), disease prevalence (GLOBOCAN/WHO), regulatory approval timelines, site infrastructure quality, investigator experience, and historical enrolment rates. Scores are aggregated into a composite rank with full dimension-level transparency." },
    { q:"Can ProtocolIQ integrate with our existing CTMS or eTMF?",
      a:"Yes — ProtocolIQ provides REST API endpoints and pre-built connectors for major CTMS platforms. Custom integrations are available on Professional and Enterprise plans. Our FastAPI backend is designed for easy integration into existing clinical data workflows." },
  ];

  return (
    <section id="faq" ref={ref} style={{ padding:"120px 24px", background:"var(--bg2)",
      position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent)" }}/>
      <div style={{ maxWidth:"760px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.7}} style={{ textAlign:"center", marginBottom:"56px" }}>
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading>Common questions</SectionHeading>
        </motion.div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {faqs.map((f,i) => (
            <motion.div key={i}
              initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
              transition={{delay:i*0.1, duration:0.6}}
              style={{ background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:"12px", overflow:"hidden",
                borderColor: open===i ? "rgba(0,212,255,0.2)" : "var(--border)",
                transition:"border-color 0.3s" }}>
              <button onClick={()=>setOpen(open===i?-1:i)}
                style={{ width:"100%", display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"20px 24px", background:"transparent",
                  border:"none", cursor:"pointer", textAlign:"left", gap:"16px" }}>
                <span style={{ fontSize:"15px", fontWeight:600,
                  color: open===i ? "#fff" : "var(--muted2)", transition:"color 0.2s" }}>
                  {f.q}
                </span>
                <span style={{ color:"var(--accent)", fontSize:"18px", flexShrink:0,
                  transform: open===i ? "rotate(45deg)" : "rotate(0deg)",
                  transition:"transform 0.3s", display:"inline-block" }}>+</span>
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
                    exit={{height:0,opacity:0}} transition={{duration:0.3,ease:[0.22,1,0.36,1]}}>
                    <div style={{ padding:"0 24px 20px",
                      fontSize:"14px", color:"var(--muted2)", lineHeight:1.75 }}>{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── BOOK A DEMO ─────────────────────────────────────────────────────────────
const BookDemo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [form, setForm] = useState({ name:"", email:"", company:"", trials:"" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email) setSent(true);
  };

  return (
    <section id="demo" ref={ref} style={{ padding:"120px 24px", position:"relative", overflow:"hidden" }}>
      <GridBg />
      <div style={{ maxWidth:"960px", margin:"0 auto", position:"relative", zIndex:1 }}>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.7}} style={{ textAlign:"center", marginBottom:"56px" }}>
          <SectionLabel>Get Started</SectionLabel>
          <SectionHeading>Ready to <span className="shimmer-text">accelerate</span><br/>your next clinical trial?</SectionHeading>
          <p style={{ color:"var(--muted2)", marginTop:"18px", fontSize:"16px",
            maxWidth:"480px", margin:"18px auto 0", lineHeight:1.7 }}>
            Book a 30-minute personalised demo. See ProtocolIQ generate a protocol
            draft for your therapeutic area — live.
          </p>
        </motion.div>

        <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
          transition={{delay:0.2, duration:0.7}}
          style={{ background:"var(--surface)", border:"1px solid rgba(0,212,255,0.15)",
            borderRadius:"20px", padding:"48px", position:"relative", overflow:"hidden",
            maxWidth:"560px", margin:"0 auto" }}>
          <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px",
            background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)" }}/>

          {!sent ? (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                {[
                  {label:"Full Name", key:"name", placeholder:"Dr. Jane Smith"},
                  {label:"Work Email", key:"email", placeholder:"jane@pharma.com"},
                  {label:"Company", key:"company", placeholder:"Pharma Co."},
                  {label:"Trials per year", key:"trials", placeholder:"e.g. 5–10"},
                ].map(({label,key,placeholder}) => (
                  <div key={key}>
                    <label style={{ fontSize:"12px", color:"var(--muted)", letterSpacing:"0.06em",
                      textTransform:"uppercase", fontFamily:"var(--mono)", display:"block",
                      marginBottom:"8px" }}>{label}</label>
                    <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                      placeholder={placeholder}
                      style={{ width:"100%", padding:"11px 14px",
                        background:"var(--bg2)", border:"1px solid var(--border)",
                        borderRadius:"8px", color:"var(--text)", fontSize:"14px",
                        outline:"none", fontFamily:"var(--head)",
                        transition:"border-color 0.2s" }}
                      onFocus={e=>e.target.style.borderColor="rgba(0,212,255,0.4)"}
                      onBlur={e=>e.target.style.borderColor="var(--border)"}/>
                  </div>
                ))}
              </div>
              <button onClick={handleSubmit}
                style={{ width:"100%", padding:"15px",
                  background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
                  border:"none", borderRadius:"10px", color:"#fff", fontSize:"15px",
                  fontWeight:700, cursor:"pointer", letterSpacing:"-0.01em",
                  boxShadow:"0 0 40px rgba(0,212,255,0.2)",
                  transition:"all 0.25s" }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 0 60px rgba(0,212,255,0.35)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="0 0 40px rgba(0,212,255,0.2)"}>
                Book My Demo →
              </button>
              <p style={{ textAlign:"center", fontSize:"12px", color:"var(--muted)",
                marginTop:"14px" }}>No commitment. 30 minutes. Live protocol generation.</p>
            </>
          ) : (
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
              style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:"48px", marginBottom:"16px" }}>✦</div>
              <h3 style={{ fontSize:"22px", fontWeight:700, color:"#fff", marginBottom:"10px" }}>
                You're on the list!
              </h3>
              <p style={{ color:"var(--muted2)", lineHeight:1.7 }}>
                We'll reach out to <span style={{color:"var(--accent)"}}>{form.email}</span> within 24 hours
                to schedule your personalised demo.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ─── FINAL CTA BANNER ─────────────────────────────────────────────────────────
const FinalCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  return (
    <section ref={ref} style={{ padding:"100px 24px",
      background:"linear-gradient(135deg,rgba(0,212,255,0.04),rgba(124,58,237,0.06))",
      borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
        transition={{duration:0.7}} style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto" }}>
        <h2 style={{ fontSize:"clamp(32px,5vw,58px)", fontWeight:800,
          letterSpacing:"-0.035em", lineHeight:1.08, marginBottom:"20px" }}>
          Your competitors are<br/>running trials{" "}
          <span className="shimmer-text">50% faster</span>.
        </h2>
        <p style={{ color:"var(--muted2)", fontSize:"17px", lineHeight:1.7, marginBottom:"36px" }}>
          Join clinical teams across the US, EU & APAC already using ProtocolIQ
          to design better protocols in a fraction of the time.
        </p>
        <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
          <a href="#demo" style={{ padding:"15px 36px",
            background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
            borderRadius:"10px", color:"#fff", fontSize:"15px",
            fontWeight:700, textDecoration:"none",
            boxShadow:"0 0 50px rgba(0,212,255,0.25)",
            transition:"all 0.25s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 0 70px rgba(0,212,255,0.35)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 0 50px rgba(0,212,255,0.25)"}}>
            Book a Demo
          </a>
          <a href="#platform" style={{ padding:"15px 30px",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"10px", color:"#bbb", fontSize:"15px",
            fontWeight:500, textDecoration:"none", transition:"all 0.25s" }}
            onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"}}
            onMouseLeave={e=>{e.currentTarget.style.color="#bbb";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}}>
            Explore the Platform
          </a>
        </div>
      </motion.div>
    </section>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const Footer = () => {
  const cols = [
    { title:"Platform", links:["Protocol Authoring","Site Feasibility","Explainable AI","Amendment Prevention","Integrations"] },
    { title:"Company", links:["About Us","Our Story","Careers","Press","Contact"] },
    { title:"Resources", links:["Documentation","Blog","Case Studies","Changelog","FAQ"] },
    { title:"Legal", links:["Privacy Policy","Terms of Service","Security","HIPAA Compliance","Cookie Settings"] },
  ];
  return (
    <footer style={{ background:"var(--bg2)", borderTop:"1px solid var(--border)",
      padding:"80px 24px 40px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:"48px", marginBottom:"64px" }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px" }}>
              <div style={{ width:"34px", height:"34px", borderRadius:"9px",
                background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"var(--mono)", fontSize:"14px", fontWeight:700, color:"#fff" }}>P</span>
              </div>
              <span style={{ fontSize:"16px", fontWeight:800, letterSpacing:"-0.03em" }}>
                Protocol<span style={{color:"var(--accent)"}}>IQ</span>
              </span>
            </div>
            <p style={{ fontSize:"14px", color:"var(--muted)", lineHeight:1.7,
              maxWidth:"240px", marginBottom:"24px" }}>
              The AI-native platform accelerating clinical trials from protocol design to regulatory submission.
            </p>
            <div style={{ fontFamily:"var(--mono)", fontSize:"11px", color:"var(--muted)",
              letterSpacing:"0.1em" }}>knavis-ai.com</div>
          </div>
          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#fff",
                letterSpacing:"0.08em", textTransform:"uppercase",
                marginBottom:"16px", fontFamily:"var(--mono)" }}>{col.title}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontSize:"13px", color:"var(--muted)",
                    textDecoration:"none", transition:"color 0.2s" }}
                    onMouseEnter={e=>e.target.style.color="#fff"}
                    onMouseLeave={e=>e.target.style.color="var(--muted)"}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          paddingTop:"28px", flexWrap:"wrap", gap:"16px" }}>
          <span style={{ fontSize:"13px", color:"var(--muted)", fontFamily:"var(--mono)" }}>
            © 2025 ProtocolIQ · knavis-ai.com · All rights reserved
          </span>
          <div style={{ display:"flex", gap:"20px" }}>
            {["Twitter/X","LinkedIn","GitHub"].map(s => (
              <a key={s} href="#" style={{ fontSize:"13px", color:"var(--muted)",
                textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="var(--accent)"}
                onMouseLeave={e=>e.target.style.color="var(--muted)"}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function ProtocolIQWebsite() {
  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"var(--head)" }}>
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <DataTicker />
        <Platform />
        <Divider />
        <ROICalc />
        <Divider />
        <Testimonials />
        <Divider />
        <FAQ />
        <BookDemo />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
