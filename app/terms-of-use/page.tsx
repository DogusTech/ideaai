import type { Metadata } from "next"
import { LegalLayout, type LegalContentSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Terms of Use — togetlink",
  description:
    "Acceptable use, account responsibility, and professional conduct on TogetLink.",
}

const sections: LegalContentSection[] = [
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>
          TogetLink is built for genuine professional networking. You agree to
          use the platform for its intended purpose and to avoid activity that
          could harm the community or the service.
        </p>
        <ul>
          <li>No spam, scraping, or automated abuse.</li>
          <li>No impersonation or misleading representations.</li>
          <li>No unlawful, deceptive, or harmful behavior.</li>
        </ul>
      </>
    ),
  },
  {
    id: "account-responsibility",
    title: "Account responsibility",
    body: (
      <p>
        You are responsible for your account and for keeping your login
        credentials secure. Activity that happens under your account is your
        responsibility, so please notify us promptly of any unauthorized use.
      </p>
    ),
  },
  {
    id: "professional-conduct",
    title: "Professional conduct",
    body: (
      <p>
        Because TogetLink facilitates real-world meetings, we expect members to
        act professionally and respectfully. Treat every interaction the way you
        would a trusted professional introduction.
      </p>
    ),
  },
  {
    id: "safety",
    title: "Safety",
    body: (
      <p>
        Your safety matters. Meet in appropriate professional settings, use your
        judgment, and report any behavior that makes you feel unsafe. TogetLink
        provides tools to help, but you remain responsible for your personal
        safety in real-world meetings.
      </p>
    ),
  },
  {
    id: "misuse",
    title: "Misuse",
    body: (
      <p>
        We may limit, suspend, or remove access for members who misuse the
        platform or violate these terms. This helps us protect the community and
        maintain a trustworthy environment.
      </p>
    ),
  },
  {
    id: "platform-limitations",
    title: "Platform limitations",
    body: (
      <p>
        TogetLink introduces professionals but does not guarantee outcomes,
        partnerships, or the conduct of other members. The service is provided
        on an &quot;as is&quot; basis while it remains in development, and this
        placeholder copy will be finalized with legal counsel.
      </p>
    ),
  },
]

export default function TermsOfUsePage() {
  return (
    <LegalLayout
      activeTab="Terms of Use"
      title="Terms of Use"
      effectiveDate="January 1, 2026 (placeholder)"
      intro="These placeholder terms describe acceptable use, account responsibility, and professional conduct expected on TogetLink."
      sections={sections}
    />
  )
}
