import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteDialog({ open, onCancel, onConfirm, loading }: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onCancel()}>
      <DialogContent showCloseButton className="z-[9999]">
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn xóa?</DialogTitle>
          <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
        </DialogHeader>
        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button disabled={loading} variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>
            Xác nhận xóa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
