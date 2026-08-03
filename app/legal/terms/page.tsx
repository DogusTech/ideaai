"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useEffect, useState } from "react";

const TERMS_MARKDOWN = `
Subject to these Terms of Service (this "Agreement"), TogetLink ("TogetLink", "we", "us" and/or "our") provides access to TogetLink's Services. "Services" means, collectively, any products or services made available by TogetLink or its affiliates. By using or accessing the Services, you acknowledge that you have read, understand, and agree to be bound by this Agreement.

If you are entering into this Agreement on behalf of a company, business or other legal entity, you represent that you have the authority to bind such entity to this Agreement, in which case the term "you" shall refer to such entity. If you do not have such authority, or if you do not agree with this Agreement, you must not accept this Agreement and may not use the Services.

IMPORTANT: PLEASE REVIEW THE MUTUAL ARBITRATION CLAUSE AND CLASS ACTION WAIVER SET FORTH BELOW CAREFULLY, AS IT WILL REQUIRE YOU (A) TO RESOLVE DISPUTES WITH TOGETLINK THROUGH FINAL AND BINDING ARBITRATION AND (B) TO WAIVE YOUR RIGHT TO PARTICIPATE IN CLASS ACTIONS AS SET FORTH BELOW. BY ENTERING THIS AGREEMENT, YOU EXPRESSLY ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND ALL OF THE TERMS OF THIS MUTUAL ARBITRATION CLAUSE AND CLASS ACTION WAIVER AS EXPLAINED BY THIS AGREEMENT.

## 1. Age and Eligibility
You certify that you are a person at least 16 years of age. Services may only be used or accessed through an electronic device controlled by you at all times. A valid TogetLink account may only be created and maintained if you provide valid information in the signup process, and you regularly update such information to assure its accuracy. You shall be responsible for maintaining the confidentiality of login information associated with your account. Each user must have unique login credentials that must not be shared by multiple users. You are responsible for all activities that occur under your account.

## 2. Temporary Use License
During the period for which you are authorized to use the Services, and subject to your compliance with the terms of this Agreement, you are granted a personal, non-sublicensable, non-exclusive, non-transferable, limited license, to use the Services for your internal business or personal purposes according to the service capacity of your account. Any rights not expressly granted herein are reserved and no license or right to use any trademark of TogetLink or any third-party is granted to you in connection with the Services.

## 3. Your Content
You are solely responsible for all software, code, data, information, feedback, suggestions, text, input, content and other materials that you upload, post, deliver, provide or otherwise transmit or store (hereafter "submit(ting)") in connection with or relating to the Services ("Your Content"). You are responsible for maintaining the confidentiality of usernames and passwords associated with your account and for all activities that occur under your account. TogetLink reserves the right to access your account in order to respond to your requests for technical support.

By submitting Your Content on or through the Services, you grant TogetLink a worldwide, non-exclusive, royalty-free, fully paid, sublicensable and transferable license to use, copy, modify, adapt, reproduce, distribute, display, publish, store, perform, and create derivatives of Your Content to provide and improve the Services, develop new products and services, secure and protect the Services and third parties from fraud, abuse, malware, malicious files or content, viruses and the like.

## 4. Hobby Plan
We offer a free Hobby plan at our sole discretion. The Hobby plan is subject to all provisions of these Terms of Service, unless expressly stated otherwise. You shall only use the Services under a Hobby plan for your personal or non-commercial use. We may change the features, limitations, or other conditions applicable to the Hobby plan or discontinue offering the Hobby plan at any time.

## 5. Teams and Projects
You are able to create or join a team consisting of one or more other TogetLink users ("authorized users") of the Services (a "Team"). A Team owner may manage or enable authorized users to collaborate on a project (a "Project"). If you are invited to a Team or a Project, Your Content created in that Team or Project may be shared with that Team and may be accessed, modified, claimed ownership of, or deleted by the Team owner or administrator.

## 6. AI Functionality and Third Party Tools
Services may include products and features that use AI capabilities, allow you to host or deploy AI capabilities, and facilitate access to AI providers and their models (collectively, "AI Functionality"). Where the AI Functionality is capable of taking autonomous actions, including through directly interacting with one or more connected third party applications or systems, your settings determine the level of autonomous actions the AI Functionality may take on your behalf. 

## 7. Acceptable Use
Your use of the Services must comply with TogetLink's Acceptable Use Policy, which is incorporated by reference.

## 8. Etiquette
Although TogetLink has no obligation to monitor your use of the Services, TogetLink may do so by using tools that detect patterns of abuse of Services, and investigating thereafter. Based on the outcome of these investigations, TogetLink may prohibit any use of the Services it believes may be (or is alleged to be) in violation of the foregoing.

## 9. Security and Compliance
You shall configure Your Content, including any of your projects or deployments, such that the transmission, storage, or use in any way will not expose personal data or personal information without proper consent from individuals as determined by applicable law. TogetLink implements regular backups of Your Content and you shall also maintain its own backups of Your Content.

## 10. Data Protection
We will process the personal information in Your Content, Account Information, and System Data as a data controller or data processor in accordance with TogetLink's Data Processing Addendum ("DPA"), which is incorporated by reference, and our Privacy Policy as applicable.

## 11. Usage Restrictions
You will not, directly or indirectly: (i) sublicense, resell, rent, lease, transfer, assign, or otherwise commercially exploit or make the Services available to any third party; (ii) reverse engineer, decompile, disassemble or otherwise attempt to discover the source code, object code or underlying structure, ideas, know-how or algorithms relevant to the Services or any software, documentation or data related to the Services; (iii) modify, translate, or create derivative works based on the Services.

## 12. Support
Subject to the terms hereof, TogetLink may, but is not required to, provide you with commercially reasonable remote technical support services during TogetLink's normal business hours.

## 13. Electronic Communications
By using the Services, you consent to receiving electronic communications from TogetLink. These electronic communications may include notices about applicable Services fees and charges related to the Services and transactional or other information concerning or related to the Services.

## 14. Representation and Warranties
You represent and warrant that (i) you own all Your Content or have obtained all permissions, releases, rights or licenses required to engage in posting and other activities in connection with the Services without obtaining any further releases or consents; (ii) Your Content and other activities in connection with the Services do not and will not violate, infringe, or misappropriate any third party's copyright, trademark, right of privacy, or publicity, or other personal or proprietary right.

## 15. Indemnification
You will indemnify and hold harmless TogetLink against any claims, actions or demands, including without limitation reasonable legal and accounting fees, arising or resulting from your breach of this Agreement.

## 16. Confidentiality; Proprietary Rights
You (the "Receiving Party") understand that TogetLink (the "Disclosing Party") has disclosed or may disclose business, technical, product or financial information or data relating to the Disclosing Party's business (hereinafter referred to as "Proprietary Information"). The Receiving Party agrees: (i) to take reasonable precautions to protect such Proprietary Information, and (ii) not to use or divulge to any third person any such Proprietary Information.

## 17. Payment of Fees
TogetLink offers access to the Services through various plans. The pricing and entitlements of each plan are listed at our pricing page. You will be charged applicable fees and any applicable taxes for any additional Services used. You acknowledge and agree that TogetLink will automatically charge your credit card or other payment method on record.

## 18. Term and Termination
The term of this Agreement will commence on your acceptance of this Agreement and will continue for as long as the Services are being provided to you under this Agreement. TogetLink may terminate your account and this Agreement at any time by providing thirty (30) days prior notice.

## 19. Disclaimer
THE SERVICES AND SUPPORT SERVICES ARE PROVIDED "AS IS" AND TOGETLINK DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.

## 20. Limitation of Liability
EXCEPT FOR YOUR BREACH OF USAGE RESTRICTIONS, CONFIDENTIALITY, AND PAYMENT OF FEES, NEITHER PARTY SHALL BE RESPONSIBLE OR LIABLE FOR ANY INDIRECT, SPECIAL, EXEMPLARY, INCIDENTAL, CONSEQUENTIAL OR PUNITIVE DAMAGES.

## 21. Miscellaneous
TogetLink may change this Agreement from time to time by providing notice either by emailing the email address associated with your account or by posting a notice. The revised Agreement will become effective immediately after TogetLink posts or sends you notice of such changes.

## 22. Governing Law; Disputes; Arbitration
This Agreement shall be governed by the laws of the State of California without regard to its conflict of laws provisions. Any remaining Claims will be resolved by arbitration, including threshold questions of arbitrability of the Claim. You and TogetLink agree that any Claim will be settled by final and binding arbitration.
`;

