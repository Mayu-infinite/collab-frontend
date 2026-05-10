"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ChevronLeft,
  Share2,
  MoreHorizontal,
  Clock,
 FileText,
  Users,
  Circle,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { socket } from "@/lib/socket";
import {
  getDocument,
  enableCollaboration,
} from "@/services/document/service";
import { api } from "@/lib/axios";

type DocumentData = {
  id: string;
  title: string;
  content: string;
  updatedAt?: string;
  isCollaborative: boolean;
  inviteCode?: string | null;
};

type Collaborator = {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: "online" | "idle" | "offline";
};

function formatTimeAgo(dateString?: string) {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000,
  );

  if (diffInSeconds < 60) return "Just now";

  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} mins ago`;
  }

  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  }

  if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}



export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const [doc, setDoc] = useState<DocumentData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const [isCollaborating, setIsCollaborating] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const activeUsers = collaborators.filter(
    (u) =>
      u.status === "online" ||
      u.status === "idle",
  );

  const inactiveUsers = collaborators.filter(
    (u) => u.status === "offline",
  );

  const handleEnableCollaboration = async () => {
  try {
    const updatedDoc =
      await enableCollaboration(id);

    setDoc((prev) =>
      prev
        ? {
            ...prev,
            isCollaborative: true,
            inviteCode:
              updatedDoc.inviteCode,
          }
        : prev,
    );

    setIsCollaborating(true);

    setIsSidebarOpen(true);

    setDialogOpen(true);

    toast.success(
      "Collaboration enabled!",
    );
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to enable collaboration",
    );
  }
};

  const handleCopyInviteCode =
    async () => {
      if (!doc?.inviteCode) return;

      await navigator.clipboard.writeText(
        doc.inviteCode,
      );

      setCopied(true);

      toast.success(
        "Invite code copied!",
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);

        const data =
          await getDocument(id);

        setDoc(data);

        if (data.isCollaborative) {
  socket.auth = {
    token: localStorage.getItem("token"),
  };

  if (!socket.connected) {
    socket.connect();
  }

  socket.on("connect", () => {
    console.log(
      "SOCKET CONNECTED:",
      socket.id,
    );

    socket.emit(
      "join-document",
      id,
    );
  });

  socket.on(
    "disconnect",
    () => {
      console.log(
        "SOCKET DISCONNECTED",
      );
    },
  );

  setIsCollaborating(true);

  setIsSidebarOpen(true);
}
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load document",
        );

        toast.error(
          "Could not load document",
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDocument();
    }
  }, [id]);

  

useEffect(() => {
  socket.on("users-list", (users) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-indigo-500",
    ];

    const formattedUsers = users.map(
      (user: any, index: number) => ({
        id: user.userId,

        name: user.name,

        initials: user.name
          .split(" ")
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),

        color:
          colors[index % colors.length],

        status: "online",
      }),
    );

    setCollaborators(formattedUsers);
  });

  return () => {
    socket.off("users-list");
  };
}, []);

  const UserRow = ({
    user,
  }: {
    user: Collaborator;
  }) => (
    <div
      className={cn(
        "flex items-center gap-3 group px-1",
        user.status ===
          "offline" &&
          "opacity-60",
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-background relative shrink-0",
          user.color,
        )}
      >
        {user.initials}

        <span
          className={cn(
            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background",
            user.status ===
              "online"
              ? "bg-green-500"
              : user.status ===
                  "idle"
                ? "bg-amber-500"
                : "bg-gray-300",
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {user.name}
        </p>

        <p className="text-xs text-muted-foreground truncate capitalize">
          {user.status}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-dvh bg-background flex flex-col">
        <div className="flex-none flex items-center justify-between px-6 py-4 border-b">
          <Skeleton className="h-8 w-24" />

          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />

            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full rounded-xl border" />
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh space-y-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Document Not Found
          </h2>

          <p className="text-muted-foreground mt-1">
            {error ??
              "The document you are looking for does not exist."}
          </p>
        </div>

        <Button
          onClick={() =>
            router.push(
              "/dashboard",
            )
          }
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full flex flex-col bg-muted/5 overflow-hidden">
      <header className="flex-none flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur z-20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
            onClick={() =>
              router.back()
            }
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <Separator
            orientation="vertical"
            className="h-4 mx-2"
          />

          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4" />

            <span className="truncate max-w-37.5 sm:max-w-md text-foreground">
              {doc.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center text-xs text-muted-foreground mr-4 bg-muted px-2 py-1 rounded-md">
            <Clock className="h-3 w-3 mr-1.5 opacity-70" />

            <span>
              Updated{" "}
              {formatTimeAgo(
                doc.updatedAt,
              )}
            </span>
          </div>

          <Button
            variant={
              isSidebarOpen
                ? "secondary"
                : "ghost"
            }
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setIsSidebarOpen(
                !isSidebarOpen,
              )
            }
            title="Toggle Collaborators"
            disabled={
              !isCollaborating
            }
          >
            <Users className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={
              handleEnableCollaboration
            }
          >
            <Share2 className="mr-2 h-3.5 w-3.5" />
            Collaborate
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Dialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
>
  <DialogContent className="sm:max-w-md border border-white/10 bg-[#0b1120]/95 backdrop-blur-xl text-white overflow-hidden">
    
    <DialogHeader className="space-y-3">
      <DialogTitle className="text-2xl font-bold">
        You are collaborating!
      </DialogTitle>

      <DialogDescription className="text-gray-400 text-sm">
        Share this invite code with others to join this document.
      </DialogDescription>
    </DialogHeader>

    <div className="mt-2 flex flex-col gap-4 w-full overflow-hidden">
      
      <div className="w-full rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 overflow-hidden">
        
        <p className="text-sm text-gray-400 text-center mb-3">
          Invite Code
        </p>

        <div className="w-full text-center break-all">
          <span className="text-2xl font-bold tracking-wide text-cyan-300">
            {doc.inviteCode}
          </span>
        </div>
      </div>

      <Button
        className="w-full h-11 text-sm font-semibold"
        onClick={handleCopyInviteCode}
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy Invite Code
          </>
        )}
      </Button>
    </div>
  </DialogContent>
</Dialog>

      <div className="flex flex-1 min-h-0 overflow-hidden relative no-scrollbar">
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <Editor
            documentId={doc.id}
            title={doc.title}
            initialContent={
              doc.content
            }
          />
        </main>

        <aside
          className={cn(
            "w-72 bg-background border-l border-border transition-all duration-300 ease-in-out flex flex-col z-10",
            isSidebarOpen
              ? "translate-x-0"
              : "translate-x-full w-0 hidden border-none",
          )}
        >
          <div className="p-4 border-b flex-none">
            <h3 className="font-semibold text-sm">
              Collaborators
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                Active Now (
                {activeUsers.length})
              </h4>

              <div className="space-y-3">
                {activeUsers.map(
                  (user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}