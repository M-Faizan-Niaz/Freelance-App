import type { FieldConfig } from "@/types/form.types";

export const colorFields: FieldConfig[] = [
  {
    type: "input",
    name: "name",
    label: "Name",
    placeholder: "Enter color name",
    testId: "color-name-input",
  },
  {
    type: "input",
    name: "description",
    label: "Description",
    placeholder: "Enter color description",
    testId: "color-description-input",
  },
];