const TABLE_OF_CONTENTS = [
  { id: "1-age-and-eligibility", label: "Age and Eligibility" },
  { id: "2-temporary-use-license", label: "Temporary Use License" },
  { id: "3-your-content", label: "Your Content" },
  { id: "4-hobby-plan", label: "Hobby Plan" },
  { id: "5-teams-and-projects", label: "Teams and Projects" },
  { id: "6-ai-functionality-and-third-party-tools", label: "AI Functionality and Third Party Tools" },
  { id: "7-acceptable-use", label: "Acceptable Use" },
  { id: "8-etiquette", label: "Etiquette" },
  { id: "9-security-and-compliance", label: "Security and Compliance" },
  { id: "10-data-protection", label: "Data Protection" },
  { id: "11-usage-restrictions", label: "Usage Restrictions" },
  { id: "12-support", label: "Support" },
  { id: "13-electronic-communications", label: "Electronic Communications" },
  { id: "14-representation-and-warranties", label: "Representation and Warranties" },
  { id: "15-indemnification", label: "Indemnification" },
  { id: "16-confidentiality-proprietary-rights", label: "Confidentiality; Proprietary Rights" },
  { id: "17-payment-of-fees", label: "Payment of Fees" },
  { id: "18-term-and-termination", label: "Term and Termination" },
  { id: "19-disclaimer", label: "Disclaimer" },
  { id: "20-limitation-of-liability", label: "Limitation of Liability" },
  { id: "21-miscellaneous", label: "Miscellaneous" },
  { id: "22-governing-law-disputes-arbitration", label: "Governing Law; Disputes; Arbitration" },
];

