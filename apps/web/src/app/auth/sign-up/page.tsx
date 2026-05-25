'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { User, Wrench, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Role = 'customer' | 'provider'

const ROLE_ID = { customer: 1, provider: 2 } as const

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)

  // shared fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  // provider-only fields
  const [cnic, setCnic] = useState('')
  const [city, setCity] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!/^\+\d{7,15}$/.test(phone)) {
      toast.error('Phone must start with + followed by digits only, e.g. +923001234567')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter')
      return
    }
    if (!/[a-z]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter')
      return
    }
    if (!/\d/.test(password)) {
      toast.error('Password must contain at least one number')
      return
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error('Password must contain at least one special character')
      return
    }
    if (role === 'provider' && !/^\d{5}-\d{7}-\d$/.test(cnic)) {
      toast.error('CNIC must be in format XXXXX-XXXXXXX-X')
      return
    }

    setLoading(true)

    const payload =
      role === 'customer'
        ? { name, email, password, phoneNumber: phone }
        : { name, email, password, phoneNumber: phone, cnicNumber: cnic, city }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/api/auth/register/${role}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        },
      )

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg =
          json?.error?.message ??
          json?.message ??
          (res.status === 409 ? 'Email already registered.' : 'Registration failed.')
        toast.error(msg)
        return
      }

      toast.success('Account created! Please verify your email.')
      router.push('/auth/verify-email')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 1: role picker ──────────────────────────────────────────────────
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold">Create an account</h1>
            <p className="text-sm text-muted-foreground">How will you use ServeEase?</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRole('customer')}
              className={cn(
                'flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all hover:border-primary hover:bg-primary/5',
                'border-border',
              )}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">I'm a Customer</p>
                <p className="text-xs text-muted-foreground mt-1">Book home services</p>
              </div>
            </button>

            <button
              onClick={() => setRole('provider')}
              className={cn(
                'flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all hover:border-primary hover:bg-primary/5',
                'border-border',
              )}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">I'm a Provider</p>
                <p className="text-xs text-muted-foreground mt-1">Offer your services</p>
              </div>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="underline underline-offset-4 hover:text-foreground">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // ── Step 2: registration form ────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-semibold">
            {role === 'customer' ? 'Customer account' : 'Provider account'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {role === 'customer'
              ? 'Book trusted home services.'
              : 'Offer your skills to customers.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="name">Full Name</label>
            <Input
              id="name"
              placeholder="Jane Doe"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="phone">Phone Number</label>
            <Input
              id="phone"
              type="tel"
              placeholder="+923001234567"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">International format, no spaces (e.g. +923001234567)</p>
          </div>

          {role === 'provider' && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="cnic">CNIC Number</label>
                <Input
                  id="cnic"
                  placeholder="XXXXX-XXXXXXX-X"
                  required
                  value={cnic}
                  onChange={e => setCnic(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Format: 42101-1234567-8</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="city">City</label>
                <Input
                  id="city"
                  placeholder="Karachi"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Must include uppercase, lowercase, number, and special character</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="confirm">Confirm Password</label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="underline underline-offset-4 hover:text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
