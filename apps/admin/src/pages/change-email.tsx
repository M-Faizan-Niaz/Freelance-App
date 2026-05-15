import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const requestSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address.'),
});

const verifySchema = z.object({
  otp: z
    .string()
    .length(6, 'Code must be exactly 6 digits.')
    .regex(/^\d+$/, 'Code must contain only digits.'),
});

type RequestValues = z.infer<typeof requestSchema>;
type VerifyValues = z.infer<typeof verifySchema>;

function RequestEmailChangeForm({ onSent }: { onSent: (email: string) => void }) {
  const form = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { newEmail: '' },
  });

  const onSubmit = async (data: RequestValues) => {
    const { error } = await authClient.emailOtp.requestEmailChange({
      newEmail: data.newEmail,
    });

    if (error) {
      toast.error(error.message ?? 'Failed to send verification code. Please try again.');
      return;
    }

    toast.success(`Verification code sent to ${data.newEmail}.`);
    onSent(data.newEmail);
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="newEmail"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="new-email">New Email Address</FieldLabel>
              <Input
                {...field}
                id="new-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Sending code…' : 'Send verification code'}
      </Button>
    </form>
  );
}

function VerifyEmailChangeForm({ newEmail, onBack }: { newEmail: string; onBack: () => void }) {
  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: VerifyValues) => {
    const { error } = await authClient.emailOtp.changeEmail({
      newEmail,
      otp: data.otp,
    });

    if (error) {
      toast.error(error.message ?? 'Invalid or expired code. Please try again.');
      return;
    }

    toast.success('Email address updated successfully.');
    onBack();
  };

  const resend = async () => {
    const { error } = await authClient.emailOtp.requestEmailChange({ newEmail });
    if (error) {
      toast.error(error.message ?? 'Failed to resend code.');
    } else {
      toast.success(`Code resent to ${newEmail}.`);
    }
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        A 6-digit code was sent to{' '}
        <span className="font-medium text-foreground">{newEmail}</span>.
      </p>
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="otp"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email-change-otp">Verification Code</FieldLabel>
              <Input
                {...field}
                id="email-change-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                autoComplete="one-time-code"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Verifying…' : 'Verify & change email'}
        </Button>
      </div>
      <button
        type="button"
        onClick={resend}
        className="text-left text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
      >
        Didn't receive a code? Resend
      </button>
    </form>
  );
}

export function ChangeEmailPage() {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  return (
    <div className="max-w-md space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Change email</h1>
        <p className="text-sm text-muted-foreground">
          {pendingEmail
            ? 'Enter the verification code sent to your new email address.'
            : 'Enter your new email address. A verification code will be sent to it.'}
        </p>
      </div>
      {pendingEmail ? (
        <VerifyEmailChangeForm newEmail={pendingEmail} onBack={() => setPendingEmail(null)} />
      ) : (
        <RequestEmailChangeForm onSent={setPendingEmail} />
      )}
    </div>
  );
}
