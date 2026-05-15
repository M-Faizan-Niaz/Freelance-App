import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import FormBuilder from "@/components/form-builder";
import { colorSchema, type ColorFormValues } from "./color.schema";
import { colorFields } from "./color.config";

interface ColorFormProps {
  title: string;
  defaultValues: ColorFormValues;
  onSubmit: (data: ColorFormValues) => void;
}

export function ColorForm({ title, defaultValues, onSubmit }: ColorFormProps) {
  const navigate = useNavigate();
  const methods = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues,
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  return (
    <div className="max-w-lg mx-auto p-6">
      <button
        type="button"
        onClick={() => navigate({ to: "/data-table" })}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormBuilder
            fields={colorFields}
            submitText={title}
            isSubmitting={isSubmitting}
            submitTestId="color-form-submit"
          />
        </form>
      </FormProvider>
    </div>
  );
}
