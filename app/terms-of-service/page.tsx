import type { Metadata } from "next"
import { LegalLayout, type LegalContentSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Terms of Service — togetlink",
  description:
    "The terms that govern your use of TogetLink, a product of Aeternexus Inc.",
}

const sections: LegalContentSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <p>
        These Terms of Service govern your access to and use of TogetLink,
        operated by Aeternexus Inc. By using TogetLink, you agree to these
        placeholder terms. Please read them carefully.
      </p>
    ),
  },
  {
    id: "your-relationship",
    title: "Your relationship with TogetLink",
    body: (
      <p>
        These terms describe the relationship between you and Aeternexus Inc.
        when you use our services. They do not create any partnership, agency,
        or employment relationship beyond what is described here.
      </p>
    ),
  },
  {
    id: "using-services",
    title: "Using TogetLink services",
    body: (
      <>
        <p>
          You agree to use TogetLink respectfully and lawfully. When you attend
          real-world meetings arranged through the platform, you are responsible
          for your own safety and conduct.
        </p>
        <ul>
          <li>Keep your account information accurate.</li>
          <li>Respect other members and the spaces you visit.</li>
          <li>Do not use TogetLink to harass, deceive, or harm others.</li>
        </ul>
      </>
    ),
  },
  {
    id: "content",
    title: "Content in TogetLink",
    body: (
      <p>
        You retain ownership of the content you share. By posting content, you
        grant us a limited license to display and distribute it within the
        service so we can operate TogetLink for you and other members.
      </p>
    ),
  },
  {
    id: "software-access",
    title: "Software and platform access",
    body: (
      <p>
        We grant you a personal, non-transferable, revocable license to use the
        TogetLink applications. You agree not to misuse, reverse engineer, or
        interfere with the platform.
      </p>
    ),
  },
  {
    id: "problems-disputes",
    title: "In case of problems or disputes",
    body: (
      <p>
        If a dispute arises, we encourage you to contact us first so we can try
        to resolve it. This placeholder section will describe warranties,
        liability limits, and dispute resolution once finalized with counsel.
      </p>
    ),
  },
  {
    id: "about-these-terms",
    title: "About these terms",
    body: (
      <p>
        If any part of these terms is found unenforceable, the remaining parts
        stay in effect. Our failure to enforce a provision is not a waiver of
        it.
      </p>
    ),
  },
  {
    id: "updates",
    title: "Updates",
    body: (
      <p>
        We may update these terms as the product evolves. When we make material
        changes, we will provide reasonable notice through the service.
      </p>
    ),
  },
  {
    id: "definitions",
    title: "Definitions",
    body: (
      <ul>
        <li>&quot;TogetLink&quot; refers to the platform and applications operated by Aeternexus Inc.</li>
        <li>&quot;Member&quot; refers to any person with a TogetLink account.</li>
        <li>&quot;Hub&quot; refers to a real-world place or community listed on TogetLink.</li>
      </ul>
    ),
  },
]

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      activeTab="Terms of Service"
      title="Terms of Service"
      effectiveDate="January 1, 2026 (placeholder)"
      intro="These placeholder terms explain the rules for using TogetLink while we finalize our official agreement with legal counsel."
      sections={sections}
    />
  )
}
