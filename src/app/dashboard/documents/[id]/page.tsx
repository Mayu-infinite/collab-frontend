"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { Editor } from "@/components/editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

type DocumentData = {
  id: string;
  title: string;
  content: string;
};

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);
        const res = await api.get(`/documents/${id}`);
        setDoc(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDocument();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex items-center gap-2 text-destructive p-6">
        <AlertCircle className="h-5 w-5" />
        {error ?? "Document not found"}
      </div>
    );
  }

  return (
    <Editor
      documentId={doc.id}
      title={doc.title}
      initialContent={doc.content}
    />
  );
}
