import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

interface BaseInputProps extends InputProps {
  leftAffix?: React.ReactNode;
  leftAffixClassName?: string;
  rightAffix?: React.ReactNode;
  rightAffixClassName?: string;
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      leftAffix,
      leftAffixClassName,
      rightAffix,
      rightAffixClassName,
      className,
      ...props
    },
    ref
  ) => {
    if (!leftAffix && !rightAffix) {
      return <Input ref={ref} className={className} {...props} />;
    }

    return (
      <div className="relative flex items-center">
        {leftAffix && (
          <div
            className={cn(
              "pointer-events-none absolute left-3 flex items-center",
              leftAffixClassName
            )}
          >
            {leftAffix}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(leftAffix && "pl-10", rightAffix && "pr-10", className)}
          {...props}
        />
        {rightAffix && (
          <div
            className={cn(
              "pointer-events-none absolute right-3 flex items-center",
              rightAffixClassName
            )}
          >
            {rightAffix}
          </div>
        )}
      </div>
    );
  }
);
BaseInput.displayName = "BaseInput";

export { BaseInput };
