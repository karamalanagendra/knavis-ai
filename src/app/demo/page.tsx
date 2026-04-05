"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── STYLES ───────────────────────────────────────────────────────────────────
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
    }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    ::selection { background: rgba(0,212,255,0.2); }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: var(--violet); border-radius: 2px; }
    @keyframes shimmer   { from{background-position:-300% center} to{background-position:300% center} }
    @keyframes gridpulse { 0%,100%{opacity:0.03} 50%{opacity:0.08} }
    @keyframes scan      { 0%{top:0%;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0} }
    @keyframes glow      { 0%,100%{opacity:0.5} 50%{opacity:1} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes check-in  { 0%{transform:scale(0) rotate(-45deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
    @keyframes progress  { from{width:0%} to{width:100%} }
    .shimmer { background:linear-gradient(90deg,#00D4FF,#7C3AED,#00FF94,#00D4FF); background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
    input, select, textarea { font-family:'Outfit',sans-serif; }
    input:focus, select:focus, textarea:focus { outline:none; }
  `}</style>
);

const Label = ({ children, color = "var(--accent)" }) => (
  <div style={{ fontFamily:"var(--mono)", fontSize:"11px", color, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"12px" }}>◆ {children}</div>
);

const GridBg = () => (
  <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
    <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle,rgba(0,212,255,0.07) 1px,transparent 1px)`, backgroundSize:"30px 30px", animation:"gridpulse 7s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.3),transparent)", animation:"scan 8s linear infinite", top:0 }}/>
    <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:"900px", height:"500px", background:"radial-gradient(ellipse,rgba(124,58,237,0.1) 0%,rgba(0,212,255,0.05) 40%,transparent 70%)", filter:"blur(60px)" }}/>
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 32px",
      background: scrolled ? "rgba(6,6,15,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition:"all 0.3s" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:"68px" }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:"linear-gradient(135deg,#00D4FF,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 16px rgba(0,212,255,0.25)" }}>
            <span style={{ fontFamily:"var(--mono)", fontSize:"14px", fontWeight:700, color:"#fff" }}>P</span>
          </div>
          <div>
            <div style={{ fontSize:"16px", fontWeight:800, letterSpacing:"-0.03em", color:"#fff" }}>Protocol<span style={{color:"var(--accent)"}}>IQ</span></div>
            <div style={{ fontSize:"9px", color:"var(--muted)", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:"var(--mono)" }}>knavis-ai.com</div>
          </div>
        </a>
        <div style={{ display:"flex", gap:"2px" }}>
          {["Platform","About","Blog"].map(l => (
            <a key={l} href={`/${l.toLowerCase()}`} style={{ padding:"6px 14px", color:"var(--muted)", fontSize:"14px", fontWeight:500, textDecoration:"none", borderRadius:"6px", transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color="#fff"}
              onMouseLeave={e=>e.target.style.color="var(--muted)"}>{l}</a>
          ))}
        </div>
        <a href={`https://app.knavis-ai.com`} style={{ padding:"9px 22px", background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)", borderRadius:"8px", color:"var(--muted2)", fontSize:"13px", fontWeight:600, textDecoration:"none" }}>Sign In</a>
      </div>
    </nav>
  );
};

// ─── DEMO FORM ────────────────────────────────────────────────────────────────
const DemoForm = () => {
  const [form, setForm] = useState({ name:"", email:"", company:"", role:"", ta:"", trials:"", message:"" });
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = ["CTO / Chief Digital Officer","VP Clinical Operations","Medical Director / CMO","Clinical Data Manager","Biostatistician","Regulatory Affairs","Clinical Project Manager","Other"];
  const tas = ["Oncology","Cardiovascular","CNS / Neurology","Infectious Disease","Rare Disease","Metabolic / Endocrine","Immunology / Inflammation","Other"];
  const trialRanges = ["1–5 trials / year","6–15 trials / year","16–30 trials / year","31–50 trials / year","50+ trials / year"];

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.role)           e.role    = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1800);
  };

  const inputStyle = (field) => ({
    width:"100%", padding:"12px 16px",
    background:"var(--srf2)",
    border:`1px solid ${errors[field] ? "rgba(255,94,122,0.5)" : "var(--border)"}`,
    borderRadius:"9px", color:"var(--text)", fontSize:"14px",
    transition:"border-color 0.2s",
  });

  const onFocus = e => e.target.style.borderColor = "rgba(0,212,255,0.4)";
  const onBlur  = e => e.target.style.borderColor = errors[e.target.name] ? "rgba(255,94,122,0.5)" : "var(--border)";

  return (
    <div style={{ background:"var(--surface)", border:"1px solid rgba(0,212,255,0.12)", borderRadius:"20px", overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,var(--accent),var(--violet),transparent)" }}/>
      <div style={{ position:"absolute", top:0, right:0, width:"200px", height:"200px", background:"radial-gradient(circle,rgba(0,212,255,0.06),transparent 70%)", pointerEvents:"none" }}/>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,x:-20}} transition={{duration:0.4}}
            style={{ padding:"44px 40px" }}>

            {/* Form header */}
            <div style={{ marginBottom:"32px" }}>
              <Label>Book Your Demo</Label>
              <h2 style={{ fontSize:"26px", fontWeight:800, color:"#fff", letterSpacing:"-0.03em", marginBottom:"8px" }}>
                See ProtocolIQ generate a protocol — <span className="shimmer">live</span>
              </h2>
              <p style={{ fontSize:"14px", color:"var(--muted2)", lineHeight:1.65 }}>
                30 minutes. We'll build a protocol draft for your therapeutic area on the spot. No slides, no pitches.
              </p>
            </div>

            {/* Row 1 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
              <div>
                <label style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"7px" }}>Full Name *</label>
                <input name="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="Dr. Jane Smith" style={inputStyle("name")}/>
                {errors.name && <div style={{ fontSize:"11px", color:"var(--red)", marginTop:"4px" }}>{errors.name}</div>}
              </div>
              <div>
                <label style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"7px" }}>Work Email *</label>
                <input name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="jane@pharma.com" type="email" style={inputStyle("email")}/>
                {errors.email && <div style={{ fontSize:"11px", color:"var(--red)", marginTop:"4px" }}>{errors.email}</div>}
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
              <div>
                <label style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"7px" }}>Company *</label>
                <input name="company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}
                  onFocus={onFocus} onBlur={onBlur}
                  placeholder="Pharma Co. / CRO" style={inputStyle("company")}/>
                {errors.company && <div style={{ fontSize:"11px", color:"var(--red)", marginTop:"4px" }}>{errors.company}</div>}
              </div>
              <div>
                <label style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"7px" }}>Your Role *</label>
                <select name="role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
                  onFocus={onFocus} onBlur={onBlur}
                  style={{ ...inputStyle("role"), cursor:"pointer", appearance:"none" }}>
                  <option value="">Select your role…</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.role && <div style={{ fontSize:"11px", color:"var(--red)", marginTop:"4px" }}>{errors.role}</div>}
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
              <div>
                <label style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"7px" }}>Primary Therapeutic Area</label>
                <select value={form.ta} onChange={e=>setForm({...form,ta:e.target.value})}
                  style={{ ...inputStyle("ta"), cursor:"pointer", appearance:"none" }}>
                  <option value="">Select TA…</option>
                  {tas.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"7px" }}>Trials per Year</label>
                <select value={form.trials} onChange={e=>setForm({...form,trials:e.target.value})}
                  style={{ ...inputStyle("trials"), cursor:"pointer", appearance:"none" }}>
                  <option value="">Select range…</option>
                  {trialRanges.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom:"28px" }}>
              <label style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"7px" }}>Anything specific you'd like to see?</label>
              <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                placeholder="e.g. 'Phase III Oncology protocol', 'NSCLC feasibility scoring', 'SDTM automation'…"
                rows={3}
                style={{ width:"100%", padding:"12px 16px", background:"var(--srf2)", border:"1px solid var(--border)", borderRadius:"9px", color:"var(--text)", fontSize:"14px", resize:"vertical", lineHeight:1.6, transition:"border-color 0.2s" }}
                onFocus={onFocus} onBlur={onBlur}/>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading}
              style={{ width:"100%", padding:"16px", background: loading ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg,#00D4FF,#7C3AED)", border:"none", borderRadius:"11px", color:"#fff", fontSize:"15px", fontWeight:700, cursor: loading ? "wait" : "pointer", letterSpacing:"-0.01em", boxShadow:"0 0 40px rgba(0,212,255,0.2)", transition:"all 0.3s", position:"relative", overflow:"hidden" }}
              onMouseEnter={e=>!loading && (e.currentTarget.style.boxShadow="0 0 60px rgba(0,212,255,0.35)")}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="0 0 40px rgba(0,212,255,0.2)"}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                  <span style={{ width:"16px", height:"16px", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                  Booking your demo…
                </span>
              ) : "Book My 30-Minute Demo →"}
              {loading && (
                <div style={{ position:"absolute", bottom:0, left:0, height:"2px", background:"rgba(255,255,255,0.5)", animation:"progress 1.8s ease forwards" }}/>
              )}
            </button>

            <p style={{ textAlign:"center", fontSize:"12px", color:"var(--muted)", marginTop:"14px" }}>
              No commitment. We'll confirm within 24 hours with a calendar invite.
            </p>
          </motion.div>
        ) : (
          // ── Success state ──
          <motion.div key="success" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
            style={{ padding:"60px 40px", textAlign:"center" }}>

            {/* Animated check */}
            <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"rgba(0,255,148,0.1)", border:"2px solid rgba(0,255,148,0.35)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", fontSize:"36px", animation:"check-in 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
              ✓
            </div>

            <h2 style={{ fontSize:"30px", fontWeight:800, color:"#fff", letterSpacing:"-0.03em", marginBottom:"12px" }}>
              You're booked!
            </h2>
            <p style={{ fontSize:"16px", color:"var(--muted2)", lineHeight:1.75, marginBottom:"32px", maxWidth:"380px", margin:"0 auto 32px" }}>
              We'll reach out to <span style={{color:"var(--accent)"}}>{form.email}</span> within <strong style={{color:"#fff"}}>24 hours</strong> with a calendar invite for your personalised demo.
            </p>

            {/* What to expect */}
            <div style={{ background:"var(--srf2)", border:"1px solid var(--border)", borderRadius:"12px", padding:"24px", textAlign:"left", marginBottom:"28px" }}>
              <div style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"16px" }}>What happens next</div>
              {[
                { icon:"📧", text:"Confirmation email with calendar invite", t:"Within 24 hours" },
                { icon:"📋", text:"We'll review your TA and prepare a relevant protocol brief", t:"Before the call" },
                { icon:"🚀", text:"Live 30-min demo — protocol generated in your TA", t:"During the call" },
                { icon:"📄", text:"Follow-up with the generated protocol draft + platform access", t:"After the call" },
              ].map(({ icon, text, t }) => (
                <div key={text} style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"14px" }}>
                  <span style={{ fontSize:"18px", flexShrink:0 }}>{icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"13px", color:"var(--muted2)" }}>{text}</div>
                  </div>
                  <span style={{ fontSize:"11px", color:"var(--accent)", fontFamily:"var(--mono)", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
              <a href="/platform" style={{ padding:"12px 24px", background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(124,58,237,0.15))", border:"1px solid rgba(0,212,255,0.3)", borderRadius:"9px", color:"#fff", fontSize:"14px", fontWeight:600, textDecoration:"none" }}>Explore the Platform →</a>
              <a href="/blog" style={{ padding:"12px 22px", background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", borderRadius:"9px", color:"var(--muted2)", fontSize:"14px", fontWeight:500, textDecoration:"none" }}>Read our blog</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

// ─── WHAT TO EXPECT ───────────────────────────────────────────────────────────
const WhatToExpect = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  const steps = [
    { n:"01", title:"We review your brief", desc:"Tell us your therapeutic area and what you'd like to see. We'll prepare a relevant protocol context before the call.", icon:"📋", accent:"var(--accent)" },
    { n:"02", title:"Live protocol generation", desc:"Watch ProtocolIQ generate a full protocol draft for your TA — live, in real time. Including endpoint selection, sample size, and feasibility scoring.", icon:"⚡", accent:"var(--violet)" },
    { n:"03", title:"Citation chain walkthrough", desc:"We'll show you exactly how every AI recommendation is grounded — from raw data source to final output. No black boxes.", icon:"🔍", accent:"var(--green)" },
    { n:"04", title:"Your questions, answered", desc:"Get direct answers from the founder — 18+ years of clinical + AI expertise. No sales scripts.", icon:"💬", accent:"var(--orange)" },
  ];

  return (
    <div ref={ref} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <Label>What to Expect</Label>
      <h3 style={{ fontSize:"22px", fontWeight:800, color:"#fff", letterSpacing:"-0.03em", marginBottom:"8px" }}>
        30 minutes. No slides.<br/>
        <span style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", fontWeight:400, color:"var(--muted2)" }}>Pure product.</span>
      </h3>
      <p style={{ fontSize:"14px", color:"var(--muted2)", lineHeight:1.7, marginBottom:"8px" }}>
        Every demo is personalised to your therapeutic area and use case. You'll see real AI outputs for your context — not canned screenshots.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginTop:"8px" }}>
        {steps.map((s, i) => (
          <motion.div key={s.n}
            initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}}
            transition={{delay:i*0.1, duration:0.6, ease:[0.22,1,0.36,1]}}
            style={{ display:"flex", gap:"14px", alignItems:"flex-start", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"12px", padding:"18px 16px", borderLeft:`2px solid ${s.accent}44` }}>
            <span style={{ fontSize:"22px", flexShrink:0, animation:`float 4s ease-in-out infinite`, animationDelay:`${i*0.6}s` }}>{s.icon}</span>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                <span style={{ fontFamily:"var(--mono)", fontSize:"10px", color:s.accent, letterSpacing:"0.06em" }}>{s.n}</span>
                <span style={{ fontSize:"14px", fontWeight:700, color:"#fff" }}>{s.title}</span>
              </div>
              <p style={{ fontSize:"13px", color:"var(--muted2)", lineHeight:1.6 }}>{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── SOCIAL PROOF ─────────────────────────────────────────────────────────────
const SocialProof = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  const quotes = [
    { text:"The protocol draft was 65% similar to our finalized version. That's a week of medical writing saved in 8 minutes.", author:"VP Clinical Operations", company:"Global CRO" },
    { text:"Feasibility assessment went from 3 weeks to 2 days. The country scoring is more accurate than our internal model.", author:"Medical Director", company:"Mid-size Pharma" },
    { text:"I showed this to our regulatory team. The citation chain for every AI recommendation is what sold them.", author:"Chief Medical Officer", company:"Biotech" },
  ];

  return (
    <div ref={ref} style={{ marginTop:"40px" }}>
      <div style={{ fontSize:"12px", color:"var(--muted)", fontFamily:"var(--mono)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"16px" }}>What Others Said After Their Demo</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {quotes.map((q, i) => (
          <motion.div key={i}
            initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}}
            transition={{delay:i*0.12, duration:0.6}}
            style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"10px", padding:"18px 16px", position:"relative" }}>
            <div style={{ fontSize:"28px", color:"rgba(0,212,255,0.12)", fontFamily:"Georgia,serif", lineHeight:1, position:"absolute", top:"8px", left:"12px" }}>"</div>
            <p style={{ fontSize:"13px", color:"var(--muted2)", lineHeight:1.65, fontStyle:"italic", paddingLeft:"16px", marginBottom:"12px" }}>{q.text}</p>
            <div style={{ fontSize:"11px", color:"var(--muted)", fontFamily:"var(--mono)" }}>{q.author} · {q.company}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── TRUST BADGES ─────────────────────────────────────────────────────────────
const TrustBadges = () => (
  <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginTop:"28px" }}>
    {[
      { icon:"🔒", label:"SOC 2 Compliant" },
      { icon:"🏥", label:"HIPAA Ready" },
      { icon:"📋", label:"ALCOA+ Audit Trail" },
      { icon:"🌍", label:"US · EU · APAC" },
    ].map(b => (
      <div key={b.label} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:"100px" }}>
        <span style={{ fontSize:"12px" }}>{b.icon}</span>
        <span style={{ fontSize:"11px", color:"var(--muted2)", fontFamily:"var(--mono)", letterSpacing:"0.04em" }}>{b.label}</span>
      </div>
    ))}
  </div>
);

// ─── STATS STRIP ─────────────────────────────────────────────────────────────
const StatsStrip = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <section ref={ref} style={{ padding:"60px 24px", borderBottom:"1px solid var(--border)", background:"var(--bg2)" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
          style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"0" }}>
          {[
            { n:"< 10 min",  l:"Protocol draft time",         c:"var(--accent)"  },
            { n:"32%",       l:"Faster feasibility",          c:"var(--violet)"  },
            { n:"50%",       l:"Fewer amendments",            c:"var(--green)"   },
            { n:"$2.4M",     l:"Avg annual savings",          c:"var(--orange)"  },
            { n:"18+ yrs",   l:"Clinical domain expertise",   c:"var(--accent)"  },
          ].map(({ n, l, c }, i, arr) => (
            <div key={n} style={{ padding:"24px 20px", textAlign:"center", borderRight: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:"28px", fontWeight:900, color:c, letterSpacing:"-0.04em", lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:"12px", color:"var(--muted)", marginTop:"6px", letterSpacing:"0.04em" }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─── FAQ MINI ────────────────────────────────────────────────────────────────
const FAQMini = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  const [open, setOpen] = useState(null);

  const faqs = [
    { q:"Is there any obligation after the demo?", a:"None. The demo is purely educational — we show you what ProtocolIQ can do for your specific use case. No contracts, no follow-up pressure." },
    { q:"Who leads the demo?", a:"The founder, Nagendra Kumar K — 18+ years in clinical data management, 5 US patents, and the architect of the entire ProtocolIQ platform. You get direct access, not a sales rep." },
    { q:"Can we request a specific protocol type?", a:"Absolutely. Tell us your therapeutic area, indication, and phase when you book. We'll prepare a relevant protocol context so the demo is meaningful for your team." },
    { q:"How soon can we get access after the demo?", a:"Beta access can be provisioned within 48 hours of the demo. Enterprise onboarding with your CTMS/eTMF integration typically takes 1–2 weeks." },
  ];

  return (
    <section ref={ref} style={{ padding:"80px 24px 100px" }}>
      <div style={{ maxWidth:"680px", margin:"0 auto" }}>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6}} style={{ marginBottom:"36px", textAlign:"center" }}>
          <Label>Quick Answers</Label>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, letterSpacing:"-0.03em" }}>Before you book</h2>
        </motion.div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {faqs.map((f, i) => (
            <motion.div key={i}
              initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}}
              transition={{delay:i*0.08, duration:0.6}}
              style={{ background:"var(--surface)", border:`1px solid ${open===i ? "rgba(0,212,255,0.2)" : "var(--border)"}`, borderRadius:"10px", overflow:"hidden", transition:"border-color 0.3s" }}>
              <button onClick={()=>setOpen(open===i?null:i)}
                style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 20px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", gap:"16px" }}>
                <span style={{ fontSize:"14px", fontWeight:600, color: open===i ? "#fff" : "var(--muted2)", transition:"color 0.2s" }}>{f.q}</span>
                <span style={{ color:"var(--accent)", fontSize:"18px", flexShrink:0, display:"inline-block", transform: open===i ? "rotate(45deg)" : "rotate(0)", transition:"transform 0.3s" }}>+</span>
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}}>
                    <div style={{ padding:"0 20px 18px", fontSize:"14px", color:"var(--muted2)", lineHeight:1.75 }}>{f.a}</div>
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

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ borderTop:"1px solid var(--border)", padding:"28px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px", background:"var(--bg2)" }}>
    <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
      <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:"linear-gradient(135deg,#00D4FF,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"var(--mono)", fontSize:"12px", fontWeight:700, color:"#fff" }}>P</span>
      </div>
      <span style={{ fontFamily:"var(--mono)", fontSize:"12px", color:"var(--muted)" }}>© 2025 ProtocolIQ · knavis-ai.com</span>
    </div>
    <div style={{ display:"flex", gap:"24px" }}>
      {["Home","Platform","About","Blog","Privacy"].map(l => (
        <a key={l} href={`/${l.toLowerCase()}`} style={{ fontSize:"13px", color:"var(--muted)", textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e=>e.target.style.color="var(--accent)"}
          onMouseLeave={e=>e.target.style.color="var(--muted)"}>{l}</a>
      ))}
    </div>
  </footer>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function DemoPage() {
  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"'Outfit',sans-serif" }}>
      <GlobalStyles />
      <Navbar />
      <main>
        {/* Hero + Form */}
        <section style={{ position:"relative", padding:"120px 24px 80px", overflow:"hidden" }}>
          <GridBg />
          <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:"64px", alignItems:"start" }}>
              {/* Left */}
              <div>
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7}}>
                  <Label>Book a Demo</Label>
                  <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:"clamp(36px,5.5vw,68px)", lineHeight:1.0, letterSpacing:"-0.04em", marginBottom:"16px" }}>
                    See your protocol<br/>
                    <span style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", fontWeight:400, fontSize:"0.85em", color:"var(--muted2)" }}>generated</span>{" "}
                    <span className="shimmer">live</span>
                  </h1>
                  <p style={{ fontSize:"17px", color:"var(--muted2)", lineHeight:1.8, maxWidth:"440px", marginBottom:"40px" }}>
                    30 minutes. Your therapeutic area. Live AI-generated protocol — not a recording, not slides. The real product.
                  </p>
                  <WhatToExpect />
                  <TrustBadges />
                  <SocialProof />
                </motion.div>
              </div>
              {/* Right — Form */}
              <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:0.2,duration:0.8,ease:[0.22,1,0.36,1]}} style={{ position:"sticky", top:"88px" }}>
                <DemoForm />
              </motion.div>
            </div>
          </div>
        </section>

        <StatsStrip />
        <FAQMini />
      </main>
      <Footer />
    </div>
  );
}
