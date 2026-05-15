# Product CREATE / UPDATE Form — Implementation Guide

This document explains how the product form works end-to-end: every file involved, why it exists, and how all the pieces connect.

---

## The Big Picture

The form system is built in **layers**. Each layer has one job and hands off to the next:

```
Page (create / edit)
  └── ProductForm         ← owns form state (useForm)
        └── FormBuilder   ← loops over field configs and renders them
              └── FieldRendered
                    └── fieldRegistry  ← maps "input" / "select" / "checkbox" → component
                          └── RHFInput / RHFSelect / RHFCheckbox
                                └── BaseInput / BaseSelect  ← raw UI, no RHF knowledge
```

The key idea: **data flows down as config, not as JSX**. You describe a field with a plain object `{ type: "input", name: "price", label: "Price" }` and the registry turns that description into the actual React component. Adding a new field type means touching only the registry — nothing else.

---

## Files Modified

### `src/types/form.types.ts`

**What it is:** The single source of truth for what a field config object can look like.

**What was added:**
- `inputType` on `InputField` — lets you pass `type="number"` or `type="email"` to the underlying `<input>`. Without this, every input would always be `type="text"`.
- New `SelectField` type — describes a dropdown field. It carries its own `options` array so the select knows what choices to render.
- `FieldConfig` union was expanded from `InputField | CheckboxField` to `InputField | SelectField | CheckboxField`.

```ts
// Before
export type FieldConfig = InputField | CheckboxField;

// After
export type FieldConfig = InputField | SelectField | CheckboxField;
```

**Why this matters:** Every other file in the system uses `FieldConfig` as its type. Expanding this union automatically makes TypeScript enforce that the registry handles `select`, that configs are valid, etc.

---

### `src/components/field-registry.tsx`

**What it is:** A lookup table that maps a field `type` string to a render function.

**What was added:**
- Import of `RHFSelect`
- A `select` entry in the registry object that casts the config to `SelectField` and passes `options`, `placeholder`, etc. to `RHFSelect`
- `type={c.inputType}` passed through to `RHFInput` so number/email inputs work

```ts
const fieldRegistry: Record<FieldConfig["type"], FieldRenderer> = {
  input:    (config) => <RHFInput    ... type={c.inputType} />,
  select:   (config) => <RHFSelect   ... options={c.options} />,
  checkbox: (config) => <RHFCheckbox ... />,
};
```

**Why `Record<FieldConfig["type"], FieldRenderer>`?** TypeScript will give a compile error if the registry is missing a handler for any type in the union. If you add `"textarea"` to `FieldConfig`, the build breaks here until you add a `textarea` entry. This is intentional — it makes omissions impossible to miss.

---

## Files Created

### `src/components/shared/select.tsx`

**What it is:** A pure UI select component — no React Hook Form knowledge whatsoever.

**Why it was needed:** `RHFSelect` imports `BaseSelect` from this path. The file didn't exist, causing the Vite import error. `BaseSelect` is the same pattern as `BaseInput` — a styled, controlled component that just calls `onChange(value)` when the user picks something.

**Key design decisions:**

1. **Radix Select underneath** — built on top of the existing `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` components from `src/components/ui/select.tsx`. No new dependency.

2. **Flat options AND grouped options** — the `isGrouped()` helper checks whether the first item has an `options` property. If yes, renders `<SelectGroup>` wrappers. If no, renders items directly.

3. **Number value coercion** — Radix Select only works with `string` values internally. If your options use numeric values (e.g. `{ label: "10", value: 10 }`), the component converts to string on the way in (`String(value)`) and converts back on the way out (`Number(val)`). It detects this automatically by checking `typeof firstValue === "number"`.

4. **`invalid` prop** — sets `aria-invalid` on the trigger element. The existing Tailwind styles on `SelectTrigger` already have `aria-invalid:border-destructive` defined, so the red border appears automatically with no extra CSS.

```
src/components/shared/
  input.tsx   ← BaseInput  (existed before)
  select.tsx  ← BaseSelect (created now)
```

---

### `src/pages/product.schema.ts`

**What it is:** The Zod validation schema for a product form.

**Why a separate file:** Keeps validation logic isolated. The schema is imported by `ProductForm.tsx` (for the resolver) and by both page files (for the `ProductFormValues` type). Co-locating it with the feature avoids a shared `schemas/` folder for something that only belongs to the product feature.

```ts
export const productSchema = z.object({
  name:     z.string().min(1, "Name is required"),
  price:    z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  active:   z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
```

**`z.coerce.number()` explained:** HTML `<input type="number">` gives you a string (e.g. `"99.99"`), not a number. `z.coerce.number()` tells Zod to automatically run `Number(value)` before validating. Without `coerce`, price would always fail the `number()` type check.

**`z.infer<typeof productSchema>`:** Instead of writing the TypeScript type by hand, we derive it from the schema. If you add a field to the schema, the type updates automatically — no duplication.

---

### `src/pages/product.config.ts`

**What it is:** The field configuration array for the product form. This is the only place you define which fields appear, in what order, with what labels and options.

```ts
export const productFields: FieldConfig[] = [
  { type: "input",    name: "name",     label: "Name",     placeholder: "Enter product name" },
  { type: "input",    name: "price",    label: "Price",    placeholder: "0.00", inputType: "number" },
  { type: "select",   name: "category", label: "Category", placeholder: "Select a category", options: [...] },
  { type: "checkbox", name: "active",   label: "Active" },
];
```

**Why a separate file:** `ProductForm.tsx` would get cluttered if the config array lived inside it. More importantly, configs are plain data — no JSX, no hooks. Keeping them separate makes them easy to read, test, and reuse.

