"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Editor } from "@/components/editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DocumentData = {
  id: string;
  title: string;
  content: string;
  updatedAt?: string;
};

type Collaborator = {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: "online" | "idle" | "offline";
};

// --- MOCK DATA ---
const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: "1",
    name: "You",
    initials: "ME",
    color: "bg-blue-500",
    status: "online",
  },
  {
    id: "2",
    name: "Alice Chen",
    initials: "AC",
    color: "bg-emerald-500",
    status: "online",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    initials: "MJ",
    color: "bg-amber-500",
    status: "idle",
  },
  {
    id: "4",
    name: "Sarah Williams",
    initials: "SW",
    color: "bg-purple-500",
    status: "offline",
  },
  {
    id: "5",
    name: "David Kim",
    initials: "DK",
    color: "bg-pink-500",
    status: "offline",
  },
  {
    id: "6",
    name: "Elena Rodriguez",
    initials: "ER",
    color: "bg-red-500",
    status: "offline",
  },
  {
    id: "7",
    name: "Tom Baker",
    initials: "TB",
    color: "bg-indigo-500",
    status: "offline",
  },
  {
    id: "8",
    name: "Chris Pbacon",
    initials: "CP",
    color: "bg-orange-500",
    status: "offline",
  },
  {
    id: "9",
    name: "Another User",
    initials: "AU",
    color: "bg-teal-500",
    status: "offline",
  },
];

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

  const activeUsers = MOCK_COLLABORATORS.filter(
    (u) => u.status === "online" || u.status === "idle",
  );
  const inactiveUsers = MOCK_COLLABORATORS.filter(
    (u) => u.status === "offline",
  );

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);
        const res = await api.get(`/documents/${id}`);
        setDoc(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load document");
        toast.error("Could not load document");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDocument();
  }, [id]);

  // --- HELPER COMPONENT FOR USER ROWS ---
  const UserRow = ({ user }: { user: Collaborator }) => (
    <div
      className={cn(
        "flex items-center gap-3 group px-1",
        user.status === "offline" && "opacity-60",
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-background relative flex-shrink-0",
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
      <div className="h-[100dvh] bg-background flex flex-col">
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
      <div className="flex flex-col items-center justify-center h-[100dvh] space-y-4 text-center">
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
    <div className="h-[100dvh] w-full flex flex-col bg-muted/5 overflow-hidden">
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
            <span className="truncate max-w-[150px] sm:max-w-md text-foreground">
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
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Share2 className="mr-2 h-3.5 w-3.5" />
            Share
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
            initialContent={doc.content}
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
            <h3 className="font-semibold text-sm">Collaborators</h3>
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

            {activeUsers.length > 0 && inactiveUsers.length > 0 && (
              <Separator className="my-4" />
            )}

            {inactiveUsers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-muted-foreground text-muted-foreground" />
                  Away ({inactiveUsers.length})
                </h4>
                <div className="space-y-3">
                  {inactiveUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer: Fixed at Bottom
             pb-8: Safety padding for bottom screen edge */}
          <div className="p-4 pb-8 border-t bg-muted/10 flex-none">
            <div className="rounded-lg bg-background border shadow-sm p-3 text-xs text-muted-foreground text-center">
              <p>Invite others to collaborate in real-time.</p>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary mt-1 font-semibold"
              >
                Copy Invite Link
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
