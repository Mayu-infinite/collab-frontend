"use client";

import { type Editor } from "@tiptap/react";
import { useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  ChevronDown,
  Code,
  Columns3,
  Eraser,
  Heading1,
  Heading2,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Mic,
  Quote,
  Redo,
  Rows3,
  Sparkles,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

interface ToolbarProps {
  editor: Editor | null;
  isAIActive?: boolean;
  onToggleAI?: () => void;
  isVoiceActive?: boolean;
  onToggleVoice?: () => void;
}

const highlightColors = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Orange", value: "#fed7aa" },
];

export function Toolbar({
  editor,
  isAIActive,
  onToggleAI,
  isVoiceActive,
  onToggleVoice,
}: ToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [activeHighlightColor, setActiveHighlightColor] = useState("#fef08a");

  if (!editor) return null;

  const isReadOnly = !editor.isEditable;
  const preventBlur = (event: MouseEvent) => event.preventDefault();
  const toggleClass =
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground";

  const addLink = () => {
    if (isReadOnly) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addEmbed = () => {
    if (isReadOnly) return;

    const url = window.prompt("Embed URL");

    if (!url) return;

    const youtubeMatch =
      url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
      url.match(/youtu\.be\/([^?&]+)/);
    const embedSrc = youtubeMatch
      ? `https://www.youtube.com/embed/${youtubeMatch[1]}`
      : url;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "embed",
        attrs: {
          url,
          src: embedSrc,
          title: url.replace(/^https?:\/\//, ""),
          kind: youtubeMatch ? "iframe" : "link",
        },
      })
      .run();
  };

  const applyHighlight = (color = activeHighlightColor) => {
    if (isReadOnly) return;

    setActiveHighlightColor(color);
    editor.chain().focus().setHighlight({ color }).run();
  };

  const insertImageFile = (file: File) => {
    if (isReadOnly || !file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = () => {
      const src = reader.result;

      if (typeof src !== "string") return;

      editor
        .chain()
        .focus()
        .setImage({
          src,
          alt: file.name,
        })
        .run();
    };

    reader.readAsDataURL(file);
  };

  const handleImageInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) insertImageFile(file);

    event.target.value = "";
  };

  const addImageFromUrl = () => {
    if (isReadOnly) return;

    const url = window.prompt("Image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    if (isReadOnly) return;

    editor
      .chain()
      .focus()
      .insertTable({ rows: 2, cols: 2, withHeaderRow: false })
      .run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-xl border-b bg-background/95 p-2 backdrop-blur">
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={isReadOnly || !editor.can().undo()}
          onMouseDown={preventBlur}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={isReadOnly || !editor.can().redo()}
          onMouseDown={preventBlur}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        disabled={isReadOnly}
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
        disabled={isReadOnly}
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
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          disabled={isReadOnly}
          onClick={() => applyHighlight()}
          onMouseDown={preventBlur}
          className={
            editor.isActive("highlight")
              ? "bg-accent text-accent-foreground"
              : ""
          }
          title="Apply highlight"
        >
          <Highlighter className="h-4 w-4" />
          <span
            className="ml-1 h-3 w-3 rounded-full border"
            style={{ backgroundColor: activeHighlightColor }}
          />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isReadOnly}
              onMouseDown={preventBlur}
              className="px-1"
              title="Highlight color"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuLabel>Highlight</DropdownMenuLabel>
            <div className="grid grid-cols-5 gap-1 p-1">
              {highlightColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  className="h-7 rounded-md border border-border"
                  style={{ backgroundColor: color.value }}
                  onClick={() => applyHighlight(color.value)}
                />
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              <Eraser className="h-4 w-4" />
              Remove highlight
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Toggle
        size="sm"
        pressed={editor.isActive("codeBlock")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "left" })}
        disabled={isReadOnly}
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
        disabled={isReadOnly}
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
        disabled={isReadOnly}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("taskList")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <CheckSquare className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        disabled={isReadOnly}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        onMouseDown={preventBlur}
        className={toggleClass}
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isReadOnly}
            onMouseDown={preventBlur}
            className={
              editor.isActive("link") ? "bg-accent text-accent-foreground" : ""
            }
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuItem onClick={addLink}>
            <LinkIcon className="h-4 w-4" />
            Add/edit link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={addEmbed}>
            <Code className="h-4 w-4" />
            Embed URL
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!editor.isActive("link")}
            onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
          >
            <Eraser className="h-4 w-4" />
            Remove link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageInput}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isReadOnly}
            onMouseDown={preventBlur}
            className={
              editor.isActive("image") ? "bg-accent text-accent-foreground" : ""
            }
            title="Insert image"
          >
            <ImageIcon className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
            <ImageIcon className="h-4 w-4" />
            Upload image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={addImageFromUrl}>
            <LinkIcon className="h-4 w-4" />
            Image URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isReadOnly}
            onMouseDown={preventBlur}
            className={
              editor.isActive("table") ? "bg-accent text-accent-foreground" : ""
            }
            title="Table"
          >
            <TableIcon className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuItem onClick={insertTable}>
            <TableIcon className="h-4 w-4" />
            Insert 2 x 2 table
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!editor.isActive("table")}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <Columns3 className="h-4 w-4" />
            Add column
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.isActive("table")}
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            <Columns3 className="h-4 w-4" />
            Delete column
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.isActive("table")}
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <Rows3 className="h-4 w-4" />
            Add row
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.isActive("table")}
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <Rows3 className="h-4 w-4" />
            Delete row
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!editor.isActive("table")}
            variant="destructive"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <Trash2 className="h-4 w-4" />
            Delete table
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={isAIActive}
        onPressedChange={onToggleAI}
        onMouseDown={preventBlur}
        disabled={isReadOnly}
        className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-600"
      >
        <Sparkles className="h-4 w-4 mr-1" />
        AI
      </Toggle>
      <Toggle
        size="sm"
        pressed={isVoiceActive}
        onPressedChange={onToggleVoice}
        onMouseDown={preventBlur}
        disabled={isReadOnly}
        className="data-[state=on]:bg-red-100 data-[state=on]:text-red-600"
      >
        <Mic className={`h-4 w-4 mr-1 ${isVoiceActive ? "animate-pulse" : ""}`} />
        Voice
      </Toggle>
    </div>
  );
}
