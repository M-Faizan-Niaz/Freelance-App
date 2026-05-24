'use client'

import { Percent } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'

export default function AdminCommissionPage() {
  return (
    <div>
      <PageHeader
        title="Commission Settings"
        description="Configure platform commission rates by provider tier."
      />

      <div className="max-w-xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {['Standard', 'Premium', 'Elite'].map(tier => (
                <div key={tier} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{tier} Tier</p>
                    <p className="text-xs text-muted-foreground">Commission rate for {tier.toLowerCase()} providers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={tier === 'Standard' ? 15 : tier === 'Premium' ? 12 : 10}
                      className="w-20 px-2 py-1.5 rounded-md border text-sm text-right outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6">Save Commission Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
