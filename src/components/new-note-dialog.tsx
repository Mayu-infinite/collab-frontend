"use-client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { createDocument } from "@/services/document/service";
import { toast } from "sonner";

function NewNoteDialog({ buttonStyles }: { buttonStyles: string }) {
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleCreateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsCreating(true);

      const formData = new FormData(e.currentTarget);

      const title = formData.get("title");

      if (typeof title !== "string") {
        throw new Error("Invalid Form Input");
      }

      const res = await createDocument(title);

      toast.success("Document successfully created!");
      setOpen(false);

      router.push(`/dashboard/documents/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.message);
      console.error("Error creating document" + err);
    } finally {
      setIsCreating(false);
    }
    // setIsCreating(true);
    //
    // await sleep(3000);
    //
    // setIsCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className={buttonStyles}>
          <Plus className="h-5 w-5" />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>New Note</DialogTitle>
          <DialogDescription>
            Create a new Document to Collaborate!!
          </DialogDescription>
          <form onSubmit={handleCreateNote}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Title of the Document</Label>
                <Input id="title" name="title" />
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default NewNoteDialog;
