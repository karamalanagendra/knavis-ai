"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:      #06060F;
      --bg2:     #0B0B1A;
      --surface: #0E0E1C;
      --srf2:    #131325;
      --border:  rgba(255,255,255,0.065);
      --text:    #EEEEFF;
      --muted:   #64648A;
      --muted2:  #9090B0;
      --accent:  #00D4FF;
      --violet:  #7C3AED;
      --green:   #00FF94;
      --orange:  #FF8A3D;
      --red:     #FF5E7A;
      --head:    'Outfit', sans-serif;
      --serif:   'DM Serif Display', serif;
      --mono:    'JetBrains Mono', monospace;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: var(--head); overflow-x: hidden; }
    ::selection { background: rgba(0,212,255,0.2); }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: var(--violet); border-radius: 2px; }

    @keyframes ticker    { to { transform: translateX(-50%); } }
    @keyframes gridpulse { 0%,100%{opacity:0.04} 50%{opacity:0.09} }
    @keyframes scan      { 0%{top:0%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
    @keyframes shimmer   { from{background-position:-300% center} to{background-position:300% center} }
    @keyframes glow      { 0%,100%{opacity:0.5} 50%{opacity:1} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.6} }
    @keyframes flow-line { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
    @keyframes appear    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

    .shimmer { background: linear-gradient(90deg,#00D4FF,#7C3AED,#00FF94,#00D4FF);
      background-size:300% auto; -webkit-background-clip:text;
      -webkit-text-fill-color:transparent; background-clip:text;
      animation:shimmer 4s linear infinite; }
    .hover-lift { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
    .hover-lift:hover { transform: translateY(-4px); }
  `}</style>
);

// ─── SHARED ───────────────────────────────────────────────────────────────────
const Label = ({ children, color = "var(--accent)" }) => (
  <div style={{ fontFamily:"var(--mono)", fontSize:"11px", color,
    letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"12px" }}>
    ◆ {children}
  </div>
);

const SectionNum = ({ n }) => (
  <div style={{ fontFamily:"var(--mono)", fontSize:"72px", fontWeight:900,
    color:"rgba(255,255,255,0.04)", lineHeight:1, marginBottom:"-20px",
    letterSpacing:"-0.06em", userSelect:"none" }}>0{n}</div>
);

const GridBg = () => (
  <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
    <div style={{ position:"absolute", inset:0,
      backgroundImage:`radial-gradient(circle,rgba(0,212,255,0.07) 1px,transparent 1px)`,
      backgroundSize:"30px 30px", animation:"gridpulse 7s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", left:0, right:0, height:"1px",
      background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.3),transparent)",
      animation:"scan 9s linear infinite", top:0 }}/>
    <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)",
      width:"900px", height:"500px",
      background:"radial-gradient(ellipse,rgba(124,58,237,0.08) 0%,rgba(0,212,255,0.04) 40%,transparent 70%)",
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
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 32px",
      background: scrolled ? "rgba(6,6,15,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition:"all 0.3s" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex",
        alignItems:"center", justifyContent:"space-between", height:"68px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"9px",
            background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 16px rgba(0,212,255,0.25)" }}>
            <span style={{ fontFamily:"var(--mono)", fontSize:"14px", fontWeight:700, color:"#fff" }}>P</span>
          </div>
          <div>
            <div style={{ fontSize:"16px", fontWeight:800, letterSpacing:"-0.03em" }}>
              Protocol<span style={{ color:"var(--accent)" }}>IQ</span>
            </div>
            <div style={{ fontSize:"9px", color:"var(--muted)", letterSpacing:"0.15em",
              textTransform:"uppercase", fontFamily:"var(--mono)" }}>Platform</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          <a href="/" style={{ padding:"6px 14px", color:"var(--muted)", fontSize:"14px",
            textDecoration:"none", transition:"color 0.2s", fontWeight:500 }}
            onMouseEnter={e=>e.target.style.color="#fff"}
            onMouseLeave={e=>e.target.style.color="var(--muted)"}>← Home</a>
          <a href="#agents" style={{ padding:"6px 14px", color:"var(--muted)", fontSize:"14px",
            textDecoration:"none", transition:"color 0.2s", fontWeight:500 }}
            onMouseEnter={e=>e.target.style.color="#fff"}
            onMouseLeave={e=>e.target.style.color="var(--muted)"}>Agents</a>
          <a href="#data" style={{ padding:"6px 14px", color:"var(--muted)", fontSize:"14px",
            textDecoration:"none", transition:"color 0.2s", fontWeight:500 }}
            onMouseEnter={e=>e.target.style.color="#fff"}
            onMouseLeave={e=>e.target.style.color="var(--muted)"}>Data</a>
          <a href="#workflow" style={{ padding:"6px 14px", color:"var(--muted)", fontSize:"14px",
            textDecoration:"none", transition:"color 0.2s", fontWeight:500 }}
            onMouseEnter={e=>e.target.style.color="#fff"}
            onMouseLeave={e=>e.target.style.color="var(--muted)"}>Workflow</a>
          <a href="#demo" style={{ padding:"9px 22px",
            background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(124,58,237,0.15))",
            border:"1px solid rgba(0,212,255,0.3)", borderRadius:"8px",
            color:"#fff", fontSize:"13px", fontWeight:600, textDecoration:"none",
            transition:"all 0.25s" }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 24px rgba(0,212,255,0.25)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none"}}>
            Book a Demo →
          </a>
        </div>
      </div>
    </nav>
  );
};

// ─── PAGE HERO ────────────────────────────────────────────────────────────────
const PageHero = () => {
  const s = i => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0},
    transition:{delay:0.1+i*0.12, duration:0.8, ease:[0.22,1,0.36,1]} });
  return (
    <section style={{ position:"relative", padding:"150px 24px 100px",
      overflow:"hidden", textAlign:"center" }}>
      <GridBg />
      <div style={{ position:"relative", zIndex:1, maxWidth:"900px", margin:"0 auto" }}>
        <motion.div {...s(0)}>
          <Label>The Platform</Label>
        </motion.div>
        <motion.h1 {...s(1)} style={{ fontFamily:"var(--head)", fontWeight:800,
          fontSize:"clamp(40px,7vw,84px)", lineHeight:1.0, letterSpacing:"-0.04em",
          marginBottom:"8px" }}>
          Meet <span className="shimmer">ProtocolIQ</span>
        </motion.h1>
        <motion.p {...s(2)} style={{ fontFamily:"var(--serif)", fontStyle:"italic",
          fontSize:"clamp(20px,3vw,32px)", color:"var(--muted2)", marginBottom:"24px" }}>
          The first AI-native clinical trial platform
        </motion.p>
        <motion.p {...s(3)} style={{ fontSize:"17px", color:"var(--muted2)", lineHeight:1.8,
          maxWidth:"580px", margin:"0 auto 48px" }}>
          Four tightly integrated modules. Five specialised AI agents. Seven global data sources.
          One workspace that takes your trial from blank page to regulatory-ready protocol.
        </motion.p>

        {/* Architecture pill badges */}
        <motion.div {...s(4)} style={{ display:"flex", gap:"10px",
          flexWrap:"wrap", justifyContent:"center" }}>
          {[
            ["FastAPI Backend","var(--accent)"],
            ["Next.js Frontend","var(--violet)"],
            ["pgvector RAG","var(--green)"],
            ["Claude AI Agents","#FF8A3D"],
            ["PostgreSQL 18","var(--red)"],
          ].map(([t,c]) => (
            <span key={t} style={{ padding:"6px 14px",
              background:`${c}12`, border:`1px solid ${c}33`,
              borderRadius:"100px", fontSize:"12px", fontFamily:"var(--mono)",
              color:c, letterSpacing:"0.04em" }}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─── ARCHITECTURE DIAGRAM ─────────────────────────────────────────────────────
const ArchDiagram = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  const layers = [
    { label:"Frontend Layer", color:"var(--accent)", items:["Next.js UI","Protocol Editor","Feasibility Map","Amendment Tracker"] },
    { label:"API Layer", color:"var(--violet)", items:["FastAPI","REST Endpoints","Auth / JWT","Rate Limiting"] },
    { label:"AI Agent Layer", color:"var(--green)", items:["Orchestrator","Writer Agent","Retrieval Agent","Review Agent","Stats Agent"] },
    { label:"Data Layer", color:"var(--orange)", items:["pgvector / RAG","PostgreSQL 18","postgres_fdw","Redis Cache"] },
  ];

  return (
    <section ref={ref} style={{ padding:"80px 24px 120px" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.6}} style={{ textAlign:"center", marginBottom:"56px" }}>
          <Label>Architecture</Label>
          <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800,
            letterSpacing:"-0.03em" }}>
            Built for{" "}
            <span style={{ fontFamily:"var(--serif)", fontStyle:"italic",
              fontWeight:400, color:"var(--muted2)" }}>enterprise scale</span>
          </h2>
        </motion.div>

        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {layers.map((layer, li) => (
            <motion.div key={layer.label}
              initial={{opacity:0, x:-30}} animate={inView?{opacity:1,x:0}:{}}
              transition={{delay:li*0.12, duration:0.7, ease:[0.22,1,0.36,1]}}
              style={{ display:"grid", gridTemplateColumns:"180px 1fr",
                background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:"12px", overflow:"hidden" }}>
              {/* Layer label */}
              <div style={{ padding:"20px 20px",
                borderRight:"1px solid var(--border)",
                borderLeft:`3px solid ${layer.color}`,
                display:"flex", alignItems:"center" }}>
                <span style={{ fontSize:"13px", fontWeight:700,
                  color:layer.color, letterSpacing:"-0.01em" }}>{layer.label}</span>
              </div>
              {/* Layer items */}
              <div style={{ padding:"16px 20px", display:"flex",
                gap:"10px", flexWrap:"wrap", alignItems:"center" }}>
                {layer.items.map(item => (
                  <span key={item} style={{ padding:"6px 14px",
                    background:`${layer.color}0F`, border:`1px solid ${layer.color}28`,
                    borderRadius:"6px", fontSize:"13px", color:layer.color,
                    fontFamily:"var(--mono)", letterSpacing:"0.02em" }}>{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
          {/* Arrow connectors between layers */}
        </div>

        {/* Data flow arrow */}
        <div style={{ display:"flex", justifyContent:"center", margin:"20px 0 0",
          gap:"8px", alignItems:"center" }}>
          {["User Request","→","API Processing","→","AI Agent Orchestration","→","RAG Retrieval","→","Protocol Output"].map((t,i) => (
            <span key={i} style={{ fontSize:"12px",
              color: t==="→" ? "var(--muted)" : "var(--muted2)",
              fontFamily:"var(--mono)", letterSpacing:"0.04em",
              background: t!=="→" ? "var(--surface)" : "transparent",
              border: t!=="→" ? "1px solid var(--border)" : "none",
              padding: t!=="→" ? "5px 10px" : "0",
              borderRadius:"5px" }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── AI AGENTS ────────────────────────────────────────────────────────────────
const Agents = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [activeAgent, setActiveAgent] = useState(0);

  const agents = [
    {
      id:"orchestrator", name:"Orchestrator Agent", icon:"⬡",
      accent:"#00D4FF", role:"Controller",
      desc:"The master coordinator. Receives the user's protocol brief, decomposes it into tasks, routes each task to the appropriate specialist agent, aggregates outputs, and manages the overall generation pipeline.",
      capabilities:["Task decomposition & routing","Agent output aggregation","Error handling & retry logic","Quality gate enforcement","Multi-turn context management"],
      tech:["LangGraph state machine","Claude claude-sonnet-4-20250514","Structured tool calling","Conversation memory"],
    },
    {
      id:"writer", name:"Writer Agent", icon:"✦",
      accent:"#7C3AED", role:"Authoring",
      desc:"Generates the actual protocol text — section by section. Grounded in retrieved evidence, ICH E6(R2) templates, and therapeutic area conventions. Produces publication-ready clinical language, not just summaries.",
      capabilities:["Section-by-section protocol authoring","ICH E6(R2) template adherence","Therapeutic area tone adaptation","Endpoint & hypothesis drafting","Synopsis generation"],
      tech:["Claude claude-sonnet-4-20250514","RAG-grounded generation","Template injection","Structured output schema"],
    },
    {
      id:"retrieval", name:"Retrieval Agent", icon:"◎",
      accent:"#00FF94", role:"RAG Engine",
      desc:"Queries the pgvector knowledge base across all 7+ integrated data sources. Uses hybrid retrieval (dense + sparse) to surface the most relevant trial precedents, disease burden data, and regulatory guidance.",
      capabilities:["Hybrid vector + keyword search","Multi-source retrieval fusion","Relevance re-ranking","Citation extraction","Cross-database JOIN queries"],
      tech:["pgvector embeddings","PostgreSQL FDW","Hybrid BM25 + cosine","postgres_fdw federation"],
    },
    {
      id:"review", name:"Review Agent", icon:"⬟",
      accent:"#FF8A3D", role:"Validation",
      desc:"Critiques every generated protocol section against regulatory checklists, internal consistency rules, and amendment risk patterns. Flags issues before they reach the medical writer for review.",
      capabilities:["FDA/EMA guideline compliance check","Amendment risk scoring","Protocol consistency validation","Logical contradiction detection","Regulatory pushback prediction"],
      tech:["Rule-based checkers","Claude judgment layer","Risk pattern matching","Historical amendment DB"],
    },
    {
      id:"stats", name:"Statistics Agent", icon:"△",
      accent:"#FF5E7A", role:"Biostatistics",
      desc:"Handles sample size calculations, power analysis, and statistical methodology recommendations. Translates clinical objectives into appropriate statistical frameworks aligned with the primary endpoint.",
      capabilities:["Sample size & power calculations","Statistical test selection","Primary/secondary endpoint alignment","Interim analysis planning","Adaptive design recommendations"],
      tech:["SciPy / statsmodels","Claude reasoning","CONSORT guidelines","Historical effect sizes"],
    },
  ];

  const ag = agents[activeAgent];

  return (
    <section id="agents" ref={ref} style={{ padding:"120px 24px",
      background:"var(--bg2)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.2),transparent)" }}/>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.6}} style={{ textAlign:"center", marginBottom:"64px" }}>
          <Label>AI Agent Architecture</Label>
          <h2 style={{ fontSize:"clamp(28px,4vw,52px)", fontWeight:800, letterSpacing:"-0.03em" }}>
            Five specialised agents.<br/>
            <span style={{ fontFamily:"var(--serif)", fontStyle:"italic",
              fontWeight:400, color:"var(--muted2)" }}>One orchestrated intelligence.</span>
          </h2>
          <p style={{ color:"var(--muted2)", marginTop:"16px", fontSize:"16px",
            maxWidth:"500px", margin:"16px auto 0", lineHeight:1.7 }}>
            Each agent is purpose-built for its task. Together they form a multi-agent pipeline
            powered by Claude and LangGraph.
          </p>
        </motion.div>

        {/* Agent selector + detail */}
        <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"24px" }}>
          {/* Agent list */}
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {agents.map((a,i) => (
              <motion.button key={a.id}
                initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}}
                transition={{delay:i*0.1, duration:0.6}}
                onClick={() => setActiveAgent(i)}
                style={{ display:"flex", alignItems:"center", gap:"14px",
                  padding:"16px 18px", borderRadius:"12px", border:"none",
                  cursor:"pointer", textAlign:"left", transition:"all 0.25s",
                  background: activeAgent===i ? "var(--srf2)" : "transparent",
                  boxShadow: activeAgent===i ? `0 0 0 1px ${a.accent}33, inset 0 0 20px ${a.accent}08` : "none",
                }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"10px",
                  background:`${a.accent}15`, border:`1px solid ${a.accent}30`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"18px", color: activeAgent===i ? a.accent : "var(--muted)",
                  transition:"all 0.25s", flexShrink:0 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:700,
                    color: activeAgent===i ? "#fff" : "var(--muted2)",
                    transition:"color 0.25s" }}>{a.name}</div>
                  <div style={{ fontSize:"11px", color: activeAgent===i ? a.accent : "var(--muted)",
                    fontFamily:"var(--mono)", letterSpacing:"0.06em",
                    textTransform:"uppercase", marginTop:"2px" }}>{a.role}</div>
                </div>
                {activeAgent===i && (
                  <div style={{ marginLeft:"auto", width:"6px", height:"6px",
                    borderRadius:"50%", background:a.accent,
                    animation:"glow 2s infinite", flexShrink:0 }}/>
                )}
              </motion.button>
            ))}
          </div>

          {/* Agent detail panel */}
          <AnimatePresence mode="wait">
            <motion.div key={ag.id}
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-16}}
              transition={{duration:0.4, ease:[0.22,1,0.36,1]}}
              style={{ background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:"16px", padding:"40px 36px", position:"relative",
                overflow:"hidden" }}>
              {/* Top accent line */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px",
                background:`linear-gradient(90deg,transparent,${ag.accent},transparent)` }}/>
              {/* Glow */}
              <div style={{ position:"absolute", top:-60, right:-60, width:"200px", height:"200px",
                background:`radial-gradient(circle,${ag.accent}15,transparent 70%)`,
                pointerEvents:"none" }}/>

              <div style={{ display:"flex", alignItems:"flex-start",
                gap:"16px", marginBottom:"20px" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"14px", flexShrink:0,
                  background:`linear-gradient(135deg,${ag.accent}25,${ag.accent}08)`,
                  border:`1px solid ${ag.accent}40`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"24px", color:ag.accent }}>
                  {ag.icon}
                </div>
                <div>
                  <div style={{ fontSize:"11px", color:ag.accent, fontFamily:"var(--mono)",
                    letterSpacing:"0.12em", textTransform:"uppercase",
                    marginBottom:"4px" }}>{ag.role}</div>
                  <h3 style={{ fontSize:"26px", fontWeight:800, color:"#fff",
                    letterSpacing:"-0.03em" }}>{ag.name}</h3>
                </div>
              </div>

              <p style={{ fontSize:"15px", color:"var(--muted2)", lineHeight:1.75,
                marginBottom:"32px", maxWidth:"500px" }}>{ag.desc}</p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
                {/* Capabilities */}
                <div>
                  <div style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    marginBottom:"14px" }}>Capabilities</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
                    {ag.capabilities.map((c,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
                        <div style={{ width:"5px", height:"5px", borderRadius:"50%",
                          background:ag.accent, flexShrink:0, marginTop:"6px" }}/>
                        <span style={{ fontSize:"13px", color:"var(--muted2)" }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Tech stack */}
                <div>
                  <div style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    marginBottom:"14px" }}>Tech Stack</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {ag.tech.map((t,i) => (
                      <span key={i} style={{ display:"inline-flex", alignItems:"center",
                        gap:"8px", padding:"6px 12px",
                        background:`${ag.accent}0D`, border:`1px solid ${ag.accent}22`,
                        borderRadius:"6px", fontSize:"12px",
                        fontFamily:"var(--mono)", color:ag.accent,
                        letterSpacing:"0.02em" }}>
                        <span style={{ width:"4px", height:"4px", borderRadius:"50%",
                          background:ag.accent, flexShrink:0 }}/>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Agent pipeline flow */}
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{delay:0.5, duration:0.7}}
          style={{ marginTop:"40px", background:"var(--surface)",
            border:"1px solid var(--border)", borderRadius:"12px",
            padding:"24px 28px" }}>
          <div style={{ fontSize:"11px", color:"var(--muted)", fontFamily:"var(--mono)",
            letterSpacing:"0.1em", textTransform:"uppercase",
            marginBottom:"16px" }}>Pipeline Flow</div>
          <div style={{ display:"flex", alignItems:"center",
            gap:"8px", flexWrap:"wrap" }}>
            {agents.map((a, i) => (
              <>
                <div key={a.id} style={{ display:"flex", alignItems:"center",
                  gap:"8px", padding:"8px 14px",
                  background:`${a.accent}10`, border:`1px solid ${a.accent}28`,
                  borderRadius:"8px" }}>
                  <span style={{ fontSize:"14px", color:a.accent }}>{a.icon}</span>
                  <span style={{ fontSize:"12px", fontWeight:600, color:a.accent,
                    fontFamily:"var(--mono)" }}>{a.role}</span>
                </div>
                {i < agents.length-1 && (
                  <span key={`arrow-${i}`} style={{ color:"var(--muted)", fontSize:"16px" }}>→</span>
                )}
              </>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── DATA SOURCES ─────────────────────────────────────────────────────────────
const DataSources = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  const sources = [
    { name:"ClinicalTrials.gov", tag:"Trial Database", accent:"#00D4FF",
      desc:"450,000+ registered trials. Comparator arm selection, endpoint benchmarking, historical enrolment rates.", icon:"⬡" },
    { name:"IHME GBD", tag:"Disease Burden", accent:"#7C3AED",
      desc:"Global Burden of Disease data. Country-level incidence, prevalence, and DALYs across 300+ conditions.", icon:"◎" },
    { name:"WHO GHO", tag:"Health Statistics", accent:"#00FF94",
      desc:"World Health Organization Global Health Observatory. Country health system capacity and infrastructure.", icon:"△" },
    { name:"World Bank", tag:"Economic Data", accent:"#FF8A3D",
      desc:"Country-level GDP, healthcare expenditure, research capacity, and regulatory environment indices.", icon:"✦" },
    { name:"OpenFDA", tag:"Safety & Labels", accent:"#FF5E7A",
      desc:"Drug labels, adverse event reports, and clinical study results from FDA submissions.", icon:"⬟" },
    { name:"PubMed", tag:"Literature", accent:"#00D4FF",
      desc:"35M+ biomedical abstracts. Evidence synthesis for protocol rationale, endpoints, and comparators.", icon:"◇" },
    { name:"GLOBOCAN", tag:"Oncology Data", accent:"#7C3AED",
      desc:"IARC cancer incidence and mortality estimates. Critical for oncology site feasibility scoring.", icon:"○" },
  ];

  return (
    <section id="data" ref={ref} style={{ padding:"120px 24px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.6}} style={{ marginBottom:"64px" }}>
          <SectionNum n={3} />
          <Label>Data Sources</Label>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-end", flexWrap:"wrap", gap:"20px" }}>
            <h2 style={{ fontSize:"clamp(28px,4vw,52px)", fontWeight:800,
              letterSpacing:"-0.03em", maxWidth:"500px" }}>
              Grounded in{" "}
              <span className="shimmer">real-world</span> data
            </h2>
            <p style={{ fontSize:"15px", color:"var(--muted2)", maxWidth:"360px",
              lineHeight:1.7 }}>
              Seven globally authoritative datasets — connected via postgres_fdw into
              a unified feasibility intelligence layer.
            </p>
          </div>
        </motion.div>

        <div style={{ display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"16px" }}>
          {sources.map((s, i) => (
            <motion.div key={s.name} className="hover-lift"
              initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
              transition={{delay:i*0.08, duration:0.7, ease:[0.22,1,0.36,1]}}
              style={{ background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:"14px", padding:"24px 22px",
                position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px",
                background:`linear-gradient(90deg,transparent,${s.accent}44,transparent)` }}/>
              <div style={{ display:"flex", alignItems:"center",
                justifyContent:"space-between", marginBottom:"14px" }}>
                <div style={{ width:"38px", height:"38px", borderRadius:"10px",
                  background:`${s.accent}15`, border:`1px solid ${s.accent}30`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"16px", color:s.accent }}>{s.icon}</div>
                <span style={{ fontSize:"10px", color:s.accent,
                  fontFamily:"var(--mono)", letterSpacing:"0.1em",
                  textTransform:"uppercase", padding:"4px 8px",
                  background:`${s.accent}12`, borderRadius:"4px" }}>{s.tag}</span>
              </div>
              <h3 style={{ fontSize:"16px", fontWeight:700, color:"#fff",
                marginBottom:"8px", letterSpacing:"-0.02em" }}>{s.name}</h3>
              <p style={{ fontSize:"13px", color:"var(--muted2)", lineHeight:1.65 }}>{s.desc}</p>
            </motion.div>
          ))}

          {/* + More coming */}
          <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
            transition={{delay:0.6, duration:0.7}}
            style={{ background:"transparent",
              border:"1px dashed rgba(255,255,255,0.1)",
              borderRadius:"14px", padding:"24px 22px",
              display:"flex", alignItems:"center",
              justifyContent:"center", flexDirection:"column", gap:"8px" }}>
            <span style={{ fontSize:"28px", color:"var(--muted)" }}>+</span>
            <span style={{ fontSize:"13px", color:"var(--muted)",
              textAlign:"center", lineHeight:1.5 }}>More sources<br/>added quarterly</span>
          </motion.div>
        </div>

        {/* Integration diagram */}
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{delay:0.7, duration:0.7}}
          style={{ marginTop:"40px", background:"var(--surface)",
            border:"1px solid var(--border)", borderRadius:"14px",
            padding:"28px 32px" }}>
          <div style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)",
            letterSpacing:"0.1em", textTransform:"uppercase",
            marginBottom:"16px" }}>Integration Method</div>
          <div style={{ display:"flex", alignItems:"center",
            gap:"12px", flexWrap:"wrap" }}>
            {["7 External APIs", "→", "PostgreSQL FDW", "→", "Schema-namespaced tables",
              "→", "Unified feasibility DB", "→", "pgvector RAG layer"].map((t,i) => (
              <span key={i} style={{ fontSize:"13px",
                color: t==="→" ? "var(--muted)" : "var(--muted2)",
                fontFamily:"var(--mono)",
                background: t!=="→" ? "var(--srf2)" : "transparent",
                border: t!=="→" ? "1px solid var(--border)" : "none",
                padding: t!=="→" ? "6px 12px" : "0",
                borderRadius:"6px", letterSpacing:"0.02em" }}>{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── WORKFLOW TIMELINE ────────────────────────────────────────────────────────
const Workflow = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  const steps = [
    { n:"01", title:"Protocol Brief Input", accent:"#00D4FF",
      desc:"User enters therapeutic area, indication, phase, and primary objective via the conversational interface.",
      time:"< 5 min", tag:"User Input" },
    { n:"02", title:"Orchestrator Decomposition", accent:"#7C3AED",
      desc:"The Orchestrator Agent parses the brief, identifies required protocol sections, and dispatches tasks to specialist agents.",
      time:"< 30 sec", tag:"AI Orchestration" },
    { n:"03", title:"RAG Retrieval", accent:"#00FF94",
      desc:"The Retrieval Agent queries pgvector across all 7 data sources, returning ranked evidence for each protocol section.",
      time:"< 60 sec", tag:"Knowledge Retrieval" },
    { n:"04", title:"Protocol Generation", accent:"#FF8A3D",
      desc:"The Writer Agent generates each section with full evidence grounding. Citations are embedded inline with confidence scores.",
      time:"2–4 min", tag:"AI Authoring" },
    { n:"05", title:"Statistical Planning", accent:"#FF5E7A",
      desc:"The Stats Agent calculates sample size, power, and recommends statistical methodology aligned to the primary endpoint.",
      time:"< 2 min", tag:"Biostatistics" },
    { n:"06", title:"Review & Risk Scoring", accent:"#00D4FF",
      desc:"The Review Agent validates the full draft against FDA/EMA guidelines, flags amendment risks, and scores regulatory readiness.",
      time:"< 90 sec", tag:"Quality Gate" },
    { n:"07", title:"Human Review & Export", accent:"#7C3AED",
      desc:"The medical writer reviews the AI draft with full citation transparency. Approved protocol exports to Word/PDF with audit trail.",
      time:"Async", tag:"Human-in-Loop" },
  ];

  return (
    <section id="workflow" ref={ref} style={{ padding:"120px 24px",
      background:"var(--bg2)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent)" }}/>
      <div style={{ maxWidth:"860px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.6}} style={{ textAlign:"center", marginBottom:"72px" }}>
          <SectionNum n={4} />
          <Label>Protocol Workflow</Label>
          <h2 style={{ fontSize:"clamp(28px,4vw,52px)", fontWeight:800, letterSpacing:"-0.03em" }}>
            From brief to protocol<br/>
            <span className="shimmer">in under 10 minutes</span>
          </h2>
          <p style={{ color:"var(--muted2)", marginTop:"16px", fontSize:"16px",
            maxWidth:"460px", margin:"16px auto 0", lineHeight:1.7 }}>
            A fully traceable, 7-step pipeline from user input to regulatory-ready protocol draft.
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ position:"relative" }}>
          {/* Vertical line */}
          <div style={{ position:"absolute", left:"30px", top:"20px", bottom:"20px",
            width:"1px", background:"linear-gradient(180deg,rgba(0,212,255,0.4),rgba(124,58,237,0.4),rgba(0,255,148,0.4))" }}/>

          <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
            {steps.map((step, i) => (
              <motion.div key={step.n}
                initial={{opacity:0, x:30}} animate={inView?{opacity:1,x:0}:{}}
                transition={{delay:i*0.1, duration:0.7, ease:[0.22,1,0.36,1]}}
                style={{ display:"flex", gap:"28px",
                  paddingBottom: i < steps.length-1 ? "32px" : "0" }}>
                {/* Step dot */}
                <div style={{ flexShrink:0, display:"flex", flexDirection:"column",
                  alignItems:"center", width:"60px" }}>
                  <div style={{ width:"20px", height:"20px", borderRadius:"50%",
                    background:step.accent, border:`3px solid var(--bg2)`,
                    boxShadow:`0 0 16px ${step.accent}60`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    zIndex:1, position:"relative",
                    animation:`glow 3s ease-in-out infinite`,
                    animationDelay:`${i*0.4}s` }}/>
                </div>

                {/* Step content */}
                <div style={{ flex:1, background:"var(--surface)",
                  border:"1px solid var(--border)", borderRadius:"12px",
                  padding:"20px 22px",
                  borderLeft:`2px solid ${step.accent}44`,
                  marginBottom:"4px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", flexWrap:"wrap", gap:"8px",
                    marginBottom:"8px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <span style={{ fontFamily:"var(--mono)", fontSize:"11px",
                        color:step.accent, letterSpacing:"0.06em" }}>{step.n}</span>
                      <h3 style={{ fontSize:"16px", fontWeight:700, color:"#fff",
                        letterSpacing:"-0.02em" }}>{step.title}</h3>
                    </div>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                      <span style={{ fontSize:"11px", fontFamily:"var(--mono)",
                        color:"var(--green)", padding:"3px 8px",
                        background:"rgba(0,255,148,0.08)",
                        border:"1px solid rgba(0,255,148,0.2)",
                        borderRadius:"4px" }}>⏱ {step.time}</span>
                      <span style={{ fontSize:"11px", color:step.accent,
                        fontFamily:"var(--mono)", letterSpacing:"0.06em",
                        padding:"3px 8px", background:`${step.accent}0F`,
                        border:`1px solid ${step.accent}25`, borderRadius:"4px",
                        textTransform:"uppercase" }}>{step.tag}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:"13px", color:"var(--muted2)",
                    lineHeight:1.65 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Total time badge */}
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
          transition={{delay:0.8, duration:0.7}}
          style={{ marginTop:"40px", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"12px",
            padding:"16px 28px",
            background:"linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))",
            border:"1px solid rgba(0,212,255,0.2)", borderRadius:"100px" }}>
            <span style={{ fontSize:"28px", fontWeight:900, color:"var(--accent)",
              fontFamily:"var(--mono)", letterSpacing:"-0.04em" }}>~10 min</span>
            <span style={{ fontSize:"14px", color:"var(--muted2)", lineHeight:1.4 }}>
              Average time from brief<br/>to review-ready protocol draft
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── EXPLAINABILITY ───────────────────────────────────────────────────────────
const Explainability = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [step, setStep] = useState(0);

  const chain = [
    { label:"Protocol Statement", text:`"Primary endpoint: OS at 24 months in patients with Stage III NSCLC receiving pembrolizumab + chemotherapy vs. chemotherapy alone"`, color:"#fff", icon:"📄" },
    { label:"Writer Agent Rationale", text:"Selected OS as primary endpoint based on FDA oncology guidance (FDA-2018-D-3460) and precedent from 47 similar NSCLC trials in ClinicalTrials.gov.", color:"var(--accent)", icon:"✦" },
    { label:"Retrieval Source 1", text:"ClinicalTrials.gov NCT02578680 (KEYNOTE-189): OS primary endpoint confirmed for pembrolizumab + chemo in NSCLC. Median OS 22.0 vs 10.7 months.", color:"var(--violet)", icon:"◎" },
    { label:"Retrieval Source 2", text:"PubMed PMID:30280652 — Gadgeel et al. 2019. Pembrolizumab + carboplatin/pemetrexed in Stage IV NSCLC. HR 0.56 (95% CI 0.45–0.70).", color:"var(--green)", icon:"⬡" },
    { label:"Review Agent Flag", text:"No issues. OS endpoint aligns with FDA 2022 oncology guidance. Sample size for 80% power at HR 0.75 = 342 patients per arm.", color:"var(--orange)", icon:"△" },
  ];

  return (
    <section ref={ref} style={{ padding:"120px 24px" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
          <motion.div initial={{opacity:0,x:-30}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.8, ease:[0.22,1,0.36,1]}}>
            <SectionNum n={5} />
            <Label color="var(--green)">Explainable AI</Label>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800,
              letterSpacing:"-0.03em", marginBottom:"20px" }}>
              Nobody can explain<br/>
              <span style={{ fontFamily:"var(--serif)", fontStyle:"italic",
                fontWeight:400 }}>how it works</span>
              <span style={{ color:"var(--green)" }}>.</span><br/>
              <span style={{ color:"var(--muted2)", fontFamily:"var(--serif)",
                fontStyle:"italic", fontWeight:400, fontSize:"0.8em" }}>Until now.</span>
            </h2>
            <p style={{ fontSize:"15px", color:"var(--muted2)", lineHeight:1.75,
              marginBottom:"28px" }}>
              Every single protocol statement in ProtocolIQ carries a full citation chain —
              from the raw data source through the agent's reasoning to the final text.
              No black boxes. No hallucinations. Full ALCOA+ audit trail.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {["Full source citation per statement","Agent reasoning transparency","Confidence score per claim","ALCOA+ compliant audit trail","Regulatory-ready evidence package"].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                  <div style={{ width:"6px", height:"6px", borderRadius:"50%",
                    background:"var(--green)", flexShrink:0 }}/>
                  <span style={{ fontSize:"14px", color:"var(--muted2)" }}>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Citation chain demo */}
          <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}}
            transition={{delay:0.2, duration:0.8, ease:[0.22,1,0.36,1]}}>
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:"16px", overflow:"hidden" }}>
              {/* Terminal header */}
              <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)",
                display:"flex", alignItems:"center", gap:"8px",
                background:"var(--srf2)" }}>
                <div style={{ display:"flex", gap:"6px" }}>
                  {["#FF5E7A","#FF8A3D","#00FF94"].map(c => (
                    <div key={c} style={{ width:"10px", height:"10px",
                      borderRadius:"50%", background:c }}/>
                  ))}
                </div>
                <span style={{ fontFamily:"var(--mono)", fontSize:"11px",
                  color:"var(--muted)", letterSpacing:"0.06em", marginLeft:"8px" }}>
                  citation-chain.json
                </span>
              </div>
              <div style={{ padding:"20px" }}>
                <div style={{ fontSize:"11px", color:"var(--muted)", fontFamily:"var(--mono)",
                  letterSpacing:"0.1em", textTransform:"uppercase",
                  marginBottom:"16px" }}>Live citation chain · Click to expand</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {chain.map((c, i) => (
                    <div key={i} onClick={() => setStep(step===i ? -1 : i)}
                      style={{ borderRadius:"8px", overflow:"hidden",
                        border:`1px solid ${step===i ? c.color+"44" : "var(--border)"}`,
                        cursor:"pointer", transition:"border-color 0.25s" }}>
                      <div style={{ padding:"10px 14px", display:"flex",
                        alignItems:"center", gap:"10px",
                        background: step===i ? `${c.color}0D` : "var(--srf2)" }}>
                        <span style={{ fontSize:"14px" }}>{c.icon}</span>
                        <span style={{ fontSize:"12px", fontWeight:600,
                          color: step===i ? c.color : "var(--muted2)",
                          fontFamily:"var(--mono)", transition:"color 0.25s" }}>{c.label}</span>
                        <span style={{ marginLeft:"auto", color:"var(--muted)",
                          fontSize:"14px", transition:"transform 0.25s",
                          display:"inline-block",
                          transform: step===i ? "rotate(90deg)" : "rotate(0)" }}>›</span>
                      </div>
                      <AnimatePresence>
                        {step===i && (
                          <motion.div initial={{height:0,opacity:0}}
                            animate={{height:"auto",opacity:1}}
                            exit={{height:0,opacity:0}}
                            transition={{duration:0.3}}>
                            <div style={{ padding:"12px 14px 14px",
                              fontSize:"12px", color:"var(--muted2)",
                              lineHeight:1.65, fontStyle:"italic",
                              borderTop:`1px solid ${c.color}22` }}>{c.text}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── FEASIBILITY MAP ──────────────────────────────────────────────────────────
const FeasibilitySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  const countries = [
    { name:"United States", score:94, pop:"High", reg:"FDA", accent:"#00D4FF" },
    { name:"Germany", score:91, pop:"High", reg:"BfArM/EMA", accent:"#00D4FF" },
    { name:"Japan", score:88, pop:"High", reg:"PMDA", accent:"#7C3AED" },
    { name:"India", score:82, pop:"Very High", reg:"CDSCO", accent:"#7C3AED" },
    { name:"Brazil", score:76, pop:"High", reg:"ANVISA", accent:"#00FF94" },
    { name:"South Korea", score:85, pop:"Medium", reg:"MFDS", accent:"#00FF94" },
  ];

  const dims = ["Patient Population","Disease Burden","Regulatory Speed","Site Infrastructure","Enrolment History","Cost Efficiency"];

  return (
    <section id="feasibility" ref={ref} style={{ padding:"120px 24px",
      background:"var(--bg2)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.2),transparent)" }}/>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.6}} style={{ textAlign:"center", marginBottom:"64px" }}>
          <SectionNum n={2} />
          <Label>Site Feasibility Engine</Label>
          <h2 style={{ fontSize:"clamp(28px,4vw,52px)", fontWeight:800, letterSpacing:"-0.03em" }}>
            Country scoring in{" "}
            <span className="shimmer">minutes, not weeks</span>
          </h2>
          <p style={{ color:"var(--muted2)", marginTop:"16px", fontSize:"16px",
            maxWidth:"480px", margin:"16px auto 0", lineHeight:1.7 }}>
            15+ dimensions. 7 data sources. Composite ranking with full transparency on every score.
          </p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"32px" }}>
          {/* Country scores */}
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)",
              letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"8px" }}>
              Country Feasibility Rankings — NSCLC Phase III
            </div>
            {countries.map((c, i) => (
              <motion.div key={c.name}
                initial={{opacity:0, x:-20}} animate={inView?{opacity:1,x:0}:{}}
                transition={{delay:i*0.08, duration:0.6}}
                style={{ background:"var(--surface)", border:"1px solid var(--border)",
                  borderRadius:"10px", padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:"8px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontFamily:"var(--mono)", fontSize:"12px",
                      color:"var(--muted)", width:"20px" }}>#{i+1}</span>
                    <span style={{ fontSize:"14px", fontWeight:600, color:"#fff" }}>{c.name}</span>
                    <span style={{ fontSize:"10px", padding:"2px 7px",
                      background:`${c.accent}12`, color:c.accent,
                      borderRadius:"4px", fontFamily:"var(--mono)" }}>{c.reg}</span>
                  </div>
                  <span style={{ fontFamily:"var(--mono)", fontSize:"16px",
                    fontWeight:800, color:c.accent }}>{c.score}</span>
                </div>
                {/* Score bar */}
                <div style={{ height:"4px", background:"var(--srf2)", borderRadius:"2px" }}>
                  <motion.div initial={{width:0}}
                    animate={inView?{width:`${c.score}%`}:{}}
                    transition={{delay:0.3+i*0.08, duration:0.8, ease:[0.22,1,0.36,1]}}
                    style={{ height:"100%", borderRadius:"2px",
                      background:`linear-gradient(90deg,${c.accent},${c.accent}88)` }}/>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scoring dimensions */}
          <motion.div initial={{opacity:0, x:20}} animate={inView?{opacity:1,x:0}:{}}
            transition={{delay:0.3, duration:0.7}}>
            <div style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)",
              letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"16px" }}>
              Scoring Dimensions
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px",
              marginBottom:"24px" }}>
              {dims.map((d, i) => (
                <div key={d} style={{ background:"var(--surface)",
                  border:"1px solid var(--border)", borderRadius:"8px",
                  padding:"12px 14px",
                  borderLeft:`2px solid ${["var(--accent)","var(--violet)","var(--green)","var(--orange)","var(--red)","var(--accent)"][i%6]}` }}>
                  <div style={{ fontSize:"11px", color:"var(--muted2)",
                    letterSpacing:"0.02em" }}>{d}</div>
                </div>
              ))}
            </div>

            {/* Data sources used */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:"12px", padding:"20px 22px" }}>
              <div style={{ fontSize:"11px", color:"var(--muted)", fontFamily:"var(--mono)",
                letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"12px" }}>
                Powered By
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {["IHME GBD","GLOBOCAN","WHO GHO","World Bank","ClinicalTrials.gov"].map(s => (
                  <span key={s} style={{ fontSize:"11px", fontFamily:"var(--mono)",
                    color:"var(--accent)", padding:"4px 10px",
                    background:"rgba(0,212,255,0.08)",
                    border:"1px solid rgba(0,212,255,0.2)",
                    borderRadius:"5px", letterSpacing:"0.04em" }}>{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
const FinalCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="demo" ref={ref} style={{ padding:"120px 24px",
      position:"relative", overflow:"hidden" }}>
      <GridBg />
      <div style={{ position:"relative", zIndex:1, maxWidth:"680px",
        margin:"0 auto", textAlign:"center" }}>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.7}}>
          <Label>Get Early Access</Label>
          <h2 style={{ fontSize:"clamp(30px,5vw,56px)", fontWeight:800,
            letterSpacing:"-0.035em", lineHeight:1.08, marginBottom:"20px" }}>
            Ready to run your trials<br/>
            <span className="shimmer">50% faster?</span>
          </h2>
          <p style={{ color:"var(--muted2)", fontSize:"16px", lineHeight:1.75,
            marginBottom:"40px", maxWidth:"480px", margin:"0 auto 40px" }}>
            Join clinical teams across the US, EU & APAC.
            Book a live 30-minute demo — we'll generate a protocol for your TA on the spot.
          </p>

          {!sent ? (
            <div style={{ display:"flex", gap:"12px", maxWidth:"440px", margin:"0 auto" }}>
              <input value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="your@pharma.com"
                style={{ flex:1, padding:"13px 16px",
                  background:"var(--surface)", border:"1px solid var(--border)",
                  borderRadius:"9px", color:"var(--text)", fontSize:"14px",
                  outline:"none", fontFamily:"var(--head)",
                  transition:"border-color 0.2s" }}
                onFocus={e=>e.target.style.borderColor="rgba(0,212,255,0.4)"}
                onBlur={e=>e.target.style.borderColor="var(--border)"}/>
              <button onClick={()=>{if(email)setSent(true)}}
                style={{ padding:"13px 24px", whiteSpace:"nowrap",
                  background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
                  border:"none", borderRadius:"9px", color:"#fff",
                  fontSize:"14px", fontWeight:700, cursor:"pointer",
                  boxShadow:"0 0 30px rgba(0,212,255,0.2)",
                  transition:"all 0.25s" }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 0 50px rgba(0,212,255,0.35)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="0 0 30px rgba(0,212,255,0.2)"}>
                Book Demo →
              </button>
            </div>
          ) : (
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
              style={{ padding:"20px 32px",
                background:"rgba(0,255,148,0.06)",
                border:"1px solid rgba(0,255,148,0.25)",
                borderRadius:"12px", display:"inline-block" }}>
              <span style={{ fontSize:"16px", color:"var(--green)", fontWeight:600 }}>
                ✓ We'll reach out within 24 hours!
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ borderTop:"1px solid var(--border)", padding:"28px 32px",
    display:"flex", justifyContent:"space-between", alignItems:"center",
    flexWrap:"wrap", gap:"16px", background:"var(--bg2)" }}>
    <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
      <div style={{ width:"28px", height:"28px", borderRadius:"7px",
        background:"linear-gradient(135deg,#00D4FF,#7C3AED)",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"var(--mono)", fontSize:"12px", fontWeight:700, color:"#fff" }}>P</span>
      </div>
      <span style={{ fontFamily:"var(--mono)", fontSize:"12px", color:"var(--muted)" }}>
        © 2025 ProtocolIQ · knavis-ai.com
      </span>
    </div>
    <div style={{ display:"flex", gap:"24px" }}>
      {["Home","Platform","About","Demo","Privacy"].map(l => (
        <a key={l} href="#" style={{ fontSize:"13px", color:"var(--muted)",
          textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e=>e.target.style.color="var(--accent)"}
          onMouseLeave={e=>e.target.style.color="var(--muted)"}>{l}</a>
      ))}
    </div>
  </footer>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function PlatformPage() {
  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"var(--head)" }}>
      <GlobalStyles />
      <Navbar />
      <main>
        <PageHero />
        <ArchDiagram />
        <Agents />
        <FeasibilitySection />
        <DataSources />
        <Workflow />
        <Explainability />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
