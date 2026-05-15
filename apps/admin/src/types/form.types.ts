import type React from "react";

type BaseField = {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

type InputField = BaseField & {
  type: 'input';
  placeholder?: string;
  isOptional?: boolean;
  inputType?: React.InputHTMLAttributes<HTMLInputElement>['type'];
};

type SelectField = BaseField & {
  type: 'select';
  options: { label: string; value: string }[];
  placeholder?: string;
  isOptional?: boolean;
};

type CheckboxField = BaseField & {
  type: 'checkbox';
};

export type FieldConfig = InputField | SelectField | CheckboxField;
