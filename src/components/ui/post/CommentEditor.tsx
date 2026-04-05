'use client'

import { useState } from 'react'
import { Button } from '../button'
import { AutosizeTextarea } from '@/components/ui/autosize-textarea'

interface CommentEditorProps {
  onCancel: () => void
  onPost: (text: string) => void | Promise<void>
}

export const CommentEditor = ({ onCancel, onPost }: CommentEditorProps) => {
  const [text, setText] = useState('')

  return (
    <div className="w-full border border-zinc-200 rounded-lg p-3">
      <AutosizeTextarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Join the conversation"
        className="w-full resize-none outline-none text-sm"
        minHeight={72}
        maxHeight={200}
      />

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          disabled={!text.trim()}
          onClick={async () => await onPost(text)}
        >
          Post
        </Button>
      </div>
    </div>
  )
}