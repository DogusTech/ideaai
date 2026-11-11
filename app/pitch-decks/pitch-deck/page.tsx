import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BioPsych-DSS | EIC Accelerator Pitch Deck",
  description:
    "BioPsych-DSS is an objective, closed-loop clinical decision support system for psychosocial care.",
}

const architecture = [
  {
    number: "01",
    title: "Biometric data layer",
    text: "Agnostic integrations collect HRV and electrodermal activity from commercially available wearables through APIs and SDKs.",
  },
  {
    number: "02",
    title: "Analytical scoring engine",
    text: "Cloud processing filters noise and converts autonomic nervous system signals into an objective Social Isolation Index and Chronic Stress Risk score.",
  },
  {
    number: "03",
    title: "Clinical decision support",
    text: "Scores are surfaced inside existing hospital information systems through interoperable HL7 and FHIR web services.",
  },
  {
    number: "04",
    title: "Closed-loop social prescribing",
    text: "Clinicians assign structured digital or physical social activities, then receive outcome reports based on physiological change.",
  },
]

const milestones = [
  ["01", "Clinical validation", "Establish signal-quality, reliability, and clinical correlation protocols with psychiatric and community-care partners."],
  ["02", "Interoperability pilot", "Integrate the decision-support layer with a first hospital or clinic environment using FHIR/HL7-compatible services."],
  ["03", "Closed-loop evidence", "Measure pre/post activity changes and validate the Clinical Effectiveness Report with prospective cohorts."],
  ["04", "European scale-up", "Expand across care networks, wearable ecosystems, and public-health social-prescribing programmes."],
]

