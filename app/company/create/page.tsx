import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CreateCompanyForm } from "@/components/company/create-company-form"

export const metadata: Metadata = {
  title: "Create Company Account — TogetLink",
  description: "Upgrade to a company account to manage your team.",
}

export default function CreateCompanyPage() {
  return (
    <DashboardShell>
      <CreateCompanyForm />
    </DashboardShell>
  )
}
