'use client'
import Editor from "@/components/ui/Editor";
import { useAuth } from "@/components/ui/providers/auth-provider";
import { SubredditSelector } from "@/components/ui/subreddit/SubredditSelector";
import { loginToast } from "@/lib/customToast";
import { SubRedditDto } from "@/types/subreddit";
import { useRef } from "react";

interface EditorComboProps {
    subreddit: SubRedditDto}
  export const EditorCombo = ({ subreddit }: EditorComboProps) => {
    
    const saveDraftRef = useRef<(() => Promise<void>) | null>(null)
  
      return (<>
            <SubredditSelector slug={subreddit.name} initialImage={subreddit.image}  onBeforeChange={async () => {await saveDraftRef.current?.()}}/>
            <div className="border-b pb-5" />
            <Editor id={subreddit.Id}  registerSaveDraft={(fn) => {saveDraftRef.current = fn}}/>
            </> )
}