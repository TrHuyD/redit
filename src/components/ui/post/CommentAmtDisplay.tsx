import { MessageSquare } from "lucide-react"

interface CommentAmtProp {
    amt:number
}

export default function CommentAmtDisplay({amt}:CommentAmtProp)
{
    return <div className="w-fit flex items-center gap-1 px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-gray-600 dark:text-zinc-400">
    <MessageSquare className="h-3.5 w-3.5" />
    <span>{amt}</span>
  </div>

}