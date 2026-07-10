import type { Metadata } from "next"
import { LegalLayout, type LegalContentSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Privacy Policy — togetlink",
  description:
    "How TogetLink, a product of Aeternexus Inc., collects, uses, and protects your information.",
}

const sections: LegalContentSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <>
        <p>
          TogetLink is a professional networking platform operated by Aeternexus
          Inc. This Privacy Policy explains, in plain language, what information
          we handle when you use TogetLink and the choices available to you.
        </p>
        <p>
          Our goal is to help professionals meet in real-world places with
          intent and trust. Because of that, we aim to collect only what is
          needed to make those connections safe and useful.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>We collect information in a few different ways:</p>
        <ul>
          <li>Details you provide, such as your name, email, and profile.</li>
          <li>Activity within TogetLink, such as hubs you follow or events you join.</li>
          <li>Approximate location, only when you enable nearby discovery.</li>
          <li>Device and diagnostic data that helps us keep the service reliable.</li>
        </ul>
      </>
    ),
  },
  {
    id: "why-we-collect",
    title: "Why we collect data",
    body: (
      <>
        <p>
          We use information to operate TogetLink, suggest relevant nearby hubs
          and people, protect the community, and improve the product over time.
        </p>
        <p>
          We do not sell your personal information. Where we use data to
          personalize your experience, we aim to keep it consent-based and
          transparent.
        </p>
      </>
    ),
  },
  {
    id: "privacy-controls",
    title: "Your privacy controls",
    body: (
      <>
        <p>
          You remain in control of your profile visibility, location sharing,
          and communication preferences. You can adjust these controls at any
          time from your account settings.
        </p>
      </>
    ),
  },
  {
    id: "sharing-information",
    title: "Sharing information",
    body: (
      <>
        <p>
          We share information only in limited situations: with your consent,
          with trusted service providers who process data on our behalf, or when
          required to meet a legal obligation.
        </p>
      </>
    ),
  },
  {
    id: "keeping-information-secure",
    title: "Keeping information secure",
    body: (
      <>
        <p>
          We apply organizational and technical safeguards designed to protect
          your information against unauthorized access, loss, or misuse. No
          system is perfectly secure, so we continuously review our practices.
        </p>
      </>
    ),
  },
  {
    id: "exporting-deleting",
    title: "Exporting and deleting information",
    body: (
      <>
        <p>
          You may request a copy of your information or ask us to delete your
          account. When you delete your account, we remove or de-identify
          personal data unless we are required to retain it.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data retention",
    body: (
      <>
        <p>
          We keep information only for as long as it is needed for the purposes
          described in this policy, or as required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: "regulatory-compliance",
    title: "Regulatory cooperation and compliance",
    body: (
      <>
        <p>
          We work to comply with applicable data protection laws and cooperate
          with relevant regulatory authorities where required.
        </p>
      </>
    ),
  },
  {
    id: "about-this-policy",
    title: "About this policy",
    body: (
      <>
        <p>
          We may update this policy as TogetLink evolves. When we make
          meaningful changes, we will provide notice through the service. This
          is placeholder copy and does not yet constitute legal advice.
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      activeTab="Privacy Policy"
      title="Privacy Policy"
      effectiveDate="January 1, 2026 (placeholder)"
      intro="This placeholder policy describes how TogetLink handles information as we build a trust-first professional networking experience."
      sections={sections}
    />
  )
}
