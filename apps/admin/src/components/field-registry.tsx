import RHFInput from "@/rhf/RHFInput";
import RHFCheckbox from "@/rhf/RHFCheckbox";
import RHFSelect from "@/rhf/RHFSelect";
import { FieldConfig } from "@/types/form.types";

type FieldRenderer = (config: FieldConfig) => JSX.Element;

const fieldRegistry: Record<FieldConfig["type"], FieldRenderer> = {
  input: (config) => {
    const c = config as Extract<FieldConfig, { type: "input" }>;
    return (
      <RHFInput
        name={c.name}
        label={c.label}
        placeholder={c.placeholder}
        disabled={c.disabled}
        className={c.className}
        isOptional={c.isOptional}
        type={c.inputType}
        testId={c.testId}
      />
    );
  },
  select: (config) => {
    const c = config as Extract<FieldConfig, { type: "select" }>;
    return (
      <RHFSelect
        name={c.name}
        label={c.label}
        placeholder={c.placeholder}
        disabled={c.disabled}
        className={c.className}
        isOptional={c.isOptional}
        options={c.options}
      />
    );
  },
  checkbox: (config) => (
    <RHFCheckbox
      name={config.name}
      label={config.label}
      disabled={config.disabled}
      className={config.className}
    />
  ),
};

export default fieldRegistry;
