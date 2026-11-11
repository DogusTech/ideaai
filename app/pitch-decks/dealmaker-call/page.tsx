import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DealMaker Meeting Brief | Aeternexus & IdeaAI",
  description: "Printable meeting notes for the DealMaker capital-raising strategy call.",
}

const routes = [
  {
    name: "Regulation Crowdfunding (Reg CF)",
    badge: "Recommended starting point",
    color: "green",
    summary: "Best fit if the first raise is up to $5M and Aeternexus wants to reach both accredited and non-accredited investors through a public campaign.",
    pros: ["Public online campaign", "Community and developer-led distribution", "Lower initial disclosure burden than Reg A+", "Designed for early-stage raises"],
    watch: "Requires a registered intermediary, offering disclosure, annual reporting and careful public communications.",
  },
  {
    name: "Regulation A+ Tier 2",
    badge: "Scale-up option",
    color: "blue",
    summary: "Best fit for a larger public raise, generally $5M–$75M, when the company can support audited financial statements, SEC qualification and ongoing reporting.",
    pros: ["Up to $75M in a 12-month period", "Accredited and non-accredited investor access", "Broader public offering profile", "Potentially stronger institutional signalling"],
    watch: "Materially higher legal, audit, SEC qualification, disclosure and ongoing reporting costs.",
  },
  {
    name: "Regulation D Rule 506(c)",
    badge: "Private / accredited route",
    color: "dark",
    summary: "Best fit for a fast private round marketed publicly but limited to verified accredited investors.",
    pros: ["No federal offering cap", "Can use general solicitation", "No Reg A qualification process", "Suitable for a focused investor syndicate"],
    watch: "Every purchaser must be accredited and the issuer must take reasonable verification steps; securities are restricted.",
  },
]

const agenda = [
  ["01", "Company and founder", "Aeternexus, Inc. is a Delaware corporation led by a technical founder. The company is building software products at the intersection of AI, desktop execution and autonomous engineering workflows."],
  ["02", "Flagship product", "IdeaAI is a Windows-native autonomous AI coding agent and engineering workspace. It connects local terminal, filesystem and IPC capabilities with a cloud control plane for longer-running and overnight workflows."],
  ["03", "Why now", "Developers need more than browser chat: they need reliable execution, local privacy, verifiable file changes and a way to continue work when the laptop is closed."],
  ["04", "Capital use", "Capital would support product hardening, Windows distribution, local model and cloud execution infrastructure, security/compliance, developer acquisition and enterprise pilots."],
]

