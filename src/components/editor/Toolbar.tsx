"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Sparkles,
  Mic,
  Quote,
  Heading1,
  Heading2,
  Code,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ToolbarProps {
  editor: Editor | null;
  isAIActive?: boolean;
  onToggleAI?: () => void;
  isVoiceActive?: boolean;
  onToggleVoice?: () => void;
}

export function Toolbar({
  editor,
  isAIActive,
  onToggleAI,
  isVoiceActive,
  onToggleVoice,
}: ToolbarProps) {
  if (!editor) return null;

  const preventBlur = (e: React.MouseEvent) => e.preventDefault();

  // Functions for complex actions
  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const toggleClass =
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground";

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b bg-background/95 p-2 backdrop-blur rounded-t-xl">
      {/* --- HISTORY --- */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          onMouseDown={preventBlur}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          onMouseDown={preventBlur}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* --- TEXT STYLE --- */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("highlight")}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Highlighter className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* --- ALIGNMENT --- */}
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* --- LISTS --- */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("taskList")}
        onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <CheckSquare className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* --- INSERTS --- */}
      {/* --- INSERTS --- */}
      {/* Fix: We use conditional className instead of the 'pressed' prop for Buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={addLink}
        onMouseDown={preventBlur}
        className={
          editor.isActive("link") ? "bg-accent text-accent-foreground" : ""
        }
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        onMouseDown={preventBlur}
        className={
          editor.isActive("image") ? "bg-accent text-accent-foreground" : ""
        }
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={insertTable}
        onMouseDown={preventBlur}
        className={
          editor.isActive("table") ? "bg-accent text-accent-foreground" : ""
        }
      >
        <TableIcon className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* --- SPECIAL --- */}
      <Toggle
        size="sm"
        pressed={isAIActive}
        onPressedChange={onToggleAI}
        onMouseDown={preventBlur}
        className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-600"
      >
        <Sparkles className="h-4 w-4 mr-1" /> AI
      </Toggle>
      <Toggle
        size="sm"
        pressed={isVoiceActive}
        onPressedChange={onToggleVoice}
        onMouseDown={preventBlur}
        className="data-[state=on]:bg-red-100 data-[state=on]:text-red-600"
      >
        <Mic
          className={`h-4 w-4 mr-1 ${isVoiceActive ? "animate-pulse" : ""}`}
        />{" "}
        Voice
      </Toggle>
    </div>
  );
}
