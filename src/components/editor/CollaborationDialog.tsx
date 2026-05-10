"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CollaborationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string;
}

export default function CollaborationDialog({
  open,
  onOpenChange,
  inviteCode,
}: CollaborationDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border border-white/10 bg-[#0b1120]/95 backdrop-blur-xl text-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">
            You are collaborating!
          </DialogTitle>

          <DialogDescription className="text-gray-400 text-sm">
            Share this invite code with others to join this document.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <p className="text-sm text-gray-400 mb-3 text-center">
              Invite Code
            </p>

            <div className="break-all text-center text-3xl font-bold tracking-wide text-cyan-300">
              {inviteCode}
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full h-12 text-base font-semibold"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Copy Invite Code
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}