export default function TermsPage() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2");
      let currentActiveId = "";
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top >= 0 && top <= 300) {
          currentActiveId = heading.id;
        }
      });
      if (currentActiveId) setActiveId(currentActiveId);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generateId = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fafafa", minHeight: "100vh", color: "#111" }}>
        
        {/* Header */}
        <header style={{ 
          borderBottom: "1px solid #eaeaea", 
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontWeight: 800, fontSize: "20px" }}>TL</div>
            <div style={{ color: "#666", fontSize: "14px", marginLeft: "16px" }}>Legal</div>
          </div>
          <div>
            <Link href="/ai-landing-page/login" style={{ 
              backgroundColor: "#000", 
              color: "#fff", 
              padding: "8px 16px", 
              borderRadius: "6px", 
              fontSize: "14px", 
              textDecoration: "none",
              fontWeight: 500
            }}>
              Dashboard
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div style={{ 
          padding: "64px 24px",
          borderBottom: "1px solid #eaeaea",
          textAlign: "center",
          backgroundColor: "#fff"
        }}>
          <h1 style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-1px", marginBottom: "16px" }}>
            Terms of Service
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Last Updated June 1, 2026
          </p>
        </div>

        {/* Content & Sidebar */}
        <div style={{ 
          maxWidth: "1100px", 
          margin: "0 auto", 
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "64px",
          alignItems: "start"
        }}>
          
          {/* Main Markdown Content */}
          <main style={{ 
            fontSize: "16px", 
            lineHeight: "1.7", 
            color: "#333",
          }}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, children, ...props }) => {
                  // extract string from children
                  const text = React.Children.toArray(children).join("");
                  const id = generateId(text);
                  return (
                    <h2 id={id} style={{ 
                      fontSize: "24px", 
                      fontWeight: 600, 
                      marginTop: "48px", 
                      marginBottom: "16px", 
                      letterSpacing: "-0.5px",
                      color: "#000"
                    }} {...props}>
                      {children}
                    </h2>
                  );
                },
                p: ({ node, children, ...props }) => (
                  <p style={{ marginBottom: "24px" }} {...props}>
                    {children}
                  </p>
                )
              }}
            >
              {TERMS_MARKDOWN}
            </ReactMarkdown>
          </main>

          {/* Sticky Right Sidebar */}
          <aside style={{ position: "sticky", top: "100px", borderLeft: "1px solid #eaeaea", paddingLeft: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "#000" }}>On this page</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {TABLE_OF_CONTENTS.map((item) => (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`} 
                    style={{ 
                      fontSize: "14px", 
                      textDecoration: "none", 
                      color: activeId === item.id ? "#000" : "#666",
                      fontWeight: activeId === item.id ? 500 : 400,
                      transition: "color 0.2s"
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
