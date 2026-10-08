import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IdeaAI | Pitch Deck',
  description: 'The Autonomous Local Mentor. Zero-state, local desktop AI agent that mentors developers on architecture before executing changes autonomously.',
  openGraph: {
    title: 'IdeaAI | The Autonomous Local Mentor',
    description: 'Zero-state, local desktop AI agent that mentors developers on architecture before executing changes autonomously.',
    url: 'https://ideaai.togetlink.com/pitch-deck',
    siteName: 'IdeaAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaAI | The Autonomous Local Mentor',
    description: 'Zero-state, local desktop AI agent that mentors developers on architecture.',
  },
}

export default function PitchDeckLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
