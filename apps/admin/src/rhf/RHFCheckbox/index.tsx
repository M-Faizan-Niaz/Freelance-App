import RHFField from "../RHFField";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext, useFormState, get } from "react-hook-form";

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClass?: string;
  parentClass?: string;
  onChange?: (checked: boolean) => void;
}

const RHFCheckbox = ({
  name,
  label,
  disabled,
  className,
  labelClass,
  parentClass,
  onChange,
}: Props) => {
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const fieldError = get(errors, name)?.message as string | undefined;

  return (
    <RHFField
      name={name}
      labelClass={labelClass}
      label={label}
      parentClass={parentClass}
    >
      {(field) => (
        <Checkbox
          {...field}
          checked={field.value ?? false}
          disabled={disabled}
          className={className}
          onCheckedChange={(val) => {
            field.onChange(val);
            onChange?.(val as boolean);
          }}
        />
      )}
    </RHFField>
  );
};

export default RHFCheckbox;
