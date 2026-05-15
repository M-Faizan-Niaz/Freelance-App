import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useDeleteColors, getListColorsQueryKey } from "@repo/api-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ColorDeleteModalProps {
  colorId: number | null;
  onClose: () => void;
}

export function ColorDeleteModal({ colorId, onClose }: ColorDeleteModalProps) {
  const queryClient = useQueryClient();
  const deleteColor = useDeleteColors();

  return (
    <Dialog open={colorId !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent showCloseButton={false} data-testid="color-delete-modal">
        <DialogHeader>
          <DialogTitle>Delete Color</DialogTitle>
          <DialogDescription>
            This will permanently delete the color. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose} data-testid="delete-cancel-btn">
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteColor.isPending}
            data-testid="delete-confirm-btn"
            onClick={async () => {
              try {
                await deleteColor.mutateAsync({ data: { ids: [colorId!] } });
                await queryClient.invalidateQueries({ queryKey: getListColorsQueryKey() });
                toast.success("Color deleted");
              } catch {
                toast.error("Failed to delete color");
              } finally {
                onClose();
              }
            }}
          >
            {deleteColor.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
