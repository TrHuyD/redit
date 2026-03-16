"use client"

import { cn } from "@/lib/utils"
import TextareaAutosize from "react-textarea-autosize"
import { useRef, useState } from "react"
import { ImageIcon, Link2, Bold, Italic, List, Code } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface EditorProps {
  className?: string
  onSubmit?: (data: { title: string; content: string }) => void
  isLoading?: boolean
  placeholder?: string
}

export default function Editor({
  className,
  onSubmit,
  isLoading,
  placeholder = "What are your thoughts?",
}: EditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = (tag: string) => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.slice(start, end)

    const formats: Record<string, string> = {
      bold: `**${selected}**`,
      italic: `*${selected}*`,
      code: `\`${selected}\``,
      link: `[${selected}](url)`,
      list: `\n- ${selected}`,
    }

    const replacement = formats[tag] ?? selected
    setContent(content.slice(0, start) + replacement + content.slice(end))
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit?.({ title, content })
  }

  return (
    <div className={cn("w-full rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden", className)}>
      
      {/* Title */}
      <TextareaAutosize
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxRows={3}
        className="w-full resize-none bg-transparent px-4 pt-4 text-xl font-semibold placeholder:text-zinc-500 text-zinc-100 focus:outline-none"
      />

      <div className="h-px bg-zinc-700 mx-4" />

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2">
        {[
          { icon: <Bold size={15} />, tag: "bold" },
          { icon: <Italic size={15} />, tag: "italic" },
          { icon: <Code size={15} />, tag: "code" },
          { icon: <Link2 size={15} />, tag: "link" },
          { icon: <List size={15} />, tag: "list" },
        ].map(({ icon, tag }) => (
          <button
            key={tag}
            type="button"
            onClick={() => applyFormat(tag)}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
          >
            {icon}
          </button>
        ))}

        <div className="ml-auto">
          <button
            type="button"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
          >
            <ImageIcon size={15} />
          </button>
        </div>
      </div>

      <div className="h-px bg-zinc-700 mx-4" />

      {/* Body */}
      <TextareaAutosize
        ref={contentRef}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        minRows={6}
        className="w-full resize-none bg-transparent px-4 py-3 text-sm placeholder:text-zinc-500 text-zinc-300 focus:outline-none"
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-700">
        <p className="text-xs text-zinc-500">
          {content.length > 0 ? `${content.length} characters` : "Markdown supported"}
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || isLoading}>
          Post
        </Button>
      </div>

    </div>
  )
}