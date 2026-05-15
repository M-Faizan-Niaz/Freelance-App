# React Hook Form — Usage Guide

This document describes how React Hook Form (RHF) is used throughout the medical-journal frontend, covering architecture, reusable components, validation, and established patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [Dependencies](#dependencies)
3. [Core UI Primitives (`components/ui/form.tsx`)](#core-ui-primitives)
4. [RHF Wrapper Components](#rhf-wrapper-components)
5. [RHF-Controlled Components (Alternative Set)](#rhf-controlled-components-alternative-set)
6. [Validation — Zod Schemas](#validation--zod-schemas)
7. [Form Builder System](#form-builder-system)
8. [Established Patterns](#established-patterns)
9. [Advanced Patterns](#advanced-patterns)
10. [File Map](#file-map)

---

## Overview

All forms in this project are built with **React Hook Form v7** paired with **Zod** for schema validation via `@hookform/resolvers/zod`. The architecture follows a **FormProvider / useFormContext** split — the page-level component owns the `useForm` instance and wraps its subtree in `<FormProvider>`, while child form components call `useFormContext()` to access the form methods without prop-drilling.

---

## Dependencies

```json
"react-hook-form": "^7.x",
"@hookform/resolvers": "^3.x",
"zod": "^3.x"
```

No Yup or Joi is used anywhere. **Zod is the sole validation library.**

---

## Core UI Primitives

**File:** `src/components/ui/form.tsx`

Wraps RHF internals in compound Radix UI / Tailwind components. Every admin form ultimately renders these primitives.

| Export | Description |
|---|---|
| `Form` | Re-exports `FormProvider` — place at the top of a form tree |
| `FormField` | Wraps `Controller`; accepts `name` + `control` + a render prop |
| `FormItem` | Layout wrapper; injects a `FormItemContext` with a generated `id` |
| `FormLabel` | `<label>` bound to the field id; applies error styling automatically |
| `FormControl` | Passes `id`, `aria-describedby`, `aria-invalid` to the input via Radix `Slot` |
| `FormDescription` | Helper text below an input |
| `FormMessage` | Renders the first `fieldState.error.message`; falls back to `children` |
| `useFormField()` | Custom hook — returns `{ id, name, formItemId, formDescriptionId, formMessageId, ...fieldState }` |

### Usage example

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## RHF Wrapper Components

Located in `src/components/rhf/`. Each component calls `useFormContext()` internally, so it must be rendered inside a `<FormProvider>` (or `<Form>`).

### `RHFInput` — `src/components/rhf/RHFInput/index.tsx`

General-purpose controlled input. Handles both text and numeric modes.

| Prop | Type | Notes |
|---|---|---|
| `name` | `string` | RHF field name (dot-notation for nested) |
| `label` | `string?` | Rendered above the input |
| `type` | `"text" \| "number" \| ...` | Triggers numeric formatting when `"number"` |
| `placeholder` | `string?` | |
| `disabled` | `boolean?` | |
| `suffix` | `ReactNode?` | E.g. currency symbol appended inside the input |
| `onChange` | `(value) => void` | Optional extra callback alongside RHF's onChange |

**Numeric mode behaviour:** Maintains a local display string (comma-formatted) separate from the RHF internal value. Uses `useController` for granular value/display state separation. Mobile keyboards receive `inputMode="decimal"`.

### `RHFSelect` — `src/components/rhf/RHFSelect/index.tsx`

Generic select, typed as `RHFSelect<T extends number | string>`.

| Prop | Type | Notes |
|---|---|---|
| `name` | `string` | |
| `label` | `string?` | |
| `options` | `{ value: T; label: string }[]` | |
| `placeholder` | `string?` | |
| `searchable` | `boolean?` | Enables search within the dropdown |
| `loading` | `boolean?` | Shows spinner while options are loading |
| `disabled` | `boolean?` | |
| `onChange` | `(value: T) => void` | Optional extra callback |

Uses `useFormState` to read error state without subscribing to value changes, keeping re-renders minimal.

### `RHFCheckbox` — `src/components/rhf/RHFCheckbox/index.tsx`

Controlled Radix UI `Checkbox`.

| Prop | Type | Notes |
|---|---|---|
| `name` | `string` | |
| `label` | `string?` | |
| `disabled` | `boolean?` | |
| `onChange` | `(checked: boolean) => void` | Optional extra callback |

### `RHFPhoneInput` — `src/components/rhf/RHFPhoneInput/index.tsx`

Manages a **nested phone object** with three sub-fields.

```ts
// Shape stored in RHF
{
  countryIso: string;   // e.g. "AE"
  dialCode:   string;   // e.g. "+971"
  number:     string;   // the user-typed digits
}
```

Internally uses `useWatch` to track the whole phone object and `setValue` (with `shouldDirty`, `shouldTouch`, `shouldValidate`) to update all three keys atomically. Validation errors surface on the `.number` sub-field only.

### `RHFTextarea` — `src/components/rhf/RHFTextarea/index.tsx`

Thin wrapper around `BaseTextarea` via `RHFField`.

| Prop | Type |
|---|---|
| `name` | `string` |
| `label` | `string?` |
| `placeholder` | `string?` |
| `disabled` | `boolean?` |
| `onChange` | `(value: string) => void` |

### `RHFField` — `src/components/rhf/RHFField.tsx`

Low-level building block used internally by the wrappers above. Combines `FormField` (from `ui/form`) with a render-prop children API. Use this when building a new custom RHF component.

```tsx
<RHFField name="myField" label="My Field">
  {(field) => <CustomInput {...field} />}
</RHFField>
```

---

## RHF-Controlled Components (Alternative Set)

Located in `src/components/rhf-controlled/`. These use `useController` + the `FormField/FormItem/FormControl/FormMessage` primitives directly, rather than the `RHFField` abstraction.

| File | Description |
|---|---|
| `Input.tsx` | Text input using `useController` and `useFormState` |
| `select.tsx` | Radix UI Select wrapped in `FormField`; handles both string arrays and `SelectOptionType[]` options; includes loading spinner and empty-state message |

> These exist as an alternative approach — prefer the `src/components/rhf/` set for new work unless the page already uses the `rhf-controlled` variants.

---

## Validation — Zod Schemas

All schemas live in a `schema/` directory co-located with their feature area. The naming convention is `<entity>.schema.ts` or `<entity>.ts`.

### Schema anatomy

```ts
import { z } from "zod";

export const myEntitySchema = z.object({
  id:          z.string().default(""),
  name:        z.string().min(1, "Name is required"),
  email:       z.string().email("Invalid email"),
  amount:      z.string().refine((v) => Number(v) > 0, "Must be positive"),
  phone: z.object({
    countryIso: z.string().min(1),
    dialCode:   z.string().min(1),
    number:     z.string().min(1),
  }),
});

export type MyEntityFormValues = z.infer<typeof myEntitySchema>;
```

### Schema locations

| Feature area | Schema files |
|---|---|
| Auth | `src/lib/validations/auth.ts` |
| User management | `admin-user-management/schema/` — user, company, countries, experience, specialties, user-type |
| Communication prefs | `admin-communication-preferences/schema/` — interest-categories, notification-frequency, workflow-notification, system-messages |
| Pricing & payments | `admin-pricing-and-payments/schema/` — expenses, level-based-pricing, article-type-pricing, balance-sheet-categories/entries, expense-categories, income, service-pricing, payment-gateway |
| Research content config | `admin-research-content-configuration/schema/` — article-categories, article-types, article-content-sections, disclosure-category, disclosure-links, reviewer-comment-types, workflow-statuses |
| Research submission mgmt | `admin-research-submission-management/schema/` — research-categories |
| System parameters | `admin-system-parameters/schema/` — system-parameters |
| Master admin mgmt | `master-admin-management/schema/` — data-clerk, editors, papers, reviewers |
| Reporting | `admin-reporting/schema/` — heat-map, statuses |

### Connecting a schema to a form

```ts
import { zodResolver } from "@hookform/resolvers/zod";

const methods = useForm<MyEntityFormValues>({
  resolver: zodResolver(myEntitySchema),
  defaultValues: { id: "", name: "", email: "" },
});
```

---

## Form Builder System

A generic data-driven form builder eliminates repetitive JSX for simple CRUD forms.

**Core files:**
- `src/components/form-builder.tsx` — renders a grid of fields from a config array + a submit button
- `src/components/field-registry.tsx` — maps field type strings to RHF components
- `src/components/field-rendered.tsx` — looks up and renders a single field from the registry
- `src/types/form.types.ts` — TypeScript types for field configs

**Supported field types:**

| `type` string | Rendered component |
|---|---|
| `"input"` | `RHFInput` |
| `"select"` | `RHFSelect` |

**Field config types:**

```ts
type BaseField = {
  name:      string;
  label:     string;
  disabled?: boolean;
  className?: string;
};

type InputField  = BaseField & { type: "input";  placeholder?: string };
type SelectField = BaseField & { type: "select"; options: { value: string; label: string }[] };

type FieldConfig = InputField | SelectField;
```

**Usage:**

```tsx
const fields: FieldConfig[] = [
  { type: "input",  name: "firstName", label: "First Name" },
  { type: "select", name: "country",   label: "Country", options: countryOptions },
];

<FormProvider {...methods}>
  <FormBuilder fields={fields} submitText="Save" onSubmit={handleSubmit(onSubmit)} />
</FormProvider>
```

> Local copies of `form-builder`, `field-registry`, and `field-rendered` also exist inside individual admin feature directories (`admin-user-management/components/`, `admin-communication-preferences/components/`) when feature-specific customisation is needed.

---

## Established Patterns

### Pattern 1 — FormProvider at page level

The page owns `useForm`; child form components are kept thin and call `useFormContext()`.

```tsx
// Page / tab component
const methods = useForm<UserFormValues>({
  resolver: zodResolver(userSchema),
  defaultValues: emptyUser,
});

return (
  <FormProvider {...methods}>
    <UserForm onSubmit={methods.handleSubmit(onSubmit)} />
  </FormProvider>
);

// UserForm child
const { handleSubmit } = useFormContext();
```

### Pattern 2 — Create / Edit mode with `reset()`

```tsx
const [selectedId, setSelectedId] = useState<string | null>(null);

// When the user clicks Edit on a table row:
const handleEdit = (item: UserFormValues) => {
  setSelectedId(item.id);
  methods.reset(item);          // hydrates all fields at once
  scrollToFormRef.current?.scrollIntoView();
};

// onSubmit branches on selectedId:
const onSubmit = async (data: UserFormValues) => {
  if (selectedId) {
    await updateItem(selectedId, data);
  } else {
    await createItem(data);
  }
  methods.reset(emptyUser);
  setSelectedId(null);
};
```

### Pattern 3 — Inline schema for one-off modals

For complex modals that are not part of a larger CRUD page (e.g. `AuthorModal`), define the Zod schema inline inside the component file and pair it with local `useForm`.

```tsx
const authorSchema = z.object({
  firstName: z.string().min(1),
  email:     z.string().email(),
  // ...
});

const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
  resolver: zodResolver(authorSchema),
});
```

In this case `register()` is used for plain `<input>` elements and `Controller` wraps custom select components.

### Pattern 4 — isSubmitting for loading state

```tsx
const { formState: { isSubmitting } } = useFormContext();

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Saving…" : "Save"}
</Button>
```

---

## Advanced Patterns

### Dependent field auto-calculation (`useWatch` + `useEffect`)

Used in `admin-pricing-and-payments/form/level-based-pricing/`.

```tsx
const priceAED = useWatch({ control, name: "priceAED" });

useEffect(() => {
  const aed = parseFloat(priceAED) || 0;
  setValue("priceUSD", String((aed * 0.27).toFixed(2)));
}, [priceAED, setValue]);
```

### Dynamic metric options (`useWatch` + `useMemo`)

Used in `admin-reporting/form/heat-map.form.tsx`.

```tsx
const category = useWatch({ control, name: "category" });

const metricOptions = useMemo(() => {
  return METRIC_MAP[category] ?? [];
}, [category]);

// Reset dependent field when category changes
<RHFSelect
  name="category"
  options={categoryOptions}
  onChange={() => setValue("metric", "")}
/>
```

### Array checkboxes with `watch` + `setValue`

Used in `admin-communication-preferences/form/workflow-notification/`.

```tsx
const platforms: string[] = watch("platforms") ?? [];

const handlePlatformChange = (platform: string, checked: boolean) => {
  const next = checked
    ? [...platforms, platform]
    : platforms.filter((p) => p !== platform);
  setValue("platforms", next, { shouldDirty: true, shouldValidate: true });
};
```

### Dynamic list rows with `useFieldArray`

Used in `admin-pricing-and-payments/form/service-pricing/`.

```tsx
const { fields, append, remove } = useFieldArray({
  control,
  name: "services",
});

{fields.map((field, index) => (
  <div key={field.id}>
    <RHFInput name={`services.${index}.name`} label="Service" />
    <RHFInput name={`services.${index}.price`} label="Price" type="number" />
    <button type="button" onClick={() => remove(index)}>Remove</button>
  </div>
))}

<button type="button" onClick={() => append({ name: "", price: "" })}>
  Add Row
</button>
```

### `setValue` options cheat-sheet

All internal `setValue` calls pass explicit options to control RHF's dirty/touched/validation tracking:

```ts
setValue("field", value, {
  shouldDirty:    true,   // marks the form dirty
  shouldTouch:    true,   // marks the field touched (shows errors after blur)
  shouldValidate: true,   // runs validation immediately
});
```

---

## File Map

```
src/
├── components/
│   ├── ui/
│   │   └── form.tsx                    ← Core RHF primitives (Form, FormField, FormItem, …)
│   ├── rhf/
│   │   ├── RHFField.tsx                ← Low-level render-prop wrapper
│   │   ├── RHFInput/index.tsx          ← Text + numeric input
│   │   ├── RHFSelect/index.tsx         ← Generic select
│   │   ├── RHFCheckbox/index.tsx       ← Checkbox
│   │   ├── RHFPhoneInput/index.tsx     ← Nested phone object input
│   │   └── RHFTextarea/index.tsx       ← Textarea
│   ├── rhf-controlled/
│   │   ├── Input.tsx                   ← Alternative input (useController)
│   │   └── select.tsx                  ← Alternative select (useController)
│   ├── form-builder.tsx                ← Generic data-driven form renderer
│   ├── field-registry.tsx              ← type → component map
│   ├── field-rendered.tsx              ← Renders a single field via registry
│   └── ...
├── types/
│   └── form.types.ts                   ← FieldConfig, InputField, SelectField types
├── lib/
│   └── validations/
│       └── auth.ts                     ← loginSchema, signupSchema
└── app/(admin)/
    ├── admin-user-management/
    │   ├── schema/                     ← user, company, countries, … schemas
    │   └── form/                       ← form UI components per entity
    ├── admin-communication-preferences/
    │   ├── schema/
    │   └── form/
    ├── admin-pricing-and-payments/
    │   ├── schema/
    │   └── form/
    ├── admin-reporting/
    │   ├── schema/
    │   └── form/
    ├── admin-research-content-configuration/
    │   ├── schema/
    │   └── form/
    ├── admin-research-submission-management/
    │   ├── schema/
    │   └── form/
    ├── admin-system-parameters/
    │   ├── schema/
    │   └── form/
    └── master-admin-management/
        ├── schema/
        └── form/
```
