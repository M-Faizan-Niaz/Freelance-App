import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useCreateColor, getListColorsQueryKey } from "@repo/api-client";
import { ColorForm } from "./color-form";
import type { ColorFormValues } from "./color.schema";

const EMPTY_COLOR: ColorFormValues = {
  name: "",
  description: "",
};

export function CreateColorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createColor = useCreateColor();

  async function onSubmit(values: ColorFormValues) {
    try {
      await createColor.mutateAsync({ data: { name: values.name, description: values.description } });
      await queryClient.invalidateQueries({ queryKey: getListColorsQueryKey() });
      toast.success("Color created successfully");
      navigate({ to: "/data-table" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create color");
    }
  }

  return (
    <ColorForm
      title="Create Color"
      defaultValues={EMPTY_COLOR}
      onSubmit={onSubmit}
    />
  );
}
