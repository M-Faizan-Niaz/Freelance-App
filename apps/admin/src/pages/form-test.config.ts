import { FieldConfig } from "@/types/form.types";

export const registrationFields: FieldConfig[] = [
  {
    type: "input",
    name: "firstName",
    label: "First Name",
    placeholder: "Enter your first name",
  },
  {
    type: "input",
    name: "middleName",
    label: "Middle Name",
    placeholder: "Enter your middle name",
    isOptional: true,
  },
  {
    type: "input",
    name: "lastName",
    label: "Last Name",
    placeholder: "Enter your last name",
  },
  {
    type: "checkbox",
    name: "agreeToTerms",
    label: "I agree to the terms and conditions",
  },
];
