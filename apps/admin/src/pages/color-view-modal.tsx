import { type ListColors200DataItem } from "@repo/api-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface ColorViewModalProps {
  color: ListColors200DataItem | null;
  onClose: () => void;
}

export function ColorViewModal({ color, onClose }: ColorViewModalProps) {
  return (
    <Dialog open={color !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent data-testid="color-view-modal">
        <DialogHeader>
          <DialogTitle>Color Details</DialogTitle>
        </DialogHeader>
        {color && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm pt-2">
            {(
              [
                ["ID",          `#${String(color.id).padStart(4, "0")}`, undefined],
                ["Name",        color.name,                              "view-modal-name-value"],
                ["Description", color.description ?? "—",               "view-modal-description-value"],
                ["Created",     formatDate(color.createdAt),             undefined],
                ["Updated",     formatDate(color.updatedAt),             undefined],
              ] as [string, string, string | undefined][]
            ).map(([label, value, tid]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  {label}
                </p>
                <p className="font-medium" {...(tid ? { 'data-testid': tid } : {})}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
