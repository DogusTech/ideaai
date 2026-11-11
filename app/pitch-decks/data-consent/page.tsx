import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BioPsych-DSS | Data and Consent Declaration",
  description: "EU GDPR-aligned data and consent declaration for the BioPsych-DSS project.",
}

const commitments = [
  {
    title: "Data protection compliance",
    body: "All personal data processed within BioPsych-DSS, including health-related, physiological, biometric and clinical data, will be processed in accordance with Regulation (EU) 2016/679 (GDPR), applicable national data-protection law, and any relevant sector-specific requirements. The project will define and document the applicable roles of controller, joint controller and processor before data processing begins.",
  },
  {
    title: "Lawful basis and informed consent",
    body: "Before any research-related biometric or health-data collection, participating individuals will receive clear information about the purpose, methods, risks, benefits, retention period, recipients and their rights. Where consent is relied upon as a legal basis, it will be explicit, specific, informed, freely given and withdrawable without detriment. Consent will not be treated as a substitute for any additional legal, ethical or institutional approvals required for the activity.",
  },
  {
    title: "Data minimisation, pseudonymisation and security",
    body: "BioPsych-DSS will apply privacy by design and by default, data minimisation, purpose limitation, retention controls and access governance. Data will be pseudonymised where practicable, with re-identification keys kept separately under controlled access. Data in transit and at rest will be protected using appropriate technical and organisational measures, including encryption, authentication, logging, least-privilege access and incident-management procedures.",
  },
  {
    title: "Ethical and clinical governance",
    body: "Trial protocols, social-prescribing interventions, feedback mechanisms and clinical-effectiveness evaluations will be reviewed through the appropriate ethics, clinical and institutional governance processes. The project will assess whether a data-protection impact assessment (DPIA), medical-device obligations, national health-law requirements or additional approvals are applicable before deployment.",
  },
  {
    title: "Interoperability and responsible use",
    body: "Data exchanged through APIs, SDKs and HL7/FHIR-compatible services will be limited to the documented purpose and authorised data fields. BioPsych-DSS is intended to support qualified professionals and will not replace clinical judgement. Scores and recommendations will be presented with appropriate context, limitations and human oversight.",
  },
]

export default function DataConsentDeclaration() {
  return (
    <main className="consent-page">
      <style>{`
        @page { size: A4; margin: 18mm 19mm; }
        :root { --ink:#17231f; --muted:#607068; --green:#245c43; --line:#cbd5ce; --paper:#fff; }
        .consent-page { min-height:100vh; background:#e9eeea; color:var(--ink); font-family: Georgia, 'Times New Roman', serif; padding:32px 16px 70px; }
        .consent-sheet { width:min(100%, 794px); min-height:1123px; margin:0 auto; padding:70px 72px 64px; background:var(--paper); box-shadow:0 12px 40px rgba(23,35,31,.12); }
        .consent-head { display:flex; justify-content:space-between; align-items:flex-start; gap:30px; padding-bottom:22px; border-bottom:2px solid var(--ink); }
        .consent-brand { font-family: Arial, sans-serif; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }
        .consent-brand span { display:block; margin-top:5px; color:var(--green); letter-spacing:.04em; text-transform:none; font-size:12px; }
        .consent-meta { color:var(--muted); font-family:Arial,sans-serif; font-size:10px; line-height:1.55; text-align:right; }
        .consent-title { margin:54px 0 34px; }
        .consent-title h1 { margin:0; font-family:Arial,sans-serif; font-size:28px; line-height:1.08; letter-spacing:.02em; text-transform:uppercase; font-weight:700; }
        .consent-title p { max-width:620px; margin:15px 0 0; color:var(--muted); font-size:14px; line-height:1.55; }
        .consent-intro { margin:0 0 22px; font-size:15px; line-height:1.55; }
        .consent-list { counter-reset:item; margin:0; padding:0; list-style:none; }
        .consent-item { position:relative; padding:0 0 22px 42px; margin:0 0 22px; border-bottom:1px solid var(--line); break-inside:avoid; }
        .consent-item:before { counter-increment:item; content:counter(item); position:absolute; left:0; top:0; display:grid; place-items:center; width:25px; height:25px; border-radius:50%; color:#fff; background:var(--green); font-family:Arial,sans-serif; font-size:12px; font-weight:700; }
        .consent-item h2 { margin:0 0 7px; font-family:Arial,sans-serif; font-size:14px; line-height:1.3; letter-spacing:.02em; text-transform:uppercase; }
        .consent-item p { margin:0; font-size:13.5px; line-height:1.58; }
        .consent-footer { margin-top:42px; display:grid; grid-template-columns:1fr 1fr; gap:40px; }
        .consent-field { min-height:66px; padding-top:9px; border-top:1px solid var(--ink); }
        .consent-field strong { display:block; font-family:Arial,sans-serif; font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
        .consent-field span { display:block; margin-top:8px; font-size:14px; }
        .consent-signature { grid-column:1 / -1; margin-top:14px; max-width:320px; }
        .consent-note { margin-top:38px; padding-top:14px; border-top:1px solid var(--line); color:var(--muted); font-family:Arial,sans-serif; font-size:9.5px; line-height:1.5; }
        @media print { .consent-page { padding:0; background:#fff; } .consent-sheet { width:auto; min-height:0; padding:0; box-shadow:none; } }
        @media (max-width:650px) { .consent-sheet { padding:38px 28px; } .consent-head,.consent-footer { grid-template-columns:1fr; display:grid; } .consent-meta { text-align:left; } .consent-signature { grid-column:auto; } }
      `}</style>
      <article className="consent-sheet">
        <header className="consent-head">
          <div className="consent-brand">Aeternexus, Inc.<span>BioPsych-DSS</span></div>
          <div className="consent-meta">EU INNOVATION PROJECT DOCUMENT<br />DATA GOVERNANCE STATEMENT<br />Version 1.0 · 04 November 2026</div>
        </header>

        <section className="consent-title">
          <h1>Data and Consent Declaration</h1>
          <p><strong>Project Acronym:</strong> BioPsych-DSS<br /><strong>Project Title:</strong> Physiological Biomarker-Based Psychiatric Decision Support and Closed-Loop Social Prescribing System</p>
        </section>

        <p className="consent-intro">The applicant hereby confirms its intention to design, validate and operate the BioPsych-DSS project in accordance with the following data-protection, consent, security and ethical commitments:</p>

        <ol className="consent-list">
          {commitments.map((item) => <li className="consent-item" key={item.title}><h2>{item.title}</h2><p>{item.body}</p></li>)}
        </ol>

        <section className="consent-footer">
          <div className="consent-field"><strong>Authorised representative</strong><span>Doğuş Yılmaz</span></div>
          <div className="consent-field"><strong>Role</strong><span>Main Contact / CEO</span></div>
          <div className="consent-field"><strong>Date</strong><span>04.11.2026</span></div>
          <div className="consent-field consent-signature"><strong>Signature</strong><span>&nbsp;</span></div>
        </section>

        <p className="consent-note">This declaration is a project-level commitment and does not replace a project-specific data-protection impact assessment, ethics approval, clinical investigation documentation, regulatory assessment, or other authorisation required under applicable EU or national law.</p>
      </article>
    </main>
  )
}
