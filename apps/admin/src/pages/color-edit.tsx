import { useNavigate, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useGetColor, useUpdateColor, getListColorsQueryKey } from "@repo/api-client";
import { ColorForm } from "./color-form";
import type { ColorFormValues } from "./color.schema";

export function EditColorPage() {
  const { colorId } = useParams({ strict: false }) as { colorId: string };
  const id = Number(colorId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useGetColor(id);
  const updateColor = useUpdateColor();

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto p-6 text-sm text-muted-foreground">Loading…</div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-lg mx-auto p-6 text-sm text-gray-500">Color not found.</div>
    );
  }

  const color = data.data;
  const defaultValues: ColorFormValues = {
    name: color.name,
    description: color.description ?? "",
  };

  async function onSubmit(values: ColorFormValues) {
    try {
      await updateColor.mutateAsync({ id, data: { name: values.name, description: values.description } });
      await queryClient.invalidateQueries({ queryKey: getListColorsQueryKey() });
      toast.success("Color updated successfully");
      navigate({ to: "/data-table" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update color");
    }
  }

  return (
    <ColorForm
      title={`Edit Color: ${color.name}`}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    />
  );
}
