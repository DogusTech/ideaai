import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Doğuş Yılmaz | Technical Software Developer",
  description:
    "Technical software developer CV focused on AI systems, desktop engineering, TypeScript, React, Next.js and cloud execution.",
}

const capabilities = [
  ["AI & agent systems", "LLM application architecture, structured tool use, local model workflows, deterministic execution, prompt orchestration"],
  ["Desktop engineering", "Electron, Windows IPC, local filesystem operations, terminal execution, process control, offline-first workflows"],
  ["Web application engineering", "TypeScript, React, Next.js, Node.js, server components, API routes, responsive product interfaces"],
  ["Cloud & infrastructure", "Firebase, Firestore, Azure, Modal, Vercel, GitHub APIs, webhooks, CI/CD and deployment automation"],
  ["Product engineering", "Technical discovery, system design, security boundaries, observability, documentation and developer experience"],
  ["Frontend systems", "Tailwind CSS, accessible component systems, responsive layouts, animation, print-ready documents and SEO"],
]

const selectedWork = [
  {
    title: "IdeaAI — autonomous engineering workspace",
    body: "Built a Windows-oriented AI coding workspace that combines local terminal, filesystem and IPC execution with cloud-controlled workflows. Designed structured thought, file-change and command representations so agent activity can be inspected instead of rendered as opaque chat.",
    stack: "TypeScript · React · Next.js · Electron · Node.js · Ollama · Firebase · GitHub APIs",
  },
  {
    title: "Hybrid local / cloud execution architecture",
    body: "Designed the day-and-night execution model: private, low-latency local work during active development and asynchronous cloud execution for longer-running issues, tests, Git operations and overnight engineering tasks.",
    stack: "Electron IPC · workspace boundaries · terminal automation · webhooks · CI/CD · Azure / Modal",
  },
  {
    title: "Production product and technical documentation",
    body: "Delivered production-facing landing pages, structured documentation, technical proposal pages and print-oriented EU project documents. Focused on clear information architecture, reliable routing, metadata, accessibility and deployment verification.",
    stack: "Next.js App Router · SEO · Schema.org · Tailwind CSS · Vercel · technical writing",
  },
]

const education = [
  ["Primary focus", "Applied software engineering, artificial intelligence and autonomous developer tooling"],
  ["Working style", "Systems-oriented, execution-focused and comfortable across product, frontend, backend and infrastructure boundaries"],
  ["Location", "Istanbul, Turkey · Open to remote collaboration"],
]

