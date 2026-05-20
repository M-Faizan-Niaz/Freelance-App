'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, LayoutDashboard, Printer, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const amount = params.get('amount');
  const txnId  = params.get('txnId');

  const formattedAmount = amount ? Number(amount).toLocaleString() : '—';

  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <style>{`
        @keyframes pop-in {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.5s ease-out forwards; }
      `}</style>

      <div className="w-full max-w-md space-y-6">
        {/* Animated checkmark */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40 animate-pop-in">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            Your booking is confirmed and payment is secured in escrow.
          </p>
        </div>

        {/* Transaction ID */}
        {txnId && (
          <div className="rounded-lg bg-surface px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">Transaction ID</p>
            <p className="mt-0.5 font-mono text-sm font-bold tracking-widest text-foreground">
              #{txnId}
            </p>
          </div>
        )}

        {/* Summary card */}
        <div className="rounded-xl border bg-card px-5 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="text-lg font-bold text-foreground">₨{formattedAmount}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              Secured in Escrow
            </Badge>
          </div>
          <p className="flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-xs text-green-800 dark:bg-green-950/30 dark:text-green-300">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Funds will be released to the provider once the job is marked complete.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <Button className="w-full gap-2" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              View My Bookings
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            Download Receipt
          </Button>

          <Button variant="ghost" className="w-full gap-2" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
