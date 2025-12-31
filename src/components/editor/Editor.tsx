"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { api } from "@/lib/axios";
import { Toolbar } from "./Toolbar";
import { toast } from "sonner";

interface EditorProps {
  documentId: string;
  initialContent?: string;
  title?: string;
}

export function Editor({ documentId, initialContent, title }: EditorProps) {
  // 🔥 THIS STATE EXISTS ONLY TO FORCE RE-RENDER
  const [, forceUpdate] = useState(0);

  // Optional feature states
  const [isAIActive, setIsAIActive] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Autosave (debounced)
  const saveContent = useCallback(
    debounce(async (htmlContent: string) => {
      try {
        await api.put(`/documents/${documentId}`, { content: htmlContent });
      } catch (err: any) {
        console.error("Save failed", err);
        toast.error(err.message);
      }
    }, 1500),
    [documentId],
  );

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({
        placeholder: "Write something brilliant or press '/' for commands...",
      }),
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        spellcheck: "false",
        class: [
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl",
          "mx-auto focus:outline-none",
          "min-h-[80vh] p-16 bg-background",
          "shadow-2xl border-x border-b rounded-b-xl transition-all",

          // 🔥 REQUIRED FOR HEADINGS
          "[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:mt-6 [&_h1]:mb-4",
          "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-4",

          // Lists
          "[&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:list-decimal [&_ol]:pl-6",
        ].join(" "),
      },
    },

    // 🔥 FORCE RE-RENDER WHEN SELECTION CHANGES
    onSelectionUpdate: () => {
      forceUpdate((n) => n + 1);
    },

    // 🔥 FORCE RE-RENDER ON EVERY TRANSACTION
    onTransaction: () => {
      forceUpdate((n) => n + 1);
    },

    // Autosave on content change
    onUpdate: ({ editor }) => {
      saveContent(editor.getHTML());
    },
  });

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      saveContent.cancel();
    };
  }, [saveContent]);

  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Title */}
      <div className="mb-8 pl-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">
          {title || "Untitled Document"}
        </h1>
      </div>

      {/* Editor Container */}
      <div className="relative shadow-2xl rounded-xl border">
        <Toolbar
          editor={editor}
          isAIActive={isAIActive}
          onToggleAI={() => setIsAIActive((v) => !v)}
          isVoiceActive={isVoiceActive}
          onToggleVoice={() => setIsVoiceActive((v) => !v)}
        />
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-muted-foreground text-[10px] uppercase font-bold tracking-widest px-2">
        <span>CollabHub v1.0</span>
        <span>Auto-saving enabled</span>
      </div>
    </div>
  );
}
