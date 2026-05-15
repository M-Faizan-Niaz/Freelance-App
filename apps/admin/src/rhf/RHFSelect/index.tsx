import RHFField from "../RHFField";
import { BaseSelect } from "@/components/shared/select";
import { useFormContext, useFormState, get } from "react-hook-form";

export type Option<T> = {
  label: string;
  value: T;
};

export type OptionGroup<T> = {
  label: string;
  options: Option<T>[];
};

export type Props<T> = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isOptional?: boolean;
  options: Option<T>[] | OptionGroup<T>[];
  loading?: boolean;
  labelClass?: string;
  searchable?: boolean;
  onChange?: (value: T) => void;
}

const RHFSelect = <T extends number | string>({
  name,
  label,
  placeholder,
  disabled,
  className,
  isOptional,
  options,
  loading,
  onChange,
  labelClass,
  searchable,

}: Props<T>) => {
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const fieldError = get(errors, name)?.message as string | undefined;

  return (
    <RHFField name={name} label={label} labelClass={labelClass} isOptional={isOptional}>
      {(field) => (
        <BaseSelect<T>
          searchable={searchable}
          value={field.value}
          options={options}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          loading={loading}
          invalid={!!fieldError}
          onChange={(val: T) => {
            field.onChange(val);
            onChange?.(val);
          }}
        />
      )}
    </RHFField>
  );
};

export default RHFSelect;
