"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
 DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Share2, Copy, Check } from "lucide-react";

import { toast } from "sonner";

type Props = {
  documentId: string;

  inviteCode?: string | null;

  isCollaborative?: boolean;

  onEnabled?: (inviteCode: string) => void;
};

export function CollaborationDialog({
  documentId,
  inviteCode,
  isCollaborative,
  onEnabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);

  const [generatedCode, setGeneratedCode] = useState(
    inviteCode || "",
  );

  const [enabled, setEnabled] = useState(
    Boolean(isCollaborative),
  );

  const handleEnableCollaboration = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3002/documents/${documentId}/collaborate`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(
          "Failed to enable collaboration",
        );
      }

      const data = await res.json();

      setGeneratedCode(data.inviteCode);

      setEnabled(true);

      onEnabled?.(data.inviteCode);

      toast.success(
        "Collaboration enabled!",
      );
    } catch (err) {
      console.error(err);

      toast.error(
        "Could not enable collaboration",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;

    await navigator.clipboard.writeText(
      generatedCode,
    );

    setCopied(true);

    toast.success("Invite code copied!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
        >
          <Share2 className="mr-2 h-3.5 w-3.5" />

          {enabled
            ? "Collaborating"
            : "Collaborate"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Collaboration
          </DialogTitle>

          <DialogDescription>
            Enable real-time collaboration
            and invite others using an
            invite code.
          </DialogDescription>
        </DialogHeader>

        {!enabled ? (
          <div className="space-y-4 pt-4">
            <Button
              className="w-full"
              onClick={
                handleEnableCollaboration
              }
              disabled={loading}
            >
              {loading
                ? "Enabling..."
                : "Enable Collaboration"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Invite Code
              </p>

              <div className="text-2xl font-bold tracking-widest">
                {generatedCode}
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Invite Code
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}