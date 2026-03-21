'use client'
import {Logo} from "@/components/ui/Icons";
import UserAuthForm from "./UserAuthForm";


export default function SignIn()
{
    return <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
            <Logo size="sm" className="mx-auto"></Logo>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm max-w-xs mx-auto">
            By continuing, you are setting up a Redit account and agree to our User Agreement.    
            </p>    
            <UserAuthForm />

        </div>

    </div>
}   