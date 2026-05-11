"use client";

<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  FileText,
  Clock,
  AlertCircle,
  Sparkles,
  Zap,
  History,
  MousePointer2,
  Star,
  Delete,
  Trash2,
  Trash,
} from "lucide-react";
=======
import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
>>>>>>> Stashed changes
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  FileText,
  Inbox,
  Lock,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import NewNoteDialog from "@/components/new-note-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/axios";
import {
  deleteDocument,
  joinCollaboration,
  type DocumentResponse,
  type DocumentRole,
} from "@/services/document/service";
import { getUser } from "@/services/user/service";

type DashboardUser = {
  id: string;
  name: string;
  email: string;
};

type DashboardTab = "all" | "owned" | "shared" | "recent";

function formatDate(dateString?: string) {
  if (!dateString) return "Never";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function roleVariant(role?: DocumentRole) {
  if (role === "OWNER") return "default";
  if (role === "EDITOR") return "secondary";
  return "outline";
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [notes, setNotes] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
<<<<<<< Updated upstream

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

=======
  const [inviteCode, setInviteCode] = useState("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("all");

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [userResponse, documentsResponse] = await Promise.all([
        getUser(),
        api.get<DocumentResponse[]>("/documents"),
      ]);

      setUser(userResponse as unknown as DashboardUser);
      setNotes(Array.isArray(documentsResponse.data) ? documentsResponse.data : []);
    } catch {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

>>>>>>> Stashed changes
  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleJoinCollaboration = async () => {
    if (!inviteCode.trim()) {
      toast.error("Enter invite code");
      return;
    }

    try {
      const joined = await joinCollaboration(inviteCode.trim());

      toast.success(`Joined ${joined.title}`);
      setInviteCode("");

      const res = await api.get<DocumentResponse[]>("/documents");
      setNotes(Array.isArray(res.data) ? res.data : []);
      setActiveTab("shared");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteDocument = async (
    event: MouseEvent<HTMLButtonElement>,
    note: DocumentResponse,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!note.canDelete) {
      toast.error("Only the owner can delete this document");
      return;
    }

    const confirmed = window.confirm(`Delete "${note.title || "Untitled"}"?`);

    if (!confirmed) return;

    try {
      setDeletingId(note.id);
      await deleteDocument(note.id);
      setNotes((current) => current.filter((item) => item.id !== note.id));
      toast.success("Document deleted");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedNotes = useMemo(
    () =>
      [...notes].sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime(),
      ),
    [notes],
  );

  const tabbedNotes = useMemo(() => {
    if (activeTab === "owned") {
      return sortedNotes.filter((note) => note.currentUserRole === "OWNER");
    }

    if (activeTab === "shared") {
      return sortedNotes.filter((note) => note.currentUserRole !== "OWNER");
    }

    if (activeTab === "recent") {
      return sortedNotes.slice(0, 8);
    }

    return sortedNotes;
  }, [activeTab, sortedNotes]);

  const filteredNotes = tabbedNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const ownedCount = notes.filter((note) => note.currentUserRole === "OWNER").length;
  const sharedCount = notes.length - ownedCount;
  const editableCount = notes.filter((note) => note.canEdit).length;
  const recentActivity = sortedNotes.slice(0, 5);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Inbox className="h-4 w-4" />
            <span>{user ? `${user.name}'s workspace` : "Workspace"}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Notes Dashboard</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage meeting notes, shared writing spaces, and private documents from one place.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <NewNoteDialog buttonStyles="gap-2" />
          <Button variant="outline" className="gap-2" onClick={() => setActiveTab("shared")}>
            <Users className="h-4 w-4" />
            Shared
          </Button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardDescription>All notes</CardDescription>
            <CardTitle className="text-2xl">{notes.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardDescription>Owned by you</CardDescription>
            <CardTitle className="text-2xl">{ownedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardDescription>Shared with you</CardDescription>
            <CardTitle className="text-2xl">{sharedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardDescription>Editable</CardDescription>
            <CardTitle className="text-2xl">{editableCount}</CardTitle>
          </CardHeader>
        </Card>
      </section>

<<<<<<< Updated upstream
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Find a document..."
                className="pl-10 bg-background border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
=======
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <main className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border bg-background p-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DashboardTab)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="owned">Owned</TabsTrigger>
                  <TabsTrigger value="shared">Shared</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search notes"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <Input
                  placeholder="Invite code"
                  value={inviteCode}
                  onChange={(event) => setInviteCode(event.target.value)}
                />
                <Button onClick={handleJoinCollaboration}>Join</Button>
              </div>
>>>>>>> Stashed changes
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-44 rounded-lg" />
              ))
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <Link key={note.id} href={`/dashboard/documents/${note.id}`}>
                  <Card className="group h-full rounded-lg transition hover:border-primary/50 hover:shadow-md">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="truncate text-base">
                              {note.title || "Untitled"}
                            </CardTitle>
                            <CardDescription className="truncate">
                              Owner: {note.owner?.name ?? "Unknown"}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={roleVariant(note.currentUserRole)}>
                            {note.currentUserRole ?? "VIEWER"}
                          </Badge>
                          {note.canDelete && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground opacity-100 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                              disabled={deletingId === note.id}
                              onClick={(event) => handleDeleteDocument(event, note)}
                              title="Delete document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                        {note.previewText ||
                          "No text yet. Open the document and start writing with your team."}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(note.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {note.memberCount ?? 1}
                        </span>
                        <span className="flex items-center gap-1">
                          {note.canEdit ? (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          ) : (
                            <Lock className="h-3.5 w-3.5" />
                          )}
                          {note.canEdit ? "Can edit" : "Read only"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-dashed bg-muted/20 py-16 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <h3 className="font-semibold">No notes here yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a note or join one with an invite code.
                </p>
                <div className="mt-4 flex justify-center">
                  <NewNoteDialog buttonStyles="gap-2" />
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className="space-y-4">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest notes touched by your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((note) => (
                  <Link
                    key={note.id}
                    href={`/dashboard/documents/${note.id}`}
                    className="block rounded-md border p-3 transition hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium">
                        {note.title || "Untitled"}
                      </p>
                      <Badge variant="outline">{note.currentUserRole}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {formatDate(note.updatedAt)}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Activity will appear here.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Collaboration
              </CardTitle>
              <CardDescription>Use invite codes to add people into a shared note.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border bg-muted/20 p-3 text-sm">
                <p className="font-medium">Access rules</p>
                <p className="mt-1 text-muted-foreground">
                  Owners can delete and manage sharing. Editors can write. Viewers can read.
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={() => setActiveTab("shared")}>
                <Users className="h-4 w-4" />
                View shared notes
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