export default function BioPsychPitchDeck() {
  return (
    <main className="bio-page">
      <style>{`
        :root { --ink:#14251f; --muted:#60736b; --paper:#f5f8f2; --mint:#dcefe1; --green:#23744f; --lime:#c8f169; --line:rgba(20,37,31,.14); --orange:#f0a35b; }
        .bio-page { min-height:100vh; color:var(--ink); background:var(--paper); font-family: var(--font-geist-sans), Arial, sans-serif; }
        .bio-shell { max-width:1240px; margin:0 auto; padding:24px clamp(20px,4vw,64px) 80px; }
        .bio-top { display:flex; justify-content:space-between; align-items:center; gap:20px; font-size:12px; letter-spacing:.14em; text-transform:uppercase; }
        .bio-brand { display:flex; gap:12px; align-items:center; font-weight:700; letter-spacing:.02em; text-transform:none; font-size:17px; }
        .bio-mark { width:32px; height:32px; display:grid; place-items:center; border-radius:10px; background:var(--ink); color:var(--lime); font-size:13px; font-weight:800; }
        .bio-label { color:var(--muted); }
        .bio-hero { min-height:680px; display:grid; grid-template-columns:1.04fr .96fr; gap:48px; align-items:center; padding:80px 0 96px; }
        .bio-kicker { color:var(--green); font-size:12px; letter-spacing:.16em; text-transform:uppercase; font-weight:700; }
        .bio-hero h1 { max-width:760px; margin:18px 0 24px; font-size:clamp(54px,8vw,112px); line-height:.9; letter-spacing:-.075em; font-weight:650; }
        .bio-hero h1 em { color:var(--green); font-style:normal; }
        .bio-lead { max-width:620px; color:var(--muted); font-size:clamp(18px,2vw,24px); line-height:1.4; }
        .bio-hero-card { position:relative; min-height:500px; border-radius:36px; overflow:hidden; background:var(--ink); color:white; padding:30px; box-shadow:0 30px 80px rgba(20,37,31,.18); }
        .bio-hero-card:before { content:""; position:absolute; width:380px; height:380px; border-radius:50%; background:var(--lime); right:-120px; top:-90px; filter:blur(2px); opacity:.95; }
        .bio-hero-card:after { content:""; position:absolute; width:260px; height:260px; border-radius:50%; background:var(--orange); left:-90px; bottom:-110px; opacity:.85; }
        .bio-orbit { position:absolute; inset:76px 52px; border:1px solid rgba(255,255,255,.25); border-radius:50%; transform:rotate(-18deg); }
        .bio-orbit:before,.bio-orbit:after { content:""; position:absolute; border:1px solid rgba(255,255,255,.18); border-radius:50%; inset:38px -20px; transform:rotate(44deg); }
        .bio-orbit:after { inset:86px 20px; transform:rotate(-70deg); }
        .bio-center { position:absolute; z-index:2; left:50%; top:50%; transform:translate(-50%,-50%); width:170px; height:170px; display:grid; place-items:center; text-align:center; border-radius:50%; background:rgba(20,37,31,.84); border:1px solid rgba(255,255,255,.3); backdrop-filter:blur(14px); }
        .bio-center strong { display:block; font-size:30px; letter-spacing:-.06em; }
        .bio-center span { display:block; margin-top:5px; color:#ccebd3; font-size:11px; text-transform:uppercase; letter-spacing:.12em; }
        .bio-signal { position:absolute; z-index:3; padding:9px 12px; border:1px solid rgba(255,255,255,.2); border-radius:999px; background:rgba(255,255,255,.1); backdrop-filter:blur(10px); font-size:11px; letter-spacing:.08em; text-transform:uppercase; }
        .bio-signal.one { top:70px; left:28px; }.bio-signal.two { right:24px; top:220px; }.bio-signal.three { left:56px; bottom:70px; }
        .bio-section { padding:96px 0; border-top:1px solid var(--line); }
        .bio-section-head { display:grid; grid-template-columns:.7fr 1.3fr; gap:40px; margin-bottom:52px; }
        .bio-section h2 { margin:0; max-width:680px; font-size:clamp(38px,5.5vw,76px); line-height:.95; letter-spacing:-.07em; font-weight:650; }
        .bio-section-intro { max-width:560px; margin:0; color:var(--muted); font-size:20px; line-height:1.5; }
        .bio-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .bio-card { min-height:240px; padding:24px; border:1px solid var(--line); border-radius:24px; background:rgba(255,255,255,.46); }
        .bio-card.dark { background:var(--ink); color:white; border-color:var(--ink); }.bio-card.lime { background:var(--lime); border-color:var(--lime); }
        .bio-card small { color:var(--green); font-weight:800; letter-spacing:.14em; }.bio-card.dark small { color:var(--lime); }
        .bio-card h3 { margin:38px 0 12px; font-size:23px; letter-spacing:-.04em; }.bio-card p { color:var(--muted); line-height:1.55; }.bio-card.dark p { color:#c8d6cd; }
        .bio-architecture { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line); border:1px solid var(--line); }
        .bio-module { min-height:300px; padding:25px; background:var(--paper); }.bio-module:nth-child(2){background:#e8f4e7}.bio-module:nth-child(3){background:#eef1e8}.bio-module:nth-child(4){background:#d7e8d9}
        .bio-module span { color:var(--green); font-weight:800; font-size:13px; }.bio-module h3 { margin:70px 0 14px; font-size:22px; letter-spacing:-.04em; }.bio-module p { color:var(--muted); line-height:1.5; }
        .bio-metric-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }.bio-metric { padding:25px; border-left:3px solid var(--green); }.bio-metric strong { display:block; font-size:42px; letter-spacing:-.07em; }.bio-metric span { color:var(--muted); font-size:13px; line-height:1.4; }
        .bio-roadmap { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }.bio-step { padding:26px 0; border-top:2px solid var(--green); }.bio-step b { color:var(--green); }.bio-step h3 { margin:36px 0 10px; font-size:20px; }.bio-step p { color:var(--muted); line-height:1.5; }
        .bio-footer { display:flex; justify-content:space-between; gap:28px; align-items:end; padding-top:80px; border-top:1px solid var(--line); }.bio-footer h2 { max-width:720px; margin:0; font-size:clamp(40px,6vw,82px); line-height:.9; letter-spacing:-.07em; }.bio-note { max-width:290px; color:var(--muted); font-size:12px; line-height:1.5; }
        @media (max-width: 800px) { .bio-hero,.bio-section-head { grid-template-columns:1fr; }.bio-hero { padding:60px 0 70px; }.bio-hero-card { min-height:420px; }.bio-grid,.bio-architecture,.bio-metric-row,.bio-roadmap { grid-template-columns:1fr 1fr; }.bio-module { min-height:250px; }.bio-footer { display:block; }.bio-note { margin-top:26px; } }
        @media (max-width: 520px) { .bio-grid,.bio-architecture,.bio-metric-row,.bio-roadmap { grid-template-columns:1fr; }.bio-top { align-items:flex-start; }.bio-label { text-align:right; }.bio-hero h1 { font-size:58px; } }
      `}</style>

      <div className="bio-shell">
        <header className="bio-top">
          <div className="bio-brand"><span className="bio-mark">B</span> BioPsych-DSS</div>
          <div className="bio-label">EIC Accelerator concept deck · Aeternexus, Inc.</div>
        </header>

        <section className="bio-hero">
          <div>
            <div className="bio-kicker">Objective psychiatry · closed-loop care</div>
            <h1>Turn invisible distress into <em>actionable care.</em></h1>
            <p className="bio-lead">
              BioPsych-DSS is a cloud-based clinical decision support system that combines wearable autonomic biomarkers with interoperable hospital workflows and measurable social prescribing.
            </p>
          </div>
          <div className="bio-hero-card" aria-label="BioPsych-DSS system overview">
            <div className="bio-orbit" />
            <div className="bio-center"><div><strong>BioPsych</strong><span>decision support system</span></div></div>
            <div className="bio-signal one">HRV signal</div>
            <div className="bio-signal two">EDA / GSR</div>
            <div className="bio-signal three">FHIR + HL7</div>
          </div>
        </section>

        <section className="bio-section">
          <div className="bio-section-head">
            <div className="bio-kicker">01 · The unmet need</div>
            <div>
              <h2>Mental-health care still runs on snapshots.</h2>
              <p className="bio-section-intro">Stress, anxiety, and social isolation are often assessed through self-report, observation, and periodic questionnaires. These signals can be essential—but they are subjective, intermittent, and disconnected from what happens between appointments.</p>
            </div>
          </div>
          <div className="bio-grid">
            <article className="bio-card dark"><small>CLINICAL GAP</small><h3>Subjective assessments</h3><p>Memory bias, momentary mood, and communication barriers can hide deterioration or overstate progress.</p></article>
            <article className="bio-card"><small>SYSTEM GAP</small><h3>Disconnected care</h3><p>Social prescribing is commonly managed manually, without a continuous physiological feedback loop.</p></article>
            <article className="bio-card lime"><small>EUROPEAN OPPORTUNITY</small><h3>Prevention at scale</h3><p>Ageing, isolation, and pressure on mental-health services create demand for earlier, measurable intervention.</p></article>
          </div>
        </section>

        <section className="bio-section">
          <div className="bio-section-head">
            <div className="bio-kicker">02 · The innovation</div>
            <div><h2>A measurable loop between physiology and participation.</h2><p className="bio-section-intro">BioPsych-DSS does not require a new hardware device. It creates an agnostic intelligence layer around approved wearable ecosystems, clinical information systems, and real-world social interventions.</p></div>
          </div>
          <div className="bio-architecture">
            {architecture.map((item) => <article className="bio-module" key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </section>

        <section className="bio-section">
          <div className="bio-section-head"><div className="bio-kicker">03 · The decision layer</div><div><h2>From raw signals to a clinician-ready picture.</h2><p className="bio-section-intro">The system transforms asynchronous HRV and EDA streams into interpretable scores that sit beside the clinician’s existing assessment—not in a separate consumer app.</p></div></div>
          <div className="bio-metric-row">
            <div className="bio-metric"><strong>HRV</strong><span>Heart-rate variability as an autonomic nervous system signal.</span></div>
            <div className="bio-metric"><strong>EDA</strong><span>Electrodermal activity / GSR as a complementary stress-response signal.</span></div>
            <div className="bio-metric"><strong>SI Index</strong><span>Objective Social Isolation Index generated from longitudinal patterns.</span></div>
            <div className="bio-metric"><strong>CSR</strong><span>Chronic Stress Risk score for monitoring change over time.</span></div>
          </div>
        </section>

        <section className="bio-section">
          <div className="bio-section-head"><div className="bio-kicker">04 · Impact and scale</div><div><h2>Better evidence for better social care.</h2><p className="bio-section-intro">The same closed-loop architecture can support psychiatric clinics, community providers, hospitals, public-health programmes, and social-prescribing networks across Europe.</p></div></div>
          <div className="bio-grid">
            <article className="bio-card"><small>FOR CLINICIANS</small><h3>Earlier visibility</h3><p>Track physiological change between visits and focus clinical attention where risk or deterioration is emerging.</p></article>
            <article className="bio-card"><small>FOR PATIENTS</small><h3>Personalised participation</h3><p>Recommend relevant digital or physical activities and show whether participation is associated with measurable improvement.</p></article>
            <article className="bio-card"><small>FOR SYSTEMS</small><h3>Interoperable deployment</h3><p>Use existing wearables and standards-based hospital interfaces instead of forcing a new hardware or workflow stack.</p></article>
          </div>
        </section>

        <section className="bio-section">
          <div className="bio-section-head"><div className="bio-kicker">05 · Execution plan</div><div><h2>De-risk the technology through clinical evidence.</h2><p className="bio-section-intro">The EIC Accelerator programme would accelerate validation, interoperability, and commercial readiness—not just software development.</p></div></div>
          <div className="bio-roadmap">{milestones.map(([number, title, text]) => <article className="bio-step" key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <footer className="bio-footer">
          <h2>Make mental-health support more objective, adaptive, and human.</h2>
          <p className="bio-note">BioPsych-DSS is presented as an innovation concept based on the supplied technical description. Clinical performance, regulatory classification, reimbursement, and market claims require validation through the proposed work programme.</p>
        </footer>
      </div>
    </main>
  )
}
