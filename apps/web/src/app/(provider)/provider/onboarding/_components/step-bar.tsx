import { CheckCircle } from 'lucide-react'

const STEPS = ['Personal', 'Services', 'Documents', 'Portfolio', 'Done']

export function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done || active
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 sm:w-10 ${done ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
