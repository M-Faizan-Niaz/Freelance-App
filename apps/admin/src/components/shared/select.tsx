import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Option<T> = {
  label: string;
  value: T;
};

export type OptionGroup<T> = {
  label: string;
  options: Option<T>[];
};

function isGrouped<T>(
  options: Option<T>[] | OptionGroup<T>[]
): options is OptionGroup<T>[] {
  return options.length > 0 && "options" in options[0];
}

interface BaseSelectProps<T extends string | number> {
  value?: T;
  options: Option<T>[] | OptionGroup<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  onChange: (value: T) => void;
}

export function BaseSelect<T extends string | number>({
  value,
  options,
  placeholder,
  disabled,
  className,
  loading,
  invalid,
  onChange,
}: BaseSelectProps<T>) {
  const firstValue = isGrouped(options)
    ? options[0]?.options[0]?.value
    : options[0]?.value;
  const isNumeric = typeof firstValue === "number";

  function handleChange(val: string) {
    onChange((isNumeric ? Number(val) : val) as T);
  }

  return (
    <Select
      value={value != null && value !== "" ? String(value) : undefined}
      onValueChange={handleChange}
      disabled={disabled || loading}
    >
      <SelectTrigger
        className={cn("w-full", className)}
        aria-invalid={invalid || undefined}
      >
        <SelectValue placeholder={placeholder ?? "Select…"} />
      </SelectTrigger>
      <SelectContent>
        {isGrouped(options)
          ? options.map((group) => (
              <SelectGroup key={group.label}>
                <span className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                  {group.label}
                </span>
                {group.options.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          : options.map((opt) => (
              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
}
