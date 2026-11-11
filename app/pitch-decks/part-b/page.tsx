import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BioPsych-DSS | Part B Technical Proposal",
  description:
    "European Union Part B technical proposal for the BioPsych-DSS physiological biomarker-based psychiatric decision support system.",
}

const modules = [
  ["M1", "Wearable biomarker acquisition", "An agnostic integration layer connects approved smartwatches, medical bands and other wearable sensors through APIs and SDKs. It receives asynchronous HRV and EDA/GSR streams without requiring a new proprietary hardware device."],
  ["M2", "Analytical processing and scoring engine", "Raw physiological streams are pre-processed, quality-checked and filtered for noise. Statistical analysis is used to characterise autonomic balance and produce the Social Isolation Index and Chronic Stress Risk score."],
  ["M3", "Clinical decision-support interface", "Objective scores and trend reports are exposed through standards-compatible web services and APIs, including HL7/FHIR-compatible integration patterns, so clinicians can review them in their existing hospital information environment."],
  ["M4", "Closed-loop social-prescribing feedback", "A clinician assigns a structured digital or physical social activity. The system continues monitoring during and after participation, compares baseline and post-intervention signals, and returns a Clinical Effectiveness Report."],
]

const workPackages = [
  ["WP1", "System specification and data governance", "Define clinical use cases, data fields, interoperability requirements, privacy-by-design controls, roles, retention rules and evaluation protocols."],
  ["WP2", "Wearable integration and signal quality", "Implement the device-agnostic API/SDK layer and establish quality controls for HRV, EDA/GSR and asynchronous data streams."],
  ["WP3", "Scoring engine and clinical interpretation", "Develop, calibrate and validate the analytical pipeline for Social Isolation Index and Chronic Stress Risk outputs."],
  ["WP4", "Hospital interoperability pilot", "Implement the decision-support interface and test secure exchange with an appropriate HBYS/EHR environment using HL7/FHIR-compatible services."],
  ["WP5", "Closed-loop social-prescribing study", "Run prospective intervention protocols, compare baseline and post-activity measures, and evaluate the Clinical Effectiveness Report."],
  ["WP6", "Impact, exploitation and scale-up", "Prepare regulatory, clinical, procurement and market-readiness evidence for deployment across European care networks."],
]

