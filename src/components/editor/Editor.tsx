"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useCallback, useState } from "react";
import { api } from "@/lib/axios";
import { Toolbar } from "./Toolbar";
import { toast } from "sonner";
import { debounce } from "lodash";

interface EditorProps {
  documentId: string;
  initialContent?: string;
  title?: string;
}

export function Editor({ documentId, initialContent, title }: EditorProps) {
  const [, forceUpdate] = useState(0);

  const [isAIActive, setIsAIActive] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "Error">(
    "Saved",
  );

  const debouncedSave = useCallback(
    debounce(async (html: string) => {
      setSaveStatus("Saving...");
      try {
        await api.put(`/documents/${documentId}`, { content: html });
        setSaveStatus("Saved");
      } catch (err) {
        console.error(err);
        setSaveStatus("Error");
        toast.error("Failed to save changes");
      }
    }, 1500),
    [documentId],
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      // Table Configuration
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: [
          // Base Typography
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none mx-auto",
          "min-h-[80vh] p-10 bg-background rounded-b-xl shadow-sm border",

          // Color & Theme Overrides
          "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground",
          "prose-li:marker:text-muted-foreground",
          "prose-img:rounded-lg prose-img:border prose-img:shadow-sm",

          // 2. EXPLICIT HEADING STYLES
          "[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:mb-4",
          "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4",
          "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-4",

          // 4. FIX LIST STYLES (Bulleted & Numbered)
          "[&_ul:not([data-type=taskList])]:list-disc [&_ul:not([data-type=taskList])]:pl-5 [&_ul:not([data-type=taskList])]:mb-4",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4",
          "[&_li]:my-1",

          // 5. FIX TABLE STYLES
          // Force tables to have borders, collapse, and width
          "[&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border [&_table]:my-4",
          // Style Header Cells (th)
          "[&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted [&_th]:font-bold [&_th]:text-left",
          // Style Standard Cells (td) - Add min-width to prevent squishing
          "[&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:min-w-[100px] [&_td]:relative",
          // Fix selection highlight for Tiptap Cell Selection
          "[&_.selectedCell]:bg-primary/10",
        ].join(" "),
      },
    },
    onSelectionUpdate: () => {
      forceUpdate((n) => n + 1);
    },
    onTransaction: () => {
      forceUpdate((n) => n + 1);
    },
    onUpdate: ({ editor }) => {
      forceUpdate((n) => n + 1);
      debouncedSave(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-10">
      <div className="mb-6 pl-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title || "Untitled Document"}
        </h1>
      </div>
      <div className="relative rounded-xl border bg-background shadow-md overflow-hidden">
        <Toolbar
          editor={editor}
          isAIActive={isAIActive}
          onToggleAI={() => setIsAIActive(!isAIActive)}
          isVoiceActive={isVoiceActive}
          onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
        />
        <EditorContent editor={editor} />
      </div>
      <div className="mt-4 flex items-center justify-between px-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
        <span>CollabHub v2.0</span>
        <span className={saveStatus === "Error" ? "text-red-500" : ""}>
          {saveStatus}
        </span>
      </div>
    </div>
  );
}
