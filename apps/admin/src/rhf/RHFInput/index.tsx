import RHFField from "../RHFField";
import { BaseInput } from "@/components/shared/input";
interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isOptional?: boolean;
  labelClass?:string,
  onChange?: (value: string) => void;
  parentClass?:string;
  type?: React.HTMLInputTypeAttribute;
  leftAffix?: React.ReactNode;
  leftAffixClassName?: string;
  rightAffix?: React.ReactNode;
  rightAffixClassName?: string;
  testId?: string;
}
const RHFInput = ({
  name,
  label,
  placeholder,
  labelClass,
  disabled,
  className,
  isOptional,
  parentClass,
  onChange,
  type = "text",
  leftAffix,
  leftAffixClassName,
  rightAffix,
  rightAffixClassName,
  testId,
}: Props) => {
  return (
    <RHFField name={name} labelClass={labelClass} label={label} isOptional={isOptional} parentClass={parentClass}>
      {(field) => (
        <BaseInput
          {...field}
          type={type}
          value={field.value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          leftAffix={leftAffix}
          leftAffixClassName={leftAffixClassName}
          rightAffix={rightAffix}
          rightAffixClassName={rightAffixClassName}
          data-testid={testId}
          onChange={(e) => {
            field.onChange(e.target.value);
            onChange?.(e.target.value);
          }}
        />
      )}
    </RHFField>
  );
};

export default RHFInput;