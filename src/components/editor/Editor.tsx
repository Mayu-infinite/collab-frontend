"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useCallback } from "react";
import { debounce } from "lodash";
import { api } from "@/lib/axios";
import { Toolbar } from "./Toolbar";

interface EditorProps {
  documentId: string;
  initialContent?: string;
  title?: string;
}

export function Editor({ documentId, initialContent, title }: EditorProps) {
  const saveContent = useCallback(
    debounce(async (htmlContent: string) => {
      try {
        await api.put(`/documents/${documentId}`, { content: htmlContent });
      } catch (err) {
        console.error("Save failed", err);
      }
    }, 1500),
    [documentId]
  );

  const editor = useEditor({
    extensions: [
      // Minimal change: Configured StarterKit to ensure headings and lists work
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        bulletList: {
          keepAttributes: true,
          keepMarks: true,
        },
        orderedList: {
          keepAttributes: true,
          keepMarks: true,
        },
      }),
      Placeholder.configure({
        placeholder: "Write something brilliant or press '/' for commands...",
      }),
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: initialContent || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      saveContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Tailwind 'prose' needs these extra classes for lists to show
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[80vh] p-16 bg-background shadow-2xl border-x border-b rounded-b-xl transition-all",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 pl-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">
          {title || "Untitled Document"}
        </h1>
      </div>
      
      <div className="relative group shadow-2xl rounded-xl border">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <div className="mt-4 flex items-center justify-between text-muted-foreground text-[10px] uppercase font-bold tracking-widest px-2">
        <span>CollabHub v1.0</span>
        <span>Auto-saving enabled</span>
      </div>
    </div>
  );
}