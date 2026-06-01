import { CheckCircle2 } from 'lucide-react'

const STATUS_STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'travelling', label: 'On the Way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

export function StatusProgress({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === currentStatus)

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {STATUS_STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={step.key} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  done
                    ? 'bg-primary text-white'
                    : active
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`h-px w-8 sm:w-12 mb-4 mx-1 ${i < currentIdx ? 'bg-primary' : 'bg-border'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
