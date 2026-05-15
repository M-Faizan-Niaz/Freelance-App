import { FieldConfig } from "@/types/form.types";
import FieldRendered from "./field-rendered";

interface FormBuilderProps {
  fields: FieldConfig[];
  submitText: string;
  isSubmitting?: boolean;
  submitTestId?: string;
}

const FormBuilder = ({ fields, submitText, isSubmitting, submitTestId }: FormBuilderProps) => (
  <div className="grid grid-cols-1 gap-y-4">
    {fields.map((field) => (
      <FieldRendered key={field.name} config={field} />
    ))}

    <button
      type="submit"
      disabled={isSubmitting}
      data-testid={submitTestId}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
    >
      {isSubmitting ? "Saving…" : submitText}
    </button>
  </div>
);

export default FormBuilder;
