'use client'

import { Images, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export default function PortfolioPage() {
  return (
    <div>
      <PageHeader
        title="My Portfolio"
        description="Upload photos of your work to attract more customers."
      >
        <Button size="sm" className="flex items-center gap-2">
          <Upload className="h-4 w-4" /> Upload Photos
        </Button>
      </PageHeader>

      {/* Upload zone */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="border-2 border-dashed rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">Drag & drop photos here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to select files</p>
            <p className="text-xs text-muted-foreground mt-2">PNG, JPG — up to 10 files, 5MB each</p>
          </div>
        </CardContent>
      </Card>

      <EmptyState
        icon={Images}
        title="No portfolio photos"
        message="Upload photos of your completed work to build trust with customers."
      />
    </div>
  )
}
