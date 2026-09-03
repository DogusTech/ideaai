"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useEffect, useState } from "react";

const PRIVACY_MARKDOWN = `
At TogetLink, we respect customers' need for privacy. We offer our Sites and Services to customers and users either directly or via a reseller. Where we refer to our "Customers" in this Privacy Notice, we refer to customers that have entered into an agreement with us or our resellers to use the Services. Each Customer's respective website users or applicable visitors are referred to as their "End Users."

By using or accessing our Sites and Services in any manner, you accept the practices and policies outlined in this Privacy Notice and you acknowledge that we may process and share your information.

## About TogetLink Products and Services
TogetLink is a frontend cloud for deploying and scaling frontend applications. Our Developer Experience Platform and Managed Infrastructure services provide Customers the ability to build applications and create, share and collaborate on deployments.

## Applicability
This Privacy Notice ("Notice") explains TogetLink's practices regarding the collection, use, disclosure, and processing of your personal information; the rights and choices you may have with respect to such information; how you may contact us; and how we protect your information when you:
- Visit TogetLink's websites.
- Access or use products or services made available by TogetLink.
- Interact with us in any way, including registering for, attending, or otherwise partaking in our events.

Under this Notice, TogetLink acts as a data controller or "business" for the personal information we process.

## Information We Collect
The information that we collect depends on your interactions with us, the choices that you make, the products and features you use, your location, and applicable laws.

### Information You Provide Directly to Us
We collect the following information directly from you when using our Sites and Services:
- **Contact Information.** We collect your contact information when you use, inquire about, or purchase our Services.
- **Professional Information.** We collect professional information about you, including your company name, company website, job title, and industry.
- **Account Information.** We collect information you provide to us to create, update, or administer your account on the Sites & Services.
- **Transactional Information.** We collect payment and other transactional information related to our Services.

### Information We Collect from Third Parties
We receive information about Customers from third parties or TogetLink partners that provide services or support our business operations.

### Information We Collect Automatically
When you use or interact with our Sites and Services, we automatically collect or receive certain information about you, your device, and your usage of our Site and Services.

## How We Use Information
We use your information as described in this Notice to provide our Sites and Services. For example, we may use your information for Service Operation, Product Development, Support, and Security.

## How We Retain Your Information
We retain your information for the minimum necessary period to fulfill our legal and contractual obligations, develop our Sites and Services, resolve disputes, enforce our rights.

## How We Disclose Information
We disclose information as necessary to provide the Sites and Services, as required by law, or as part of our business practices.

## How We Secure Your Information
We use reasonable and appropriate administrative, technical, and physical safeguards designed to protect the information that we have about you from unauthorized or unlawful access.

## Third-Party Services
Our Sites and Services may contain links to or integrations with other websites or applications not operated or controlled by TogetLink.

## How We Transfer Your Information
If you are accessing or using our Sites and Services or otherwise providing your information to us, you consent to the processing of your information in the United States and other jurisdictions in which we operate.

## Your Privacy Rights and Choices
You may have certain rights and choices available when it comes to how we collect and use your information.
- Right to Access and Portability.
- Right to Rectify or Update.
- Right to Delete.

## Minimum Age Requirements
The Sites and Services are not directed or intended for use by individuals under the age of 16.

## Changes to Our Privacy Notice
We periodically review and update this Notice to describe new Services or changes to our practices.

## Contact Us
If you have questions about this Notice, please contact us at privacy@togetlink.com.
`;

const TABLE_OF_CONTENTS = [
  { id: "about-togetlink-products-and-services", label: "About Products" },
  { id: "applicability", label: "Applicability" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-information", label: "How We Use Information" },
  { id: "how-we-retain-your-information", label: "How We Retain Information" },
  { id: "how-we-disclose-information", label: "How We Disclose Information" },
  { id: "how-we-secure-your-information", label: "How We Secure Information" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "how-we-transfer-your-information", label: "How We Transfer Information" },
  { id: "your-privacy-rights-and-choices", label: "Your Privacy Rights" },
  { id: "minimum-age-requirements", label: "Minimum Age" },
  { id: "changes-to-our-privacy-notice", label: "Changes" },
  { id: "contact-us", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
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
            <Link href="/login" style={{ 
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
            Privacy Notice
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
                h3: ({ node, children, ...props }) => (
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginTop: "32px", marginBottom: "12px", color: "#000" }} {...props}>
                    {children}
                  </h3>
                ),
                p: ({ node, children, ...props }) => (
                  <p style={{ marginBottom: "24px" }} {...props}>
                    {children}
                  </p>
                ),
                ul: ({ node, children, ...props }) => (
                  <ul style={{ paddingLeft: "24px", marginBottom: "24px" }} {...props}>
                    {children}
                  </ul>
                ),
                li: ({ node, children, ...props }) => (
                  <li style={{ marginBottom: "8px" }} {...props}>
                    {children}
                  </li>
                )
              }}
            >
              {PRIVACY_MARKDOWN}
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
