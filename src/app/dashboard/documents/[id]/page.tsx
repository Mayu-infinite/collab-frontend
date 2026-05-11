"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Copy,
  Check,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { socket } from "@/lib/socket";
import {
  getDocument,
  enableCollaboration,
  type DocumentResponse,
} from "@/services/document/service";

type DocumentData = DocumentResponse;

type Collaborator = {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: "online" | "idle" | "offline";
};

type ChatMessage = {
  id: string;
  documentId: string;
  userId: string;
  name: string;
  message: string;
  createdAt: string;
};

function formatTimeAgo(dateString?: string) {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

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

  // UI State for Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const [isCollaborating, setIsCollaborating] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [chatMessage, setChatMessage] = useState("");

  const activeUsers = collaborators.filter(
    (u) => u.status === "online" || u.status === "idle",
  );

  const canShare = doc?.currentUserRole === "OWNER";

  const handleEnableCollaboration = async () => {
    if (!canShare) {
      toast.error("Only the owner can manage sharing");
      return;
    }

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
            canEdit: true,
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

  const handleSendChatMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = chatMessage.trim();

    if (!message || !socket.connected) return;

    socket.emit("chat-message", {
      documentId: id,
      message,
    });
    setChatMessage("");
  };

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);

        const data =
          await getDocument(id);

        setDoc(data);
        setIsCollaborating(data.isCollaborative);

        if (data.isCollaborative) {
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
    if (!doc?.isCollaborative) {
      setCollaborators([]);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in again to collaborate");
      return;
    }

    const joinDocument = () => {
      socket.emit("join-document", id);
    };

    const handleUsersList = (
      users: Array<{ userId: string; name?: string }>,
    ) => {
      const colors = [
        "bg-blue-500",
        "bg-emerald-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-orange-500",
        "bg-indigo-500",
      ];

      const formattedUsers = users.map(
        (user, index) => {
          const name = user.name || "Collaborator";

          return {
            id: user.userId,
            name,
            initials: name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            color: colors[index % colors.length],
            status: "online" as const,
          };
        },
      );

      setCollaborators(formattedUsers);
    };

    const handleChatMessage = (message: ChatMessage) => {
      if (message.documentId !== id) return;

      setChatMessages((current) => [...current.slice(-49), message]);
    };

    const handleConnect = () => {
      console.log("SOCKET CONNECTED:", socket.id);
      joinDocument();
    };

    const handleDisconnect = () => {
      console.log("SOCKET DISCONNECTED");
      setCollaborators([]);
    };

    const handleConnectError = (error: Error) => {
      console.error("SOCKET CONNECT ERROR:", error.message);
      toast.error("Could not connect to collaboration");
    };

    const handleDocumentForbidden = () => {
      toast.error("You do not have access to this document");
      router.push("/dashboard");
    };

    socket.auth = { token };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("document-forbidden", handleDocumentForbidden);
    socket.on("users-list", handleUsersList);
    socket.on("chat-message", handleChatMessage);

    if (socket.connected) {
      joinDocument();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("document-forbidden", handleDocumentForbidden);
      socket.off("users-list", handleUsersList);
      socket.off("chat-message", handleChatMessage);
      socket.disconnect();
      setCollaborators([]);
      setChatMessages([]);
    };
  }, [doc?.isCollaborative, id]);

  const UserRow = ({
    user,
  }: {
    user: Collaborator;
  }) => (
    <div
      className={cn(
        "flex items-center gap-3 group px-1",
        user.status === "offline" && "opacity-60",
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
            user.status === "online"
              ? "bg-green-500"
              : user.status === "idle"
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
          <h2 className="text-xl font-semibold">Document Not Found</h2>
          <p className="text-muted-foreground mt-1">
            {error ?? "The document you are looking for does not exist."}
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    // 1. ROOT CONTAINER:
    // h-[100dvh] forces it to fill the viewport exactly.
    // overflow-hidden prevents the BODY from scrolling.
    <div className="h-dvh w-full flex flex-col bg-muted/5 overflow-hidden">
      {/* 2. HEADER: 
         flex-none prevents it from shrinking or being pushed off screen */}
      <header className="flex-none flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur z-20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-4 mx-2" />
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
            <span>Updated {formatTimeAgo(doc.updatedAt)}</span>
          </div>
          <Button
            variant={isSidebarOpen ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Collaborators"
            disabled={!isCollaborating}
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
            disabled={!canShare}
            title={
              canShare
                ? "Share this document"
                : "Only the owner can share this document"
            }
          >
            <Share2 className="mr-2 h-3.5 w-3.5" />
            {doc.isCollaborative ? "Invite" : "Collaborate"}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* 3. WORKSPACE (Editor + Sidebar)
         flex-1: takes all remaining height.
         overflow-hidden: cuts off any child that tries to grow too big.
         min-h-0: CRITICAL. Allows flex children to scroll. */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative no-scrollbar">
        {/* Main Editor: Scrolls independently */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <Editor
            documentId={doc.id}
            title={doc.title}
            initialContent={
              doc.content
            }
            canEdit={doc.canEdit ?? false}
          />
        </main>

        {/* 4. SIDEBAR 
           h-full: Matches parent height exactly.
           flex-col: Allows header/list/footer structure. */}
        <aside
          className={cn(
            "w-72 bg-background border-l border-border transition-all duration-300 ease-in-out flex flex-col z-10",
            isSidebarOpen
              ? "translate-x-0"
              : "translate-x-full w-0 hidden border-none",
          )}
        >
          {/* Sidebar Header: Fixed height */}
          <div className="p-4 border-b flex-none">
            <h3 className="font-semibold text-sm">
              Collaborators
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Your role: {doc.currentUserRole ?? "VIEWER"}
            </p>
          </div>

          {/* User List: Growable and scrollable 
             min-h-0 prevents list from forcing sidebar to grow */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active Now ({activeUsers.length})
              </h4>
              <div className="space-y-3">
                {activeUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </div>
            </div>

            {doc.members && doc.members.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  Access
                </h4>

                <div className="space-y-3">
                  {doc.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 px-1"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {member.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doc.isCollaborative && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat
                </h4>

                <div className="mb-3 max-h-56 space-y-2 overflow-y-auto rounded-md border bg-muted/20 p-2">
                  {chatMessages.length > 0 ? (
                    chatMessages.map((message) => (
                      <div key={message.id} className="rounded-md bg-background p-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-semibold">
                            {message.name}
                          </p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 wrap-break-words text-xs text-muted-foreground">
                          {message.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      No messages yet.
                    </p>
                  )}
                </div>

                <form className="flex gap-2" onSubmit={handleSendChatMessage}>
                  <Input
                    value={chatMessage}
                    onChange={(event) => setChatMessage(event.target.value)}
                    placeholder="Message collaborators"
                    className="h-8 text-xs"
                    maxLength={1000}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    disabled={!chatMessage.trim() || !socket.connected}
                    title="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
