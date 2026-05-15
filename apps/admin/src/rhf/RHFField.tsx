import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

interface RHFFieldProps {
  name: string;
  label?: string;
  children: (field: ControllerRenderProps<FieldValues, string>) => React.ReactNode;
  isOptional?: boolean;
  labelClass?: string;
  parentClass?: string;
}

const RHFField = ({
  name,
  label,
  children,
  isOptional,
  labelClass,
  parentClass
}: RHFFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={parentClass}> 
          {label && (
            <FormLabel className={labelClass}>
              {label}{" "}
              {isOptional && (
                <span className="text-muted-foreground text-xs">(optional)</span>
              )}
            </FormLabel>
          )}

          <FormControl className="mt-auto">{children(field)}</FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFField;