import Link from "next/link";
import { buttonVariants } from "./button";
import {Logo} from "./Icons";
import {  getAuthToken } from "@/lib/auth";
import { UserAccountNav } from "./user/UserAccountNav";

const Navbar = async () => {
    const session = await getAuthToken()
  
    return (
      <div className="fixed top-0 inset-x-0 h-fit border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 z-[30] py-2">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
          
          <Link href="/" className="flex gap-2 items-center">
            <Logo />
            <p className="hidden text-zinc-800 dark:text-zinc-100 text-sm font-medium md:block">
              Redit
            </p>
          </Link>
  
          {session ? (
            <UserAccountNav user={session} />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign in
            </Link>
          )}
  
        </div>
      </div>
    )
  }
  
  export default Navbar