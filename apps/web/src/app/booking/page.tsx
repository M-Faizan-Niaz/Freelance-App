import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BookingShell } from './_components/booking-shell';

export const metadata: Metadata = {
  title: 'Book a Service — HirePro',
};

export default function BookingPage() {
  return (
    <main className="container mx-auto px-4 py-8 lg:px-6">
      <Suspense>
        <BookingShell />
      </Suspense>
    </main>
  );
}
