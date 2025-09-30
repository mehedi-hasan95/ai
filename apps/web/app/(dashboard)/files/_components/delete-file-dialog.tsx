"use client";

import { api } from "@workspace/backend/_generated/api";
import { PublicFile } from "@workspace/backend/private/files";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PublicFile | null;
  onDelete?: () => void;
}
export const DeleteFileDialog = ({
  file,
  onOpenChange,
  open,
  onDelete,
}: Props) => {
  const deleteFile = useMutation(api.private.files.deleteFile);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!file) {
      return;
    }
    setIsDeleting(true);

    try {
      await deleteFile({ entryId: file.id });
      onDelete?.();
      onOpenChange(false);
      toast("File delete successfully");
    } catch (error) {
      console.error(error);
      toast("Can't delete this file");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you wanna delete this file?
          </DialogDescription>
        </DialogHeader>

        {file && (
          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="font-medium">{file.name}</p>
              <p className="text-muted-foreground text-sm">
                Type: {file.type.toUpperCase()} | Size: {file.size}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting || !file}
            onClick={handleDelete}
            variant={"destructive"}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
