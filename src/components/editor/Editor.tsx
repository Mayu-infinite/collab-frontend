"use client";

import {
  useEditor,
  EditorContent,
  type Editor as TiptapEditor,
} from "@tiptap/react";
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
import { mergeAttributes, Node as TiptapNode } from "@tiptap/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/axios";
import { socket } from "@/lib/socket";
import { Toolbar } from "./Toolbar";
import { toast } from "sonner";
import { debounce, throttle } from "lodash";
import type { EditorView } from "@tiptap/pm/view";
import { Button } from "@/components/ui/button";
import { Columns3, Rows3, Trash2 } from "lucide-react";

interface EditorProps {
  documentId: string;
  initialContent?: string;
  title?: string;
  canEdit?: boolean;
}

type RemoteCursor = {
  documentId: string;
  userId: string;
  name: string;
  from: number;
  to: number;
  color: string;
  updatedAt: number;
};

const Embed = TiptapNode.create({
  name: "embed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
      src: {
        default: null,
      },
      title: {
        default: "Embedded content",
      },
      kind: {
        default: "link",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const isIframe = HTMLAttributes.kind === "iframe";

    if (isIframe) {
      return [
        "div",
        mergeAttributes(HTMLAttributes, {
          "data-type": "embed",
          class: "collab-embed",
        }),
        [
          "iframe",
          {
            src: HTMLAttributes.src,
            title: HTMLAttributes.title,
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "true",
          },
        ],
      ];
    }

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "embed",
        class: "collab-embed collab-embed-link",
      }),
      [
        "a",
        {
          href: HTMLAttributes.url,
          target: "_blank",
          rel: "noreferrer",
        },
        HTMLAttributes.title,
      ],
    ];
  },
});

const cursorColors = [
  "#2563eb",
  "#059669",
  "#9333ea",
  "#db2777",
  "#ea580c",
  "#4f46e5",
];

function getCursorColor(userId: string) {
  const hash = userId
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return cursorColors[hash % cursorColors.length];
}

function insertImageFile(view: EditorView, file: File, position?: number) {
  if (!file.type.startsWith("image/")) return false;

  const imageType = view.state.schema.nodes.image;

  if (!imageType) return false;

  const reader = new FileReader();

  reader.onload = () => {
    const src = reader.result;

    if (typeof src !== "string") return;

    const imageNode = imageType.create({
      src,
      alt: file.name,
    });
    const transaction =
      typeof position === "number"
        ? view.state.tr.insert(position, imageNode)
        : view.state.tr.replaceSelectionWith(imageNode);

    view.dispatch(transaction.scrollIntoView());
  };

  reader.readAsDataURL(file);
  return true;
}

