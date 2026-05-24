'use client'

import { FileText, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'

export default function ProviderDocumentsPage() {
  return (
    <div>
      <PageHeader
        title="Identity Verification"
        description="Upload your CNIC documents to get verified and start receiving jobs."
      />

      <div className="max-w-xl space-y-4">
        {['CNIC Front', 'CNIC Back'].map(label => (
          <Card key={label}>
            <CardContent className="p-6">
              <h3 className="font-medium mb-3">{label}</h3>
              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button className="w-full" size="lg">
          <FileText className="h-4 w-4 mr-2" />
          Submit for Verification
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your documents are encrypted and only reviewed by our verification team.
        </p>
      </div>
    </div>
  )
}
