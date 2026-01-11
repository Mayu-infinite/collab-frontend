"use client";

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
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import NewNoteDialog from "@/components/new-note-dialog";
import { getUser } from "@/services/user/service";
import { toast } from "sonner";

type Note = {
  id: string;
  title: string;
  updatedAt: string;
  previewText?: string;
};

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await api.get("/documents");
        setNotes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Could not load notes. Is the backend running?");
      }
    }

    async function fetchUser() {
      try {
        const res = await getUser();
        if (!res) {
          toast.error("User not logged in");
          router.push("/auth/login");
        }
      } catch (error: any) {
        toast.error(error.message);
        router.push("/auth/login");
      }
    }
    setLoading(true);
    fetchNotes();
    fetchUser();
    setLoading(false);
  }, []);

  // const handleCreateNote = async () => {
  //   try {
  //     setIsCreating(true);
  //     const res = await api.post("/documents", {
  //       title: "Untitled Document",
  //       content: "",
  //     });
  //     // Routing to the dynamic document path
  //     router.push(`/dashboard/documents/${res.data.id}`);
  //   } catch (err) {
  //     console.error("Failed to create note", err);
  //   } finally {
  //     setIsCreating(false);
  //   }
  // };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 text-primary bg-primary/5 px-3"
            >
              <Sparkles className="h-3 w-3 mr-1" /> 2025 Workspace
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-muted-foreground/20 text-muted-foreground px-3"
            >
              Free Tier
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
            Your Hub
          </h1>
          <p className="text-muted-foreground text-md">
            Collaborate on documents and manage AI-powered notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-dashed"
          >
            <Star className="h-4 w-4 mr-2" /> Favorites
          </Button>
          {/* <Button  */}
          {/*   onClick={handleCreateNote}  */}
          {/*   disabled={isCreating} */}
          {/*   size="lg"  */}
          {/*   className="rounded-xl shadow-lg shadow-primary/20 gap-2 px-6" */}
          {/* > */}
          {/*   <Plus className="h-5 w-5" />  */}
          {/*   {isCreating ? "Creating..." : "New Note"} */}
          {/* </Button> */}
          <NewNoteDialog buttonStyles="rounded-xl shadow-lg shadow-primary/20 gap-2 px-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList className="bg-transparent gap-1">
                <TabsTrigger
                  value="all"
                  className="rounded-lg data-[state=active]:bg-background shadow-none"
                >
                  All Notes
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="rounded-lg data-[state=active]:bg-background shadow-none"
                >
                  Recent
                </TabsTrigger>
                <TabsTrigger
                  value="shared"
                  className="rounded-lg data-[state=active]:bg-background shadow-none"
                >
                  Shared
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Find a document..."
                className="pl-10 bg-background border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-50 w-full rounded-3xl" />
              ))
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                /* Ensure this href exactly matches your folder structure */
                <Link key={note.id} href={`/dashboard/documents/${note.id}`}>
                  <Card className="group relative h-full bg-background border-border/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <FileText className="h-5 w-5" />
                        </div>
                        <Button variant={"outline"} className="opacity-0 group-hover:opacity-100">
                          <Trash className="h-5 w-5"/>
                        </Button>
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        {note.title || "Untitled"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3 w-3" />
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {note.previewText ||
                          "Ready for your collaborative input. Click to open the editor."}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-24 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                <Zap className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold italic">
                  Silence in the Hub...
                </h3>
                <p className="text-muted-foreground">
                  Create your first document to spark collaboration.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-3xl border-primary/10 bg-linear-to-br from-primary/3 to-transparent p-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary fill-primary" />
                AI Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-background rounded-2xl border border-primary/10 text-xs shadow-sm">
                <p className="font-semibold text-primary mb-1">
                  Weekly Insight
                </p>
                Your most active document is{" "}
                <span className="underline italic">"Project Alpha"</span>.
                You've spent 4 hours collaborating there.
              </div>
              <Button
                variant="secondary"
                className="w-full rounded-xl text-xs font-bold"
              >
                View AI Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none bg-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="h-4 w-4" />
                Live Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                {
                  name: "Sumanth",
                  action: "edited",
                  doc: "Frontend Setup",
                  color: "bg-orange-500",
                },
                {
                  name: "Rahul",
                  action: "commented",
                  doc: "API Docs",
                  color: "bg-green-500",
                },
              ].map((user, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div
                    className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-background`}
                  >
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs">
                      <span className="font-bold">{user.name}</span>{" "}
                      {user.action}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {user.doc}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
