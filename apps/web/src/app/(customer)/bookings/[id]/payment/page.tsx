'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useSubmitPayment } from '@repo/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { toast } from 'sonner'

const PAYMENT_METHODS = [
  { id: 1, label: 'JazzCash' },
  { id: 2, label: 'EasyPaisa' },
  { id: 3, label: 'Credit / Debit Card' },
  { id: 4, label: 'Cash on Completion' },
]

const MAX_FILE_MB = 10

export default function SubmitPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = Number(params.id)

  const [methodId, setMethodId] = useState('')
  const [amount, setAmount] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [txRef, setTxRef] = useState('')
  const [notes, setNotes] = useState('')

  const { mutate, isPending } = useSubmitPayment({
    mutation: {
      onSuccess: () => {
        toast.success('Payment submitted! Awaiting admin review.')
        router.push('/payments')
      },
      onError: (err: any) => {
        toast.error(err?.data?.message ?? 'Failed to submit payment.')
      },
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Proof image must be under ${MAX_FILE_MB} MB.`)
      e.target.value = ''
      return
    }
    setProofFile(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!methodId) {
      toast.error('Please select a payment method.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount.')
      return
    }
    if (!proofFile) {
      toast.error('Please upload proof of payment.')
      return
    }

    mutate({
      data: {
        bookingId,
        amount: Number(amount),
        paymentMethodId: Number(methodId),
        proofImage: proofFile,
        transactionReference: txRef.trim() || undefined,
        notes: notes.trim() || undefined,
      },
    })
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 py-2">
      <Link
        href={`/bookings/${bookingId}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Booking
      </Link>

      <PageHeader
        title="Submit Payment"
        description={`Upload your payment proof for booking #${bookingId}.`}
      />

      <Card>
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={methodId} onValueChange={setMethodId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method…" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount (Rs.)</label>
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 2500"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Payment Proof{' '}
                <span className="text-muted-foreground font-normal">(screenshot or receipt)</span>
              </label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground">Max 10 MB. JPG, PNG, WEBP accepted.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Transaction Reference{' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                placeholder="e.g. TXN123456"
                maxLength={255}
                value={txRef}
                onChange={e => setTxRef(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Notes{' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                placeholder="Any additional information for the admin…"
                maxLength={1000}
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isPending ? 'Submitting…' : 'Submit Payment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
