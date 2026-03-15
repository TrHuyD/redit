import Link from "next/link";
import { buttonVariants } from "./Button";
import {Logo} from "./Icons";
import {  getAuthToken } from "@/lib/auth";
import { UserAccountNav } from "./user/UserAccountNav";

const Navbar =async() =>{

    const session= await getAuthToken()
    return (<div className="fixed top-0 inset-x-0 h-fit border-b bg-zinc-300 z-[10] py-2">
    <div className="container max-w-7xl h-full  mx-auto flex items-center justify-between gap-2">
    {/* logo */}
    
    <Link href ='/' className="flex gap-2 items-center">
    <Logo></Logo>
    <p className="hidden text-zinc-700 text-sm font-medium md:block ">Redit</p>

    </Link>
    {/*search bar */}
    {
    session?
    (<UserAccountNav user={session}/>):
    (<Link href ='/sign-in' className={buttonVariants()}>Sign in</Link>)
    }
    </div>
</div>)
}
export default Navbar;