**The `name` field must match the schema key exactly.** The `name` property is passed to `useFormContext()` inside each RHF wrapper — it's how RHF knows which field value to read and write. If `name: "category"` doesn't exist in the Zod schema, it will still render but silently write to a field that doesn't get validated.

---

### `src/pages/ProductForm.tsx`

**What it is:** The shared form shell used by both Create and Edit pages.

**What it owns:**
- `useForm` — creates the form instance with Zod resolver
- `FormProvider` — broadcasts the form context so every `RHFInput`/`RHFSelect`/`RHFCheckbox` inside can call `useFormContext()` without prop drilling
- The `<form>` tag with `handleSubmit`
- The Back button and the page title

**Props:**
| Prop | Type | Purpose |
|---|---|---|
| `title` | `string` | Displayed as the `<h1>` and as the submit button text |
| `defaultValues` | `ProductFormValues` | Passed to `useForm`. Empty object = Create mode. Pre-filled object = Edit mode |
| `onSubmit` | `(data) => void` | Called with validated data after the form passes Zod checks |

**Why `defaultValues` instead of `reset()`:** Passing values directly to `useForm({ defaultValues })` means the form is initialized correctly on first render. The Edit page can rely on React re-mounting the component if the product ID changes (which re-runs `useForm` with fresh values).

```tsx
export function ProductForm({ title, defaultValues, onSubmit }: ProductFormProps) {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,           // ← this is the only difference between create and edit
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormBuilder fields={productFields} submitText={title} isSubmitting={...} />
      </form>
    </FormProvider>
  );
}
```

---

### `src/pages/product-create.tsx`

**What it is:** The Create page. Its only job is to define the empty starting state and the submit handler, then hand both to `ProductForm`.

```ts
const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  price: 0,
  category: "",
  active: true,
};

export function CreateProductPage() {
  function onSubmit(data: ProductFormValues) {
    console.log("CREATE product:", data);
    // → replace with: await api.products.create(data)
  }

  return <ProductForm title="Create Product" defaultValues={EMPTY_PRODUCT} onSubmit={onSubmit} />;
}
```

**`active: true` as default:** New products are active by default. If you want inactive by default, change it here — nowhere else.

---

### `src/pages/product-edit.tsx`

**What it is:** The Edit page. It reads the product ID from the URL, looks up the product data, strips the `id` field (the form doesn't manage it), and passes the rest to `ProductForm` as `defaultValues`.

```ts
export function EditProductPage() {
  const { productId } = useParams({ strict: false });
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) return <p>Product not found.</p>;

  const { id: _id, ...defaultValues } = product; // strip id before passing to form

  function onSubmit(data: ProductFormValues) {
    console.log(`UPDATE product ${productId}:`, data);
    // → replace with: await api.products.update(productId, data)
  }

  return <ProductForm title={`Edit Product: ${product.name}`} defaultValues={defaultValues} onSubmit={onSubmit} />;
}
```

**`useParams({ strict: false })`:** TanStack Router's strict mode would require importing a generated route type. `strict: false` is the simpler approach — it reads whatever params are on the current URL.

**`const { id: _id, ...defaultValues } = product`:** Destructuring trick. The form schema does not have an `id` field. If we passed the full product object including `id`, React Hook Form would try to track an `id` field that Zod doesn't know about. Stripping it keeps the form values exactly aligned with the schema.

**`MOCK_PRODUCTS`:** Placeholder. In production this would be replaced with a `useQuery` call or a route loader that fetches from the API.

---

### `src/router.tsx` (modified)

Two routes were added under `DashboardLayoutRoute` (sidebar layout, auth-protected):

```ts
// /products/create  → CreateProductPage
// /products/:productId/edit  → EditProductPage
```

Both use `beforeLoad: requireAuth` — same guard as every other dashboard route. If the user is not logged in, they're redirected to `/auth/sign-in`.

`$productId` in the path is TanStack Router's syntax for a dynamic segment. `useParams()` in the Edit page reads it as `productId`.

---

## How a Submit Actually Works (step by step)

1. User clicks **Submit**
2. The `<form onSubmit={handleSubmit(onSubmit)}>` fires
3. RHF runs `zodResolver(productSchema)` against all current field values
4. **If validation fails:** RHF writes errors into `formState.errors`. Each `RHFField` wrapper calls `useFormState({ name })` to read its own error and displays it below the field. The `onSubmit` callback is NOT called.
5. **If validation passes:** RHF calls `onSubmit(data)` with the fully typed, validated `ProductFormValues` object
6. `isSubmitting` becomes `true` while the async `onSubmit` runs → submit button shows "Saving…" and is disabled
7. When `onSubmit` resolves, `isSubmitting` returns to `false`

---

## Where to Plug in a Real API

| File | Line to change |
|---|---|
| `product-create.tsx` | Replace `console.log` with `await api.products.create(data)` |
| `product-edit.tsx` | Replace `console.log` with `await api.products.update(productId, data)` |
| `product-edit.tsx` | Replace `MOCK_PRODUCTS.find(...)` with `useQuery(...)` or a route loader |

No other file needs to change.

---

## Adding a New Field

Example: add a `description` textarea.

1. **`form.types.ts`** — add a `TextareaField` type to the union
2. **`field-registry.tsx`** — add a `textarea` entry that renders `RHFTextarea`
3. **`product.schema.ts`** — add `description: z.string().optional()`
4. **`product.config.ts`** — add `{ type: "textarea", name: "description", label: "Description" }`

Steps 1–2 are one-time setup. Steps 3–4 are per-feature. `ProductForm.tsx`, `FormBuilder`, and the page files need zero changes.
