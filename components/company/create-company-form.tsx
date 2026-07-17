"use client"

import { useState } from "react"
import { Building2, ArrowRight, Building, Users, Globe, Briefcase, CheckCircle2 } from "lucide-react"

export function CreateCompanyForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 2) {
      setStep(2)
      return
    }
    
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: (document.getElementById("companyName") as HTMLInputElement).value,
          website: (document.getElementById("website") as HTMLInputElement).value,
          industry: (document.getElementById("industry") as HTMLSelectElement).value,
          size: (document.getElementById("size") as HTMLSelectElement).value,
        })
      })
      
      if (!res.ok) throw new Error("Failed to create company")
      
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
      // Ideally show error toast here
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#e5e5e5] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Company Created!</h2>
        <p className="mt-2 text-muted-foreground">
          Your company profile is now active. You can start inviting team members and managing your hubs.
        </p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          Go to Company Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
          <Building2 className="size-6" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Create a Company Account</h1>
        <p className="mt-2 text-muted-foreground">
          Empower your team to network and collaborate across professional hubs.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 border-b border-[#e5e5e5] p-6">
          <div className="flex flex-1 items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">1</span>
            <span className="text-sm font-semibold text-foreground">Company Details</span>
          </div>
          <div className="h-px flex-1 bg-border/50" />
          <div className="flex flex-1 items-center gap-2 opacity-50">
            <span className={`flex size-6 items-center justify-center rounded-full ${step === 2 ? 'bg-brand-blue text-white opacity-100' : 'bg-muted text-muted-foreground'} text-xs font-bold`}>2</span>
            <span className={`text-sm font-semibold ${step === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Verification</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium text-foreground">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="companyName"
                    type="text"
                    required
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-[#e0e0e0] bg-[#f5f5f5] py-2.5 pl-9 pr-4 text-sm text-foreground focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium text-foreground">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="website"
                    type="url"
                    required
                    placeholder="https://acme.com"
                    className="w-full rounded-xl border border-[#e0e0e0] bg-[#f5f5f5] py-2.5 pl-9 pr-4 text-sm text-foreground focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="industry" className="text-sm font-medium text-foreground">
                    Industry
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      id="industry"
                      required
                      className="w-full appearance-none rounded-xl border border-[#e0e0e0] bg-[#f5f5f5] py-2.5 pl-9 pr-4 text-sm text-foreground focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                      <option value="">Select industry...</option>
                      <option value="tech">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="design">Design & Creative</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="size" className="text-sm font-medium text-foreground">
                    Company Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      id="size"
                      required
                      className="w-full appearance-none rounded-xl border border-[#e0e0e0] bg-[#f5f5f5] py-2.5 pl-9 pr-4 text-sm text-foreground focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                      <option value="">Select size...</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201+">201+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 text-sm text-brand-blue">
                To verify your company, please confirm you are authorized to create this account on behalf of the organization.
              </div>
              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 size-4 rounded border-[#e0e0e0] text-brand-blue focus:ring-brand-blue" />
                  <span className="text-sm text-foreground">I confirm that I am an authorized representative of this company and have the right to act on its behalf.</span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 size-4 rounded border-[#e0e0e0] text-brand-blue focus:ring-brand-blue" />
                  <span className="text-sm text-foreground">I agree to the TogetLink Company Terms of Service and Privacy Policy.</span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-[#e5e5e5] pt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={step === 1}
              className={`text-sm font-medium transition-colors ${step === 1 ? 'text-transparent cursor-default' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                "Creating..."
              ) : step === 1 ? (
                <>Continue <ArrowRight className="size-4" /></>
              ) : (
                "Create Company Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
