import type { Product } from '@/entities/product/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: (id: number) => Promise<void>;
}

export function DeleteProductModal({
  open,
  onOpenChange,
  product,
  onConfirm,
}: DeleteProductModalProps) {
  const handleConfirm = async () => {
    if (!product) return;
    await onConfirm(product.id);
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Are you sure you want to delete &quot;{product.title}&quot;? This action cannot be
          undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