export function Editor({
  documentId,
  initialContent,
  title,
  canEdit = true,
}: EditorProps) {
  const [, forceUpdate] = useState(0);
  const editorShellRef = useRef<HTMLDivElement>(null);

  const [isAIActive, setIsAIActive] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);
  const [saveStatus, setSaveStatus] = useState<
    "Saved" | "Saving..." | "Error" | "Read-only"
  >(canEdit ? "Saved" : "Read-only");

  const debouncedSave = useCallback(
    debounce(async (html: string) => {
      if (!canEdit) return;

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
    [canEdit, documentId],
  );

  const emitDocumentContent = useMemo(
    () =>
      throttle((content: string) => {
        if (!canEdit || !socket.connected) return;

        socket.emit("document-content", {
          documentId,
          content,
        });
      }, 120),
    [canEdit, documentId],
  );

  const emitCursorPosition = useMemo(
    () =>
      throttle((activeEditor: TiptapEditor) => {
        if (!socket.connected) return;

        const { from, to } = activeEditor.state.selection;

        socket.emit("cursor-position", {
          documentId,
          from,
          to,
        });
      }, 80),
    [documentId],
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: canEdit,
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
      Embed,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      // Table Configuration
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "collab-table",
        },
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
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none mx-auto",
          "min-h-[80vh] p-10 bg-background rounded-b-xl shadow-sm border",

          // Color & Theme Overrides
          "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground",
          "prose-li:marker:text-muted-foreground",
          "prose-img:rounded-lg prose-img:border prose-img:shadow-sm prose-img:my-4",

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
          "[&_table]:border-collapse [&_table]:border [&_table]:border-border [&_table]:my-4",
          // Style Header Cells (th)
          "[&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted [&_th]:font-bold [&_th]:text-left",
          // Style Standard Cells (td) - Add min-width to prevent squishing
          "[&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:min-w-[100px] [&_td]:relative",
          // Fix selection highlight for Tiptap Cell Selection
          "[&_.selectedCell]:bg-primary/10",
        ].join(" "),
      },
      handlePaste: (view, event) => {
        const imageFile = Array.from(event.clipboardData?.files ?? []).find(
          (file) => file.type.startsWith("image/"),
        );

        if (!imageFile) return false;

        event.preventDefault();
        return insertImageFile(view, imageFile);
      },
      handleDrop: (view, event) => {
        const imageFile = Array.from(event.dataTransfer?.files ?? []).find(
          (file) => file.type.startsWith("image/"),
        );

        if (!imageFile) return false;

        event.preventDefault();

        const position = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        return insertImageFile(view, imageFile, position?.pos);
      },
    },
    onSelectionUpdate: ({ editor }) => {
      forceUpdate((n) => n + 1);
      emitCursorPosition(editor);
    },
    onTransaction: () => {
      forceUpdate((n) => n + 1);
    },
    onUpdate: ({ editor }) => {
      forceUpdate((n) => n + 1);
      emitCursorPosition(editor);
      const html = editor.getHTML();

      emitDocumentContent(html);
      debouncedSave(html);
    },
  });

  useEffect(() => {
    return () => {
      emitCursorPosition.cancel();
      emitDocumentContent.cancel();
    };
  }, [emitCursorPosition, emitDocumentContent]);

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(canEdit);
    setSaveStatus(canEdit ? "Saved" : "Read-only");
  }, [canEdit, editor]);

  useEffect(() => {
    if (!editor) return;

    const handleCursorPosition = (
      cursor: Omit<RemoteCursor, "color" | "updatedAt">,
    ) => {
      if (cursor.documentId !== documentId) return;

      setRemoteCursors((current) => {
        const nextCursor = {
          ...cursor,
          color: getCursorColor(cursor.userId),
          updatedAt: Date.now(),
        };

        const existingIndex = current.findIndex(
          (item) => item.userId === cursor.userId,
        );

        if (existingIndex === -1) {
          return [...current, nextCursor];
        }

        return current.map((item, index) =>
          index === existingIndex ? nextCursor : item,
        );
      });
    };

    const handleCursorClear = (
      payload: { documentId: string; userId: string },
    ) => {
      if (payload.documentId !== documentId) return;

      setRemoteCursors((current) =>
        current.filter((cursor) => cursor.userId !== payload.userId),
      );
    };

    const handleDocumentContent = (payload: {
      documentId: string;
      content: string;
    }) => {
      if (payload.documentId !== documentId) return;

      editor.commands.setContent(payload.content, {
        emitUpdate: false,
      });
      setSaveStatus("Saved");
    };

    const handleReadonly = (payload: { documentId: string }) => {
      if (payload.documentId !== documentId) return;

      toast.error("You only have read access to this document");
    };

    const pruneInactiveCursors = window.setInterval(() => {
      const cutoff = Date.now() - 30000;

      setRemoteCursors((current) =>
        current.filter((cursor) => cursor.updatedAt > cutoff),
      );
    }, 10000);

    socket.on("cursor-position", handleCursorPosition);
    socket.on("cursor-clear", handleCursorClear);
    socket.on("document-content", handleDocumentContent);
    socket.on("document-readonly", handleReadonly);

    return () => {
      window.clearInterval(pruneInactiveCursors);
      socket.off("cursor-position", handleCursorPosition);
      socket.off("cursor-clear", handleCursorClear);
      socket.off("document-content", handleDocumentContent);
      socket.off("document-readonly", handleReadonly);
      socket.emit("cursor-clear", { documentId });
      setRemoteCursors([]);
    };
  }, [documentId, editor]);

  const getCursorRect = useCallback(
    (position: number) => {
      if (!editor || !editorShellRef.current) return null;

      try {
        const safePosition = Math.max(
          0,
          Math.min(position, editor.state.doc.content.size),
        );
        const coords = editor.view.coordsAtPos(safePosition);
        const shell = editorShellRef.current.getBoundingClientRect();

        return {
          left: coords.left - shell.left,
          top: coords.top - shell.top,
          height: Math.max(coords.bottom - coords.top, 18),
        };
      } catch {
        return null;
      }
    },
    [editor],
  );

  const getActiveTableRect = useCallback(() => {
    if (!editor || !editorShellRef.current || !editor.isActive("table")) {
      return null;
    }

    try {
      const domAtSelection = editor.view.domAtPos(editor.state.selection.from);
      const element =
        domAtSelection.node.nodeType === globalThis.Node.ELEMENT_NODE
          ? (domAtSelection.node as Element)
          : domAtSelection.node.parentElement;
      const table = element?.closest("table");

      if (!table) return null;

      const shell = editorShellRef.current.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const controlsWidth = 188;

      return {
        left: Math.max(
          8,
          Math.min(
            tableRect.right - shell.left - controlsWidth,
            shell.width - controlsWidth - 8,
          ),
        ),
        top: tableRect.top - shell.top + 8,
      };
    } catch {
      return null;
    }
  }, [editor]);

  if (!editor) return null;

  const tableControlsRect = getActiveTableRect();

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-10">
      <div className="mb-6 pl-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title || "Untitled Document"}
        </h1>
      </div>
      <div
        ref={editorShellRef}
        className="relative rounded-xl border bg-background shadow-md overflow-hidden"
      >
        <Toolbar
          editor={editor}
          isAIActive={isAIActive}
          onToggleAI={() => setIsAIActive(!isAIActive)}
          isVoiceActive={isVoiceActive}
          onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
        />
        <EditorContent editor={editor} />
        {tableControlsRect && canEdit && (
          <div
            className="absolute z-30 flex items-center gap-1 rounded-md border bg-background/95 p-1 shadow-sm"
            style={{
              left: tableControlsRect.left + 8,
              top: tableControlsRect.top,
            }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Rows3 className="h-3.5 w-3.5" />
              Row
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <Columns3 className="h-3.5 w-3.5" />
              Column
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete table"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 z-20">
          {remoteCursors.map((cursor) => {
            const rect = getCursorRect(cursor.from);

            if (!rect) return null;

            return (
              <div
                key={cursor.userId}
                className="absolute"
                style={{
                  left: rect.left,
                  top: rect.top,
                }}
              >
                <div
                  className="w-0.5 rounded-full"
                  style={{
                    height: rect.height,
                    backgroundColor: cursor.color,
                  }}
                />
                <div
                  className="absolute left-0 top-0 -translate-y-full rounded-t-md rounded-br-md px-2 py-0.5 text-[11px] font-semibold leading-5 text-white shadow-sm whitespace-nowrap"
                  style={{ backgroundColor: cursor.color }}
                >
                  {cursor.name}
                </div>
              </div>
            );
          })}
        </div>
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
