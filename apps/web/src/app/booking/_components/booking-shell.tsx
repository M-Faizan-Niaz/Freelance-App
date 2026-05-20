'use client';

import { useReducer, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { getProviderById } from '@/app/providers/_data/provider-profiles';
import { cn } from '@/lib/utils';
import { StepService } from './step-service';
import { StepSchedule } from './step-schedule';
import { StepAddress } from './step-address';
import { StepEstimate } from './step-estimate';
import { StepConfirm } from './step-confirm';

/* ── State & Reducer ─────────────────────────────────────────── */

export interface BookingState {
  step: number;
  providerId: string;
  categorySlug: string;
  serviceLabel: string;
  description: string;
  photoCount: number;
  selectedDate: string;    // 'YYYY-MM-DD'
  selectedTimeSlot: string;
  selectedTimeLabel: string; // '9:00 AM'
  addressStreet: string;
  addressArea: string;
  addressCity: string;
  addressUnit: string;
}

export type BookingAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_FIELD'; field: keyof BookingState; value: string | number };

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 5) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

/* ── Step metadata ───────────────────────────────────────────── */

const STEPS = [
  { label: 'Service' },
  { label: 'Schedule' },
  { label: 'Address' },
  { label: 'Estimate' },
  { label: 'Confirm' },
];

/* ── Progress bar ────────────────────────────────────────────── */

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="w-full">
      {/* Step dots + connector */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const done = i + 1 < current;
          const active = i + 1 === current;
          return (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                {/* Left connector */}
                {i > 0 && (
                  <div
                    className={cn(
                      'h-px flex-1 transition-colors',
                      done || active ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
                {/* Dot */}
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                    done
                      ? 'border-primary bg-primary text-primary-foreground'
                      : active
                        ? 'border-primary bg-background text-primary ring-4 ring-primary/20'
                        : 'border-border bg-background text-muted-foreground',
                  )}
                >
                  {done ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                </div>
                {/* Right connector */}
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'h-px flex-1 transition-colors',
                      done ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="mt-1.5 flex justify-between">
        {STEPS.map((s, i) => (
          <span
            key={s.label}
            className={cn(
              'flex-1 text-center text-[11px] font-medium leading-tight',
              i + 1 === current ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Shell ───────────────────────────────────────────────────── */

export function BookingShell() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const providerId = searchParams.get('providerId') ?? '';
  const provider = useMemo(() => getProviderById(providerId), [providerId]);

  const initialService =
    searchParams.get('service') ??
    provider?.servicesOffered[0]?.label ??
    '';

  const [state, dispatch] = useReducer(reducer, {
    step: 1,
    providerId,
    categorySlug: searchParams.get('category') ?? provider?.categorySlug ?? '',
    serviceLabel: initialService,
    description: '',
    photoCount: 0,
    selectedDate: '',
    selectedTimeSlot: '',
    selectedTimeLabel: '',
    addressStreet: '',
    addressArea: '',
    addressCity: 'Karachi',
    addressUnit: '',
  });

  // File objects aren't serializable — track them outside the reducer
  const photosRef = useRef<File[]>([]);

  function handleConfirm() {
    const bookingId = `HPR-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const params = new URLSearchParams({
      bookingId,
      providerId: state.providerId,
      service: state.serviceLabel,
      date: state.selectedDate,
      time: state.selectedTimeLabel,
      city: state.addressCity,
    });
    router.push(`/booking/confirmation?${params.toString()}`);
  }

  const stepProps = { state, dispatch, provider };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <ProgressBar current={state.step} />

      {state.step === 1 && (
        <StepService {...stepProps} photosRef={photosRef} />
      )}
      {state.step === 2 && <StepSchedule {...stepProps} />}
      {state.step === 3 && <StepAddress {...stepProps} />}
      {state.step === 4 && <StepEstimate {...stepProps} />}
      {state.step === 5 && (
        <StepConfirm {...stepProps} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
