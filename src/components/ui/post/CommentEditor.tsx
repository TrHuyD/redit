'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '../Button'

interface CommentEditorProps {
  onCancel: () => void
  onPost: (text: string) => void
}

export const CommentEditor = ({ onCancel, onPost }: CommentEditorProps) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const textarea= textareaRef.current
    if(!textarea) return
    textarea.style.height = 'auto' 
    textarea.style.height = textarea.scrollHeight + 'px' 
  },[text])
  return (
    <div className="w-full border border-zinc-200 rounded-lg p-3">
      <textarea
        ref={textareaRef}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Join the conversation"
        className="w-full resize-none outline-none text-sm"
        rows={3}
      />

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>

        <Button disabled={!text.trim()} onClick={async() =>await onPost(text)}>
          Post
        </Button>
      </div>
    </div>
  )
}