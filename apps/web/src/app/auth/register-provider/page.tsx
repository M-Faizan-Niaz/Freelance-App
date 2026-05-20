'use client';

import { useReducer, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Upload,
  ImagePlus,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/* ── Constants ───────────────────────────────────────────────── */

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar'];

const CATEGORY_OPTIONS = [
  'Electrician',
  'Plumber',
  'AC & Appliances',
  'Cleaning',
  'Painting',
  'Moving',
  'Carpenter',
  'Outdoor',
];

const STEPS = [
  { label: 'Personal Info' },
  { label: 'Professional Info' },
  { label: 'Verification' },
];

/* ── State & Reducer ─────────────────────────────────────────── */

interface FormState {
  step: number;
  // Step 1
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  photoCount: number;
  // Step 2
  categories: string[];
  experience: string;
  city: string;
  bio: string;
  portfolioCount: number;
  // Step 3
  cnic: string;
  cnicFrontUploaded: boolean;
  cnicBackUploaded: boolean;
  licenseUploaded: boolean;
  clearanceUploaded: boolean;
  termsAccepted: boolean;
}

type Action =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET'; field: keyof FormState; value: string | number | boolean | string[] }
  | { type: 'TOGGLE_CATEGORY'; category: string };

const INITIAL: FormState = {
  step: 1,
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  photoCount: 0,
  categories: [],
  experience: '',
  city: '',
  bio: '',
  portfolioCount: 0,
  cnic: '',
  cnicFrontUploaded: false,
  cnicBackUploaded: false,
  licenseUploaded: false,
  clearanceUploaded: false,
  termsAccepted: false,
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, 4) };
    case 'PREV':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'SET':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_CATEGORY': {
      const exists = state.categories.includes(action.category);
      return {
        ...state,
        categories: exists
          ? state.categories.filter((c) => c !== action.category)
          : [...state.categories, action.category],
      };
    }
    default:
      return state;
  }
}

/* ── Progress bar ────────────────────────────────────────────── */

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const done = i + 1 < current;
          const active = i + 1 === current;
          return (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className={cn(
                      'h-px flex-1 transition-colors',
                      done || active ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
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

/* ── Upload button helper ────────────────────────────────────── */

function UploadButton({
  label,
  uploaded,
  onUpload,
  optional,
}: {
  label: string;
  uploaded: boolean;
  onUpload: () => void;
  optional?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onUpload}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors',
        uploaded
          ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
          : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
      )}
    >
      {uploaded ? (
        <CheckCircle className="h-4 w-4 shrink-0" />
      ) : (
        <Upload className="h-4 w-4 shrink-0" />
      )}
      <span className="flex-1 text-left">
        {uploaded ? `${label} — uploaded` : label}
      </span>
      {optional && !uploaded && (
        <span className="text-xs text-muted-foreground">Optional</span>
      )}
    </button>
  );
}

/* ── Step 1 — Personal Info ──────────────────────────────────── */