export default function DealMakerCallBrief() {
  return (
    <main className="dm-page">
      <style>{`
        @page { size:A4; margin:15mm 17mm; }
        :root { --ink:#17231f; --muted:#607068; --green:#23744f; --blue:#416a91; --paper:#f7f9f6; --line:#cbd6ce; }
        .dm-page { min-height:100vh; padding:28px 14px 70px; color:var(--ink); background:#e8ede9; font-family:Georgia,'Times New Roman',serif; }
        .dm-sheet { width:min(100%,794px); margin:auto; padding:58px 66px 64px; background:#fff; box-shadow:0 12px 40px rgba(23,35,31,.12); }
        .dm-head { display:flex; justify-content:space-between; gap:30px; border-bottom:2px solid var(--ink); padding-bottom:18px; }.dm-brand { font:700 12px Arial,sans-serif; text-transform:uppercase; letter-spacing:.12em; }.dm-brand span { display:block; margin-top:5px; color:var(--green); font-size:11px; }.dm-meta { color:var(--muted); font:10px/1.5 Arial,sans-serif; text-align:right; text-transform:uppercase; letter-spacing:.08em; }
        .dm-kicker { margin-top:56px; color:var(--green); font:700 11px Arial,sans-serif; letter-spacing:.14em; text-transform:uppercase; }.dm-title { max-width:650px; margin:16px 0 20px; font:700 clamp(42px,6vw,72px)/.93 Arial,sans-serif; letter-spacing:-.07em; }.dm-title em { color:var(--green); font-style:normal; }.dm-lead { max-width:610px; margin:0; color:var(--muted); font-size:18px; line-height:1.5; }
        .dm-section { margin-top:58px; break-inside:avoid; }.dm-section h2 { margin:0 0 16px; padding-bottom:9px; border-bottom:1px solid var(--ink); font:700 22px/1.15 Arial,sans-serif; letter-spacing:-.03em; }.dm-section h3 { margin:24px 0 8px; font:700 14px Arial,sans-serif; letter-spacing:.04em; text-transform:uppercase; }.dm-section p { margin:0 0 12px; font-size:13px; line-height:1.6; }.dm-section ul { margin:9px 0 16px; padding-left:20px; }.dm-section li { margin-bottom:7px; font-size:13px; line-height:1.5; }
        .dm-note { margin:18px 0; padding:17px 19px; border-left:4px solid var(--green); background:#edf5ee; font-size:13px; line-height:1.6; }.dm-note strong { font-family:Arial,sans-serif; }
        .dm-route { margin:14px 0; padding:19px; border:1px solid var(--line); break-inside:avoid; }.dm-route.green { border-left:5px solid var(--green); }.dm-route.blue { border-left:5px solid var(--blue); }.dm-route.dark { border-left:5px solid var(--ink); }.dm-route-head { display:flex; justify-content:space-between; align-items:start; gap:18px; }.dm-route h3 { margin:0; font-size:17px; }.dm-badge { white-space:nowrap; color:var(--green); font:700 9px Arial,sans-serif; letter-spacing:.1em; text-transform:uppercase; }.dm-route p { margin:9px 0; color:var(--muted); font-size:12px; line-height:1.5; }.dm-route-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }.dm-route-grid strong { font:700 10px Arial,sans-serif; text-transform:uppercase; letter-spacing:.08em; }.dm-route-grid ul { margin:7px 0 0; padding-left:17px; }.dm-route-grid li { font-size:11px; margin-bottom:4px; }.dm-watch { color:#7a5a32; }
        .dm-agenda { display:block; }.dm-agenda-item { display:grid; grid-template-columns:48px 1fr; gap:0 16px; padding:15px 0; border-top:1px solid var(--line); }.dm-agenda b { color:var(--green); font:700 12px Arial,sans-serif; }.dm-agenda h3 { margin:0 0 5px; font-size:16px; }.dm-agenda p { margin:0; color:var(--muted); font-size:12px; }
        .dm-script { padding:22px; background:var(--ink); color:#fff; font-size:16px; line-height:1.6; }.dm-script strong { color:#c8f169; font-family:Arial,sans-serif; }
        .dm-questions { display:grid; grid-template-columns:1fr 1fr; gap:10px 24px; }.dm-question { padding:12px 0; border-top:1px solid var(--line); font-size:12px; line-height:1.45; }.dm-question b { color:var(--green); font-family:Arial,sans-serif; }
        .dm-footer { margin-top:55px; padding-top:16px; border-top:1px solid var(--line); color:var(--muted); font:9.5px/1.5 Arial,sans-serif; }.dm-print { margin-top:24px; color:var(--muted); font:10px Arial,sans-serif; text-align:center; }
        @media print { .dm-page { padding:0; background:#fff; }.dm-sheet { width:auto; padding:0; box-shadow:none; }.dm-print { display:none; } }.dm-pagebreak { break-before:page; }
        @media (max-width:620px) { .dm-sheet { padding:36px 26px; }.dm-head,.dm-route-head { display:block; }.dm-meta { margin-top:15px; text-align:left; }.dm-route-grid,.dm-questions { grid-template-columns:1fr; } }
      `}</style>

      <article className="dm-sheet">
        <header className="dm-head">
          <div className="dm-brand">Aeternexus, Inc.<span>DealMaker meeting brief</span></div>
          <div className="dm-meta">Capital strategy call<br />04 November 2026</div>
        </header>

        <div className="dm-kicker">Founder preparation · U.S. private capital raise</div>
        <h1 className="dm-title">Present the company clearly. <em>Do not oversell.</em></h1>
        <p className="dm-lead">A printable preparation sheet for the DealMaker call about fundraising options for Aeternexus, Inc. and its flagship product, IdeaAI.</p>

        <section className="dm-section">
          <h2>1. Recommended discussion position</h2>
          <div className="dm-note"><strong>Suggested opening position:</strong> “We would like to understand whether Regulation Crowdfunding is the right first vehicle for an early-stage, community-led raise of up to $5M, while keeping Reg A+ Tier 2 as a later scale option and Reg D 506(c) as a possible accredited-investor bridge.”</div>
          <p>There is no universal best exemption. The decision should follow the intended raise size, investor audience, timing, disclosure budget, current traction and ability to run a compliant campaign. “Reg C” is not the usual name of a standalone SEC exemption; ask whether the team means <strong>Regulation Crowdfunding (Reg CF)</strong>.</p>
        </section>

        <section className="dm-section">
          <h2>2. Which route should we explore?</h2>
          {routes.map((route) => <article className={`dm-route ${route.color}`} key={route.name}><div className="dm-route-head"><h3>{route.name}</h3><span className="dm-badge">{route.badge}</span></div><p>{route.summary}</p><div className="dm-route-grid"><div><strong>Advantages</strong><ul>{route.pros.map((pro) => <li key={pro}>{pro}</li>)}</ul></div><div><strong>Important constraint</strong><p className="dm-watch">{route.watch}</p></div></div></article>)}
        </section>

        <section className="dm-section dm-pagebreak">
          <h2>3. What to say about Aeternexus and IdeaAI</h2>
          <div className="dm-agenda">{agenda.map(([number, title, text]) => <div className="dm-agenda-item" key={number}><b>{number}</b><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
          <div className="dm-note"><strong>Verified positioning:</strong> Aeternexus develops IdeaAI as an autonomous AI desktop engineering workspace. Avoid claiming revenue, user counts, conversion rates, clinical outcomes or investment traction unless you can provide supporting records.</div>
        </section>

        <section className="dm-section">
          <h2>4. A concise founder introduction</h2>
          <div className="dm-script">“I’m Doğuş Yılmaz, founder and CEO of <strong>Aeternexus, Inc.</strong>, a Delaware corporation. We are building <strong>IdeaAI</strong>, a Windows-native autonomous AI coding agent and engineering workspace. The product is designed around a hybrid model: local terminal, filesystem and IPC execution during the developer’s working session, with cloud-controlled workflows for longer-running engineering tasks. We are speaking with DealMaker to understand the most suitable compliant capital-raising path for our stage, audience and planned use of funds.”</div>
        </section>

        <section className="dm-section">
          <h2>5. Questions to ask DealMaker</h2>
          <div className="dm-questions">
            {[
              "Based on our current stage and realistic first-round target, would you recommend Reg CF, Reg A+ Tier 2 or Reg D 506(c), and why?",
              "What minimum traction, financial records and corporate documents do you require before onboarding?",
              "What is the full estimated cost: legal, audit, SEC/FINRA, platform, escrow, payment processing, marketing and annual reporting?",
              "What timeline should we expect from kickoff to a compliant live campaign?",
              "Which disclosures and financial statements would be required for our Delaware C-Corp?",
              "How do you handle investor verification, KYC/AML, suitability and restricted securities?",
              "Who owns the investor data, campaign data and ongoing investor relationship?",
              "What marketing claims can we make publicly, and what review process applies to campaign content?",
              "Can we accept international investors, and what U.S. and non-U.S. restrictions apply?",
              "What happens after the raise: cap-table administration, tax documents, annual reporting and investor communications?",
              "Can a Reg CF or Reg D round be followed by a later Reg A+ or institutional round without creating avoidable conflicts?",
              "What would make you decline to onboard Aeternexus at this stage?"
            ].map((question, index) => <div className="dm-question" key={question}><b>{String(index + 1).padStart(2, "0")}</b> {question}</div>)}
          </div>
        </section>

        <section className="dm-section">
          <h2>6. Documents and information to prepare</h2>
          <ul><li>Certificate of incorporation, bylaws, EIN and Delaware corporate records.</li><li>Current cap table, founder equity, option pool and any outstanding SAFEs, notes or warrants.</li><li>Bank statements, management accounts, historical financials and a realistic 24-month budget.</li><li>Product demo, Microsoft Store listing evidence, deployment history and roadmap.</li><li>IP ownership, contractor/employee invention assignments and material third-party licences.</li><li>Use-of-funds plan with measurable milestones rather than broad “growth” language.</li><li>Risk factors: technical execution, competition, cybersecurity, model dependency, regulatory exposure and liquidity.</li></ul>
        </section>

        <footer className="dm-footer">Prepared for an exploratory strategy meeting. This page is not legal, tax, investment or securities advice and does not select an exemption on behalf of Aeternexus. Final offering structure and communications should be reviewed by qualified U.S. securities counsel and the relevant regulated intermediaries.<div className="dm-print">Print this page from the browser to create a clean A4 PDF.</div></footer>
      </article>
    </main>
  )
}