export default function PartBTechnicalProposal() {
  return (
    <main className="partb-page">
      <style>{`
        @page { size:A4; margin:16mm 18mm 18mm; }
        :root { --ink:#192620; --muted:#5e6f67; --green:#245c43; --pale:#eef4ee; --line:#cbd6ce; --accent:#dcebdc; }
        .partb-page { min-height:100vh; padding:28px 14px 70px; color:var(--ink); background:#e7ece8; font-family:Georgia,'Times New Roman',serif; }
        .partb-sheet { width:min(100%,794px); margin:auto; padding:58px 68px 65px; background:#fff; box-shadow:0 12px 40px rgba(25,38,32,.12); }
        .partb-cover { min-height:1000px; display:flex; flex-direction:column; justify-content:space-between; }
        .partb-kicker,.partb-meta,.partb-running,.partb-table th { font-family:Arial,sans-serif; text-transform:uppercase; letter-spacing:.12em; }
        .partb-kicker { color:var(--green); font-size:11px; font-weight:700; }
        .partb-brand { display:flex; justify-content:space-between; gap:30px; border-bottom:2px solid var(--ink); padding-bottom:18px; font:700 11px Arial,sans-serif; letter-spacing:.12em; text-transform:uppercase; }
        .partb-brand span { color:var(--green); }
        .partb-cover h1 { max-width:650px; margin:0; font:700 clamp(42px,6vw,72px)/.93 Arial,sans-serif; letter-spacing:-.07em; }
        .partb-cover h1 em { color:var(--green); font-style:normal; }
        .partb-subtitle { max-width:620px; margin:24px 0 0; color:var(--muted); font-size:19px; line-height:1.45; }
        .partb-cover-bottom { display:grid; grid-template-columns:1fr 1fr; gap:28px; padding-top:25px; border-top:1px solid var(--line); }
        .partb-meta { color:var(--muted); font-size:9px; line-height:1.7; }.partb-meta strong { color:var(--ink); }
        .partb-pagebreak { break-before:page; padding-top:4px; }
        .partb-section { margin:0 0 38px; }.partb-section h2 { margin:0 0 15px; padding-bottom:9px; border-bottom:1px solid var(--ink); font:700 22px/1.1 Arial,sans-serif; letter-spacing:-.03em; }.partb-section h3 { margin:24px 0 8px; font:700 14px/1.3 Arial,sans-serif; text-transform:uppercase; letter-spacing:.04em; }.partb-section p { margin:0 0 12px; font-size:13px; line-height:1.62; }.partb-section ul { margin:10px 0 16px; padding-left:20px; }.partb-section li { margin:0 0 7px; font-size:13px; line-height:1.55; }
        .partb-number { float:right; color:var(--green); font:700 10px Arial,sans-serif; letter-spacing:.12em; }
        .partb-table { width:100%; border-collapse:collapse; margin:15px 0 24px; font-size:11.5px; }.partb-table th { padding:9px 8px; color:#fff; background:var(--green); text-align:left; font-size:9px; }.partb-table td { padding:10px 8px; border-bottom:1px solid var(--line); vertical-align:top; line-height:1.45; }.partb-table tr:nth-child(even) td { background:var(--pale); }.partb-table td:first-child { width:54px; color:var(--green); font-family:Arial,sans-serif; font-weight:700; }
        .partb-callout { margin:18px 0; padding:18px 20px; border-left:4px solid var(--green); background:var(--pale); font-size:13px; line-height:1.6; }.partb-callout strong { font-family:Arial,sans-serif; }
        .partb-figure { margin:18px 0 26px; padding:20px; border:1px solid var(--line); background:#fbfdfb; }.partb-flow { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; align-items:stretch; }.partb-flow div { position:relative; min-height:110px; padding:12px; background:var(--accent); font:700 11px/1.3 Arial,sans-serif; }.partb-flow div:not(:last-child):after { content:'→'; position:absolute; right:-8px; top:45%; z-index:2; color:var(--green); font-size:18px; }.partb-figure figcaption { margin-top:12px; color:var(--muted); font:10px/1.45 Arial,sans-serif; }
        .partb-sign { margin-top:54px; padding-top:15px; border-top:1px solid var(--line); color:var(--muted); font:10px/1.5 Arial,sans-serif; }
        @media print { .partb-page { padding:0; background:#fff; }.partb-sheet { width:auto; padding:0; box-shadow:none; }.partb-cover { min-height:250mm; } }
        @media (max-width:650px) { .partb-sheet { padding:36px 26px; }.partb-cover-bottom,.partb-flow { grid-template-columns:1fr 1fr; }.partb-flow div:not(:last-child):after { display:none; } }
      `}</style>

      <article className="partb-sheet">
        <section className="partb-cover">
          <div className="partb-brand"><span>Aeternexus, Inc.</span><span>BioPsych-DSS · Part B</span></div>
          <div>
            <div className="partb-kicker">European Union Innovation Proposal · Technical Description</div>
            <h1>Physiological biomarker-based <em>psychiatric decision support</em> and closed-loop social prescribing.</h1>
            <p className="partb-subtitle">A device-agnostic, cloud-enabled clinical decision-support system that converts wearable autonomic nervous system signals into interoperable scores and measurable social-care feedback.</p>
          </div>
          <div className="partb-cover-bottom">
            <div className="partb-meta"><strong>Project acronym</strong><br />BioPsych-DSS<br /><br /><strong>Document</strong><br />Part B — Technical Proposal</div>
            <div className="partb-meta"><strong>Primary domain</strong><br />Healthcare informatics · clinical psychiatry<br /><br /><strong>Version</strong><br />1.0 · 04 November 2026</div>
          </div>
        </section>

        <section className="partb-pagebreak partb-section">
          <h2><span className="partb-number">1</span>Excellence and technical objective</h2>
          <p>BioPsych-DSS addresses a persistent limitation in psychiatric monitoring: clinically relevant changes in stress, anxiety and social isolation often occur between appointments, while available assessments rely on self-report, observation and periodic questionnaires. The proposed system adds an objective, longitudinal physiological layer without requiring a new proprietary wearable device.</p>
          <p>The system collects measurable autonomic nervous system biomarkers—primarily Heart Rate Variability (HRV) and Electrodermal Activity (EDA/GSR)—from supported wearable ecosystems. It processes the signals through a cloud-based analytical engine and returns interpretable decision-support outputs to the clinician’s existing information environment.</p>
          <div className="partb-callout"><strong>Technical objective.</strong> Establish a standards-compatible, human-supervised feedback loop in which physiological evidence supports assessment, social-prescribing assignment and post-intervention evaluation.</div>
          <h3>Specific technical problems addressed</h3>
          <ul><li>Subjectivity and recall bias in the assessment of stress and social isolation.</li><li>Absence of continuous physiological feedback outside the clinical encounter.</li><li>Manual social-prescribing workflows with limited evidence of adherence or effect.</li><li>Fragmented wearable and hospital systems that do not share a common clinical decision layer.</li></ul>
        </section>

        <section className="partb-section">
          <h2><span className="partb-number">2</span>System architecture and method of operation</h2>
          <p>BioPsych-DSS is composed of four communicating technical modules. The architecture is intentionally hardware-agnostic and designed to integrate into existing clinical workflows.</p>
          <table className="partb-table"><thead><tr><th>Ref.</th><th>Module</th><th>Technical function</th></tr></thead><tbody>{modules.map(([id,title,text]) => <tr key={id}><td>{id}</td><td><strong>{title}</strong></td><td>{text}</td></tr>)}</tbody></table>
          <figure className="partb-figure"><div className="partb-flow"><div>Wearable sensors<br /><small>HRV / EDA</small></div><div>Acquisition<br />API / SDK layer</div><div>Cloud analysis<br />quality + scoring</div><div>Clinical action<br />feedback report</div></div><figcaption>Figure 1. High-level BioPsych-DSS data and decision flow. The final clinical action remains under qualified professional oversight.</figcaption></figure>
        </section>

        <section className="partb-pagebreak partb-section">
          <h2><span className="partb-number">3</span>Data processing and scoring</h2>
          <h3>3.1 Signal acquisition</h3>
          <p>The acquisition layer receives asynchronous physiological streams from supported wearable sensors. The implementation is intended to use documented APIs and SDKs, with device-specific adapters normalising timestamps, sampling metadata, signal quality indicators and measurement units.</p>
          <h3>3.2 Pre-processing and quality control</h3>
          <p>Incoming data are subject to validation, timestamp alignment, missing-data handling and noise reduction before analytical use. Quality flags are retained so that a clinician-facing score is not presented without appropriate context about signal completeness or reliability.</p>
          <h3>3.3 Analytical outputs</h3>
          <p>Statistical processing characterises changes in autonomic balance and produces two primary decision-support outputs: the <strong>Social Isolation Index</strong> and the <strong>Chronic Stress Risk</strong> score. These outputs are intended as longitudinal support indicators, not autonomous diagnoses or replacements for clinical judgement.</p>
          <div className="partb-callout"><strong>Interpretability principle.</strong> Each score should be accompanied by a time window, data-quality context, trend direction and a clear statement that the output supports—but does not determine—professional assessment.</div>
        </section>

        <section className="partb-section">
          <h2><span className="partb-number">4</span>Interoperability and clinical interface</h2>
          <p>The decision-support layer is designed to connect to Hospital Information Management Systems (HBYS/EHR environments) through standards-compatible web services and APIs. HL7 and FHIR-compatible implementation patterns provide a route to exchanging authorised observations, scores, provenance and reports without requiring clinicians to adopt a separate consumer application.</p>
          <table className="partb-table"><thead><tr><th>Interface</th><th>Purpose</th><th>Design requirement</th></tr></thead><tbody><tr><td>API / SDK</td><td>Wearable data acquisition</td><td>Documented adapters, consent-aware access, device and signal metadata.</td></tr><tr><td>HL7 / FHIR</td><td>Clinical system exchange</td><td>Standards-compatible resources, authenticated endpoints and field-level authorisation.</td></tr><tr><td>Clinician dashboard</td><td>Decision support</td><td>Trend context, data quality, objective scores and human-readable explanations.</td></tr><tr><td>Report service</td><td>Closed-loop outcome</td><td>Baseline/post-intervention comparison and Clinical Effectiveness Report.</td></tr></tbody></table>
        </section>

        <section className="partb-section">
          <h2><span className="partb-number">5</span>Closed-loop social prescribing</h2>
          <p>Based on the available clinical context and objective trend information, a qualified professional may assign a structured social-prescribing activity. This may include a digital interaction, a community event, a physical group activity or another approved intervention appropriate to the care pathway.</p>
          <p>The acquisition layer remains active during and after participation, subject to the applicable consent, ethics and data-governance controls. The system compares the baseline window with the post-intervention window and generates a Clinical Effectiveness Report describing physiological change, data quality and limitations.</p>
          <figure className="partb-figure"><div className="partb-flow"><div>Baseline<br />measurement</div><div>Clinician<br />assignment</div><div>Social activity<br />participation</div><div>Effectiveness<br />report</div></div><figcaption>Figure 2. Closed-loop social-prescribing mechanism. Assignment and interpretation remain clinician-led.</figcaption></figure>
        </section>

        <section className="partb-pagebreak partb-section">
          <h2><span className="partb-number">6</span>Work plan and validation pathway</h2>
          <p>The proposed work programme converts the technical concept into evidence suitable for clinical, regulatory and market-readiness decisions.</p>
          <table className="partb-table"><thead><tr><th>WP</th><th>Work package</th><th>Core activities</th></tr></thead><tbody>{workPackages.map(([id,title,text]) => <tr key={id}><td>{id}</td><td><strong>{title}</strong></td><td>{text}</td></tr>)}</tbody></table>
          <h3>Validation principles</h3>
          <ul><li>Prospective evaluation with predefined signal-quality and clinical-correlation criteria.</li><li>Separation of technical performance, clinical usability and clinical-effectiveness evidence.</li><li>Human oversight of score interpretation, social-prescribing assignment and intervention evaluation.</li><li>Documented assessment of applicable GDPR, ethics, medical-device and national health-law requirements before deployment.</li></ul>
        </section>

        <section className="partb-section">
          <h2><span className="partb-number">7</span>Technical risks and mitigation</h2>
          <table className="partb-table"><thead><tr><th>Risk</th><th>Potential effect</th><th>Mitigation</th></tr></thead><tbody><tr><td>Signal noise or missingness</td><td>Unreliable trend or score</td><td>Quality flags, validation windows, missing-data handling and no-score conditions.</td></tr><tr><td>Device heterogeneity</td><td>Inconsistent measurements</td><td>Adapter layer, normalised metadata and device-specific validation profiles.</td></tr><tr><td>Clinical workflow friction</td><td>Low adoption</td><td>Standards-compatible integration and clinician-centred interface design.</td></tr><tr><td>Over-interpretation</td><td>Unsafe reliance on automated output</td><td>Human oversight, explainability, limitations and clear non-diagnostic positioning.</td></tr><tr><td>Data protection or ethics constraints</td><td>Delayed pilot</td><td>Early DPIA and ethics review, role mapping, minimisation and governance gates.</td></tr></tbody></table>
        </section>

        <section className="partb-section">
          <h2><span className="partb-number">8</span>Reference numerals and figures</h2>
          <table className="partb-table"><thead><tr><th>Ref.</th><th>Description</th><th>Ref.</th><th>Description</th></tr></thead><tbody><tr><td>10</td><td>Patient/user limb</td><td>11</td><td>Wearable sensor unit</td></tr><tr><td>12</td><td>Biometric contact surface</td><td>13</td><td>Physiological HRV/EDA signal</td></tr><tr><td>20</td><td>Biometric data acquisition module</td><td>21</td><td>Analytical processing and scoring engine</td></tr><tr><td>22</td><td>Clinical decision-support interface</td><td>23</td><td>Social-prescribing module</td></tr><tr><td>24</td><td>Forward data-transfer path</td><td>25</td><td>Closed-loop feedback path</td></tr><tr><td>30</td><td>Clinician interface screen</td><td>31</td><td>Objective clinical score graphs</td></tr><tr><td>32</td><td>Clinician / expert user</td><td>40</td><td>Prescription assignment start point</td></tr><tr><td>41</td><td>Social activity / physical venue</td><td>42</td><td>Feedback process flow</td></tr></tbody></table>
          <p><strong>Figure 1:</strong> Physiological biometric data acquisition unit. <strong>Figure 2:</strong> System data flow and module integration. <strong>Figure 3:</strong> Clinical decision-support and clinician interface. <strong>Figure 4:</strong> Closed-loop social-prescribing mechanism.</p>
        </section>

        <div className="partb-sign">Prepared for EU proposal development · BioPsych-DSS · Aeternexus, Inc.<br />This technical proposal is based on the supplied description and should be reviewed by qualified clinical, regulatory, data-protection and intellectual-property professionals before formal submission.</div>
      </article>
    </main>
  )
}