function Step1({
  state,
  dispatch,
  photoRef,
}: {
  state: FormState;
  dispatch: React.Dispatch<Action>;
  photoRef: React.RefObject<HTMLInputElement | null>;
}) {
  const passwordsMatch =
    !state.confirmPassword || state.password === state.confirmPassword;

  const canContinue =
    !!state.fullName.trim() &&
    !!state.phone.trim() &&
    !!state.email.trim() &&
    state.password.length >= 8 &&
    state.password === state.confirmPassword;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Personal information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is how customers and our team will identify you.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Ahmed Raza"
            value={state.fullName}
            onChange={(e) => dispatch({ type: 'SET', field: 'fullName', value: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <div className="flex gap-2">
            <span className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
              +92
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="300 1234567"
              value={state.phone}
              onChange={(e) => dispatch({ type: 'SET', field: 'phone', value: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="ahmed@example.com"
            value={state.email}
            onChange={(e) => dispatch({ type: 'SET', field: 'email', value: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            value={state.password}
            onChange={(e) => dispatch({ type: 'SET', field: 'password', value: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={state.confirmPassword}
            onChange={(e) =>
              dispatch({ type: 'SET', field: 'confirmPassword', value: e.target.value })
            }
            className={cn(!passwordsMatch && 'border-destructive focus-visible:ring-destructive')}
          />
          {!passwordsMatch && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>

        {/* Profile photo */}
        <div className="space-y-2">
          <Label>Profile photo</Label>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() =>
              dispatch({ type: 'SET', field: 'photoCount', value: 1 })
            }
          />
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border-2 border-dashed px-4 py-4 text-sm transition-colors',
              state.photoCount > 0
                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            <ImagePlus className="h-5 w-5 shrink-0" />
            {state.photoCount > 0 ? 'Profile photo uploaded' : 'Upload a profile photo'}
          </button>
        </div>
      </div>

      <Button className="w-full" size="lg" disabled={!canContinue} onClick={() => dispatch({ type: 'NEXT' })}>
        Continue
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>
      </p>
    </div>
  );
}

/* ── Step 2 — Professional Info ──────────────────────────────── */

function Step2({
  state,
  dispatch,
  portfolioRef,
}: {
  state: FormState;
  dispatch: React.Dispatch<Action>;
  portfolioRef: React.RefObject<HTMLInputElement | null>;
}) {
  const canContinue =
    state.categories.length > 0 &&
    !!state.experience &&
    !!state.city &&
    !!state.bio.trim();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Professional information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Help customers understand your skills and availability.
        </p>
      </div>

      <div className="space-y-4">
        {/* Categories */}
        <div className="space-y-2">
          <Label>
            Service categories{' '}
            <span className="font-normal text-muted-foreground">(select all that apply)</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map((cat) => {
              const checked = state.categories.includes(cat);
              return (
                <label
                  key={cat}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                    checked
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-foreground hover:border-primary/50',
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      dispatch({ type: 'TOGGLE_CATEGORY', category: cat })
                    }
                  />
                  {cat}
                </label>
              );
            })}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience">Years of experience</Label>
          <Select
            value={state.experience}
            onValueChange={(v) => dispatch({ type: 'SET', field: 'experience', value: v })}
          >
            <SelectTrigger id="experience">
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              {['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'].map(
                (y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">Service area (city)</Label>
          <Select
            value={state.city}
            onValueChange={(v) => dispatch({ type: 'SET', field: 'city', value: v })}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">About you</Label>
          <Textarea
            id="bio"
            placeholder="Describe your experience, skills, and what makes you stand out..."
            rows={4}
            maxLength={500}
            value={state.bio}
            onChange={(e) => dispatch({ type: 'SET', field: 'bio', value: e.target.value })}
          />
          <p className="text-right text-xs text-muted-foreground">{state.bio.length}/500</p>
        </div>

        {/* Portfolio upload */}
        <div className="space-y-2">
          <Label>Portfolio photos (up to 6)</Label>
          <input
            ref={portfolioRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const count = Math.min(e.target.files?.length ?? 0, 6);
              dispatch({ type: 'SET', field: 'portfolioCount', value: count });
            }}
          />
          <button
            type="button"
            onClick={() => portfolioRef.current?.click()}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm transition-colors',
              state.portfolioCount > 0
                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            <ImagePlus className="h-5 w-5" />
            {state.portfolioCount > 0
              ? `${state.portfolioCount} photo${state.portfolioCount > 1 ? 's' : ''} uploaded`
              : 'Upload portfolio photos'}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => dispatch({ type: 'PREV' })}>
          Back
        </Button>
        <Button className="flex-1" disabled={!canContinue} onClick={() => dispatch({ type: 'NEXT' })}>
          Continue
        </Button>
      </div>
    </div>
  );
}

/* ── Step 3 — Verification ───────────────────────────────────── */

function Step3({
  state,
  dispatch,
  cnicFrontRef,
  cnicBackRef,
  licenseRef,
  clearanceRef,
}: {
  state: FormState;
  dispatch: React.Dispatch<Action>;
  cnicFrontRef: React.RefObject<HTMLInputElement | null>;
  cnicBackRef: React.RefObject<HTMLInputElement | null>;
  licenseRef: React.RefObject<HTMLInputElement | null>;
  clearanceRef: React.RefObject<HTMLInputElement | null>;
}) {
  function formatCnic(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }

  const canSubmit =
    state.cnic.replace(/\D/g, '').length === 13 &&
    state.cnicFrontUploaded &&
    state.cnicBackUploaded &&
    state.termsAccepted;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Identity verification</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Required to build trust with customers. Your data is encrypted and never shared.
        </p>
      </div>

      <div className="space-y-4">
        {/* CNIC */}
        <div className="space-y-2">
          <Label htmlFor="cnic">CNIC number</Label>
          <Input
            id="cnic"
            placeholder="XXXXX-XXXXXXX-X"
            value={state.cnic}
            onChange={(e) =>
              dispatch({ type: 'SET', field: 'cnic', value: formatCnic(e.target.value) })
            }
            maxLength={15}
          />
          <p className="text-xs text-muted-foreground">Format: 12345-1234567-1</p>
        </div>

        <Separator />

        {/* CNIC uploads */}
        <div className="space-y-2">
          <Label>CNIC photos</Label>
          <div className="space-y-2">
            <input
              ref={cnicFrontRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => dispatch({ type: 'SET', field: 'cnicFrontUploaded', value: true })}
            />
            <UploadButton
              label="CNIC — Front side"
              uploaded={state.cnicFrontUploaded}
              onUpload={() => cnicFrontRef.current?.click()}
            />

            <input
              ref={cnicBackRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => dispatch({ type: 'SET', field: 'cnicBackUploaded', value: true })}
            />
            <UploadButton
              label="CNIC — Back side"
              uploaded={state.cnicBackUploaded}
              onUpload={() => cnicBackRef.current?.click()}
            />
          </div>
        </div>

        <Separator />

        {/* Optional documents */}
        <div className="space-y-2">
          <Label>Additional documents</Label>
          <p className="text-xs text-muted-foreground">
            Optional, but increase customer trust and unlock higher-tier status faster.
          </p>
          <div className="space-y-2">
            <input
              ref={licenseRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={() => dispatch({ type: 'SET', field: 'licenseUploaded', value: true })}
            />
            <UploadButton
              label="Trade license / Certificate"
              uploaded={state.licenseUploaded}
              onUpload={() => licenseRef.current?.click()}
              optional
            />

            <input
              ref={clearanceRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={() =>
                dispatch({ type: 'SET', field: 'clearanceUploaded', value: true })
              }
            />
            <UploadButton
              label="Police clearance certificate"
              uploaded={state.clearanceUploaded}
              onUpload={() => clearanceRef.current?.click()}
              optional
            />
          </div>
        </div>

        <Separator />

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
          <Checkbox
            id="terms"
            checked={state.termsAccepted}
            onCheckedChange={(v) =>
              dispatch({ type: 'SET', field: 'termsAccepted', value: !!v })
            }
            className="mt-0.5 shrink-0"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
            . I confirm all information provided is accurate.
          </span>
        </label>

        {/* Escrow note */}
        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Your documents are reviewed within 24–48 hours. You&apos;ll receive an SMS once
            your account is approved and ready to go live.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => dispatch({ type: 'PREV' })}>
          Back
        </Button>
        <Button className="flex-1" disabled={!canSubmit} onClick={() => dispatch({ type: 'NEXT' })}>
          Submit Application
        </Button>
      </div>
    </div>
  );
}

/* ── Confirmation screen ─────────────────────────────────────── */

function Confirmation() {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-12 w-12 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
        <p className="text-sm text-muted-foreground">
          Your application is under review. Our team will verify your documents within 24–48
          hours.
        </p>
      </div>

      <div className="w-full rounded-xl border bg-card px-5 py-4 text-left space-y-2 text-sm">
        <p className="font-semibold text-foreground">What happens next?</p>
        <ol className="space-y-1.5 text-muted-foreground list-none">
          {[
            'Our team reviews your CNIC and documents',
            'You receive an SMS with your verification status',
            'Your profile goes live and you start receiving job requests',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button className="w-full" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/sign-in">Sign in to your account</Link>
        </Button>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function RegisterProviderPage() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const photoRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const cnicFrontRef = useRef<HTMLInputElement>(null);
  const cnicBackRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);
  const clearanceRef = useRef<HTMLInputElement>(null);

  const isConfirmation = state.step === 4;

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-lg font-extrabold text-primary">
            HirePro
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            {isConfirmation ? 'Application Received' : 'Apply as a Provider'}
          </h1>
          {!isConfirmation && (
            <p className="mt-1 text-sm text-muted-foreground">Step {state.step} of 3</p>
          )}
        </div>

        {/* Progress bar (hidden on confirmation) */}
        {!isConfirmation && <ProgressBar current={state.step} />}

        {/* Step content */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          {state.step === 1 && (
            <Step1 state={state} dispatch={dispatch} photoRef={photoRef} />
          )}
          {state.step === 2 && (
            <Step2 state={state} dispatch={dispatch} portfolioRef={portfolioRef} />
          )}
          {state.step === 3 && (
            <Step3
              state={state}
              dispatch={dispatch}
              cnicFrontRef={cnicFrontRef}
              cnicBackRef={cnicBackRef}
              licenseRef={licenseRef}
              clearanceRef={clearanceRef}
            />
          )}
          {isConfirmation && <Confirmation />}
        </div>
      </div>
    </div>
  );
}