export default function TechnicalResume() {
  return (
    <main className="resume-page">
      <style>{`
        @page { size:A4; margin:13mm 15mm; }
        :root { --ink:#17231f; --muted:#607068; --green:#23744f; --line:#cbd6ce; --pale:#f1f6f1; }
        .resume-page { min-height:100vh; padding:28px 14px 70px; color:var(--ink); background:#e9eeea; font-family:Arial, Helvetica, sans-serif; }
        .resume-sheet { width:min(100%,794px); margin:auto; padding:38px 48px 40px; background:#fff; box-shadow:0 12px 40px rgba(23,35,31,.12); }
        .resume-top { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; padding-bottom:13px; border-bottom:2px solid var(--ink); }
        .resume-name { margin:0; font-size:clamp(32px,5vw,48px); line-height:.92; letter-spacing:-.07em; font-weight:800; }
        .resume-role { margin:8px 0 0; color:var(--green); font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }
        .resume-contact { color:var(--muted); font-size:9px; line-height:1.55; text-align:right; }
        .resume-contact a { color:inherit; text-decoration:none; border-bottom:1px solid #aebdb3; }
        .resume-intro { display:grid; grid-template-columns:1.2fr .8fr; gap:28px; margin:23px 0 25px; }
        .resume-summary { margin:0; font-family:Georgia,'Times New Roman',serif; font-size:14px; line-height:1.38; letter-spacing:-.015em; }
        .resume-signal { padding-left:14px; border-left:3px solid var(--green); color:var(--muted); font-size:9.5px; line-height:1.45; }
        .resume-signal strong { display:block; margin-bottom:5px; color:var(--ink); font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
        .resume-section { margin-top:21px; break-inside:avoid; }
        .resume-section h2 { display:flex; align-items:center; gap:10px; margin:0 0 9px; padding-bottom:6px; border-bottom:1px solid var(--ink); font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
        .resume-section h2 span { color:var(--green); font-size:9px; }
        .resume-job { margin-bottom:13px; break-inside:avoid; }
        .resume-job-head { display:flex; justify-content:space-between; gap:16px; align-items:baseline; }
        .resume-job h3 { margin:0; font-size:13px; letter-spacing:-.02em; }
        .resume-job-date { color:var(--green); font-size:8px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; white-space:nowrap; }
        .resume-job-meta { margin:3px 0 5px; color:var(--muted); font-size:9px; }
        .resume-job p { margin:0; font-family:Georgia,'Times New Roman',serif; font-size:10.5px; line-height:1.38; }
        .resume-stack { margin-top:5px !important; color:var(--muted); font-family:Arial,Helvetica,sans-serif !important; font-size:8.5px !important; }
        .resume-work-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .resume-work-grid .resume-job { padding-top:8px; border-top:1px solid var(--line); }
        .resume-work-grid .resume-job h3 { font-size:11px; line-height:1.2; }
        .resume-capabilities { display:grid; grid-template-columns:repeat(3,1fr); gap:7px 15px; }
        .resume-capability { padding:7px 0; border-top:1px solid var(--line); break-inside:avoid; }
        .resume-capability strong { display:block; margin-bottom:3px; font-size:9px; }
        .resume-capability span { display:block; color:var(--muted); font-family:Georgia,'Times New Roman',serif; font-size:9px; line-height:1.3; }
        .resume-education { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
        .resume-education div { padding:7px 0; border-top:1px solid var(--line); }
        .resume-education strong { display:block; margin-bottom:3px; color:var(--green); font-size:8px; letter-spacing:.08em; text-transform:uppercase; }
        .resume-education span { color:var(--muted); font-family:Georgia,'Times New Roman',serif; font-size:9px; line-height:1.3; }
        .resume-footer { display:flex; justify-content:space-between; gap:20px; margin-top:23px; padding-top:10px; border-top:1px solid var(--line); color:var(--muted); font-size:8px; line-height:1.4; }
        .resume-footer strong { color:var(--ink); }
        .resume-print-note { margin-top:24px; color:var(--muted); font-size:10px; text-align:center; }
        @media print { .resume-page { padding:0; background:#fff; }.resume-sheet { width:auto; height:267mm; padding:0; box-shadow:none; }.resume-print-note { display:none; } }
        @media (max-width:640px) { .resume-sheet { padding:35px 27px; }.resume-top,.resume-job-head { display:block; }.resume-contact { margin-top:16px; text-align:left; }.resume-intro,.resume-work-grid,.resume-capabilities,.resume-education { grid-template-columns:1fr; }.resume-signal { padding-left:0; padding-top:15px; border-top:3px solid var(--green); border-left:0; } }
      `}</style>

      <article className="resume-sheet">
        <header className="resume-top">
          <div>
            <h1 className="resume-name">Doğuş Yılmaz</h1>
            <p className="resume-role">Technical Software Developer</p>
          </div>
          <div className="resume-contact">
            Istanbul, Turkey<br />
            <a href="mailto:dogusssyilmaz@gmail.com">dogusssyilmaz@gmail.com</a><br />
            <a href="https://www.linkedin.com/in/dogusyilmaz">linkedin.com/in/dogusyilmaz</a><br />
            <a href="https://github.com/DogusTech">github.com/DogusTech</a><br />
            <a href="https://ideaai.togetlink.com">ideaai.togetlink.com</a>
          </div>
        </header>

        <section className="resume-intro">
          <p className="resume-summary">Software developer building reliable AI products across desktop, web and cloud environments. Specialises in TypeScript systems, Windows-native execution, agent tooling and production interfaces that connect complex technical workflows to clear user experiences.</p>
          <div className="resume-signal"><strong>Engineering profile</strong>Full-stack product execution<br />AI and developer tooling<br />Desktop + cloud systems<br />Security-aware architecture</div>
        </section>

        <section className="resume-section">
          <h2><span>01</span>Selected experience</h2>
          <article className="resume-job">
            <div className="resume-job-head"><h3>Software Engineer · Aeternexus, Inc.</h3><span className="resume-job-date">Current</span></div>
            <p className="resume-job-meta">Independent product engineering · Istanbul, Turkey</p>
            <p>Develop and operate IdeaAI, an autonomous AI coding agent and engineering workspace. Own implementation across frontend, backend, desktop integration, local execution, cloud workflows, technical content and deployment. Translate product requirements into maintainable software with explicit execution boundaries and verifiable outputs.</p>
            <p className="resume-stack"><strong>Core stack:</strong> TypeScript, React, Next.js, Electron, Node.js, Firebase, Firestore, Ollama, GitHub, Azure, Modal, Vercel</p>
          </article>
          <article className="resume-job">
            <div className="resume-job-head"><h3>Technical Software Developer · Independent Projects</h3><span className="resume-job-date">Project-based</span></div>
            <p className="resume-job-meta">AI applications · automation · product interfaces</p>
            <p>Design and implement software products spanning autonomous agents, local terminal workflows, document systems, structured APIs, responsive interfaces and technical proposal tooling. Comfortable moving from architecture and data flow to implementation, testing and production verification.</p>
          </article>
        </section>

        <section className="resume-section">
          <h2><span>02</span>Selected technical work</h2>
          <div className="resume-work-grid">{selectedWork.map((work) => <article className="resume-job" key={work.title}><div className="resume-job-head"><h3>{work.title}</h3></div><p>{work.body}</p><p className="resume-stack">{work.stack}</p></article>)}</div>
        </section>

        <section className="resume-section">
          <h2><span>03</span>Technical capabilities</h2>
          <div className="resume-capabilities">{capabilities.map(([title, body]) => <div className="resume-capability" key={title}><strong>{title}</strong><span>{body}</span></div>)}</div>
        </section>

        <section className="resume-section">
          <h2><span>04</span>Professional focus</h2>
          <div className="resume-education">{education.map(([title, body]) => <div key={title}><strong>{title}</strong><span>{body}</span></div>)}</div>
        </section>

        <footer className="resume-footer"><span><strong>Doğuş Yılmaz</strong> · Technical Software Developer</span><span>References and project details available upon request</span></footer>
        <p className="resume-print-note">Print from the browser to create a clean A4 PDF.</p>
      </article>
    </main>
  )
}
