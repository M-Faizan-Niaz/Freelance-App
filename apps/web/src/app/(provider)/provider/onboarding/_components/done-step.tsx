'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const COMPLETION_ITEMS = [
  'Personal info & photo saved',
  'Services & pricing configured',
  'CNIC documents uploaded',
  'Portfolio photos added',
]

export function DoneStep() {
  const router = useRouter()

  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-bold">Profile submitted!</h2>
      <p className="text-muted-foreground max-w-sm mx-auto text-sm">
        Our team will verify your CNIC and approve your profile within 24–48 hours. You'll be
        notified once you go live.
      </p>

      <Card className="max-w-sm mx-auto text-left">
        <CardContent className="p-4 space-y-2.5">
          {COMPLETION_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary shrink-0" />
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button size="lg" className="mt-2" onClick={() => router.push('/provider/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  )
}
