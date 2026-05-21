'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarDays, MapPin, ShieldCheck } from 'lucide-react';
import { useGetBooking, useSubmitPayment } from '@repo/api-client';
import type { SubmitPaymentBody } from '@repo/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentMethodSelector } from '@/components/payment/payment-method-selector';
import { CardForm } from '@/components/payment/card-form';
import type { CardData } from '@/components/payment/card-form';
import { PromoCodeInput } from '@/components/payment/promo-code-input';
import { formatDate } from '@/lib/utils';
import { PLATFORM_FEE_RATE } from '@/lib/constants';
import type { ApiError } from '@/lib/types';

const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5 space-y-4">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <Separator />
      {children}
    </section>
  );
}

function PriceRow({ label, value, highlight, negative }: { label: string; value: string; highlight?: boolean; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={highlight ? 'font-semibold text-foreground' : 'text-muted-foreground'}>{label}</span>
      <span className={highlight ? 'text-lg font-bold text-foreground' : negative ? 'text-green-600 dark:text-green-400' : 'text-foreground'}>
        {value}
      </span>
    </div>
  );
}

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const id = Number(bookingId);
  const router = useRouter();

  const [methodId, setMethodId] = useState(1);
  const [cardData, setCardData] = useState<CardData>({ number: '', expiry: '', cvv: '', name: '' });
  const [txnRef, setTxnRef] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { data: bookingData, isLoading } = useGetBooking(id, {
    query: { enabled: !!id },
  });
  const booking = bookingData?.data;

  const subtotal    = Number(booking?.estimatedPrice ?? 0);
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const discountAmt = Math.round(subtotal * discount / 100);
  const total       = subtotal + platformFee - discountAmt;

  const { mutateAsync: pay, isPending } = useSubmitPayment();

  async function handlePay() {
    setError(null);
    try {
      const body: SubmitPaymentBody = {
        bookingId: id,
        amount: total,
        paymentMethodId: methodId,
        ...(txnRef.trim() && { transactionReference: txnRef.trim() }),
        ...(proofFile && { proofImage: proofFile }),
      };
      const res = await pay({ data: body });
      const txnId = res.data.id;
      router.push(`/payment/${bookingId}/success?amount=${total}&txnId=${txnId}`);
    } catch (e: unknown) {
      const err = e as ApiError;
      setError(err?.data?.error?.message ?? 'Payment failed. Please try again.');
    }
  }

  return (
    <main className="container mx-auto max-w-lg px-4 py-8 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Complete Payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review your order and choose a payment method.</p>
      </div>

      {/* Order summary */}
      <SectionCard title="Order Summary">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-semibold text-foreground">#{id}</span>
            </div>
            {booking?.scheduledAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>{formatDate(booking.scheduledAt, DATE_TIME_FORMAT)}</span>
              </div>
            )}
            {booking?.customerAddress && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{booking.customerAddress}</span>
              </div>
            )}
            <Separator />
            <PriceRow label="Subtotal" value={`₨${subtotal.toLocaleString()}`} />
            <PriceRow label="Platform Fee (5%)" value={`₨${platformFee.toLocaleString()}`} />
          </div>
        )}
      </SectionCard>

      {/* Payment method */}
      <SectionCard title="Payment Method">
        <PaymentMethodSelector selected={methodId} onChange={(id) => { setMethodId(id); setTxnRef(''); setProofFile(null); }} />

        {/* JazzCash / EasyPaisa fields */}
        {[1, 2].includes(methodId) && (
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label htmlFor="txn-ref">Transaction Reference</Label>
              <Input
                id="txn-ref"
                placeholder="Reference number from your payment app"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proof-upload">Payment Proof <span className="text-muted-foreground">(optional)</span></Label>
              <label
                htmlFor="proof-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {proofFile ? `✓ ${proofFile.name}` : 'Upload screenshot or receipt'}
                <input
                  id="proof-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Card form */}
        {methodId === 3 && <CardForm data={cardData} onChange={setCardData} />}

        {/* Cash note */}
        {methodId === 4 && (
          <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
            Pay the provider directly on job completion. The platform fee is still charged.
          </p>
        )}
      </SectionCard>

      {/* Promo code */}
      <SectionCard title="Promo Code">
        <PromoCodeInput onApply={setDiscount} />
      </SectionCard>

      {/* Price breakdown */}
      <section className="rounded-xl border bg-card p-5 space-y-2.5">
        <PriceRow label="Subtotal" value={`₨${subtotal.toLocaleString()}`} />
        <PriceRow label="Platform Fee (5%)" value={`₨${platformFee.toLocaleString()}`} />
        {discount > 0 && (
          <PriceRow label={`Promo Discount (${discount}%)`} value={`-₨${discountAmt.toLocaleString()}`} negative />
        )}
        <Separator />
        <PriceRow label="Total" value={`₨${total.toLocaleString()}`} highlight />
      </section>

      {/* Escrow banner */}
      <div className="flex items-start gap-2.5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-300">
        <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
        Your payment is held securely in escrow until the job is complete.
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        className="w-full h-12 text-base"
        onClick={handlePay}
        disabled={isPending || isLoading || total === 0}
      >
        {isPending ? 'Processing…' : `Pay ₨${total.toLocaleString()}`}
      </Button>
    </main>
  );
}
