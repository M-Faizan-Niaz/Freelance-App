'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { StepBar } from './_components/step-bar'
import { PersonalStep } from './_components/personal-step'
import { ServicesStep } from './_components/services-step'
import { DocumentsStep } from './_components/documents-step'
import { PortfolioStep } from './_components/portfolio-step'
import { DoneStep } from './_components/done-step'

const STEP_SUBTITLES = [
  'Start with a photo and your contact info.',
  'Tell customers about your services and pricing.',
  'Upload your CNIC for identity verification.',
  'Show your best work to attract more customers.',
  "You're all set — we'll review and approve your profile shortly.",
]

export default function ProviderOnboardingPage() {
  const [step, setStep] = useState(0)
  const next = () => setStep((s) => s + 1)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        {step > 0 && step < 4 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        <h1 className="text-2xl font-bold">Complete your provider profile</h1>
        <p className="text-muted-foreground text-sm mt-1">{STEP_SUBTITLES[step]}</p>
      </div>

      <StepBar current={step} />

      {step === 0 && <PersonalStep onNext={next} />}
      {step === 1 && <ServicesStep onNext={next} />}
      {step === 2 && <DocumentsStep onNext={next} />}
      {step === 3 && <PortfolioStep onNext={next} />}
      {step === 4 && <DoneStep />}
    </div>
  )
}
