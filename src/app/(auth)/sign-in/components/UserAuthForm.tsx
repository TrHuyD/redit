'use client'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {signIn} from "next-auth/react"
import { toast } from "sonner";

interface UserAuthFormProps extends React.HtmlHTMLAttributes<HTMLDivElement>{}
export default function UserAuthForm({className,...props}: UserAuthFormProps)
{
    const [isLoading, setIsLoading] =useState(false)
    const loginWithGoogle =async()=>
    {
        setIsLoading(true)
        try
        {
            await signIn('google')

        }
        catch (error)
        {
            toast.error("There was a problem", {
                description: "Your changes were not saved",
              })
        }
        finally
        {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('flex justify-center',className)} {...props}>
                <Button onClick={loginWithGoogle} disabled={isLoading} size="sm">Google</Button>
        </div>
    )
}