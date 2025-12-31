"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Sparkles,
  Mic,
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
  isAIActive = false,
  onToggleAI,
  isVoiceActive = false,
  onToggleVoice,
}: ToolbarProps) {
  if (!editor) return null;

  // This is crucial: stops the button from stealing focus from the editor
  const preventBlur = (e: React.MouseEvent) => e.preventDefault();

  // STYLING STRATEGY:
  // We use "data-[state=on]" modifiers. This means the style only applies
  // when the component is actually in the 'on' state.
  // We do not need conditional logic (?:) inside the className.
  const toggleClass =
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground";
  const aiClass =
    "data-[state=on]:bg-purple-100 data-[state=on]:text-purple-600 dark:data-[state=on]:bg-purple-900/50 dark:data-[state=on]:text-purple-300";
  const voiceClass =
    "data-[state=on]:bg-red-100 data-[state=on]:text-red-600 dark:data-[state=on]:bg-red-900/50 dark:data-[state=on]:text-red-300";

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 border-b bg-background/95 p-2 backdrop-blur rounded-t-xl">
      {/* BOLD */}
      <Toggle
        size={"sm"}
        pressed={editor.isActive("bold")}
        // Logic: When clicked, tell Tiptap to toggle bold
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().toggleBold()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      {/* ITALIC */}
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().toggleItalic()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      {/* CODE */}
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().toggleCode()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* H1 */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        disabled={!editor.can().toggleHeading({ level: 1 })}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>

      {/* H2 */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        disabled={!editor.can().toggleHeading({ level: 2 })}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* LISTS */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().toggleBulletList()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <List className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().toggleOrderedList()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* AI */}
      <Toggle
        size="sm"
        pressed={isAIActive}
        onPressedChange={onToggleAI}
        onMouseDown={preventBlur}
        className={aiClass}
      >
        <Sparkles className="h-4 w-4 mr-1" />
        AI
      </Toggle>

      {/* VOICE */}
      <Toggle
        size="sm"
        pressed={isVoiceActive}
        onPressedChange={onToggleVoice}
        onMouseDown={preventBlur}
        className={voiceClass}
      >
        <Mic
          className={`h-4 w-4 mr-1 ${isVoiceActive ? "animate-pulse" : ""}`}
        />
        Voice
      </Toggle>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={!editor.can().undo()}
          onMouseDown={preventBlur}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!editor.can().redo()}
          onMouseDown={preventBlur}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

