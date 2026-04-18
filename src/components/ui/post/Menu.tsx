"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Ellipsis, Flag, Trash } from "lucide-react";
import { Button } from "../button";
export interface Props {
  postId: bigint;
  isOwner:boolean;
}

export function PostMenu({ postId,isOwner }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 grid place-items-center">
          <Ellipsis size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className= "bg-background border rounded-md shadow-xl min-w-[160px]">
        {!isOwner?(
        <DropdownMenuItem onClick={() => console.log("Report clicked")} className=" px-4 py-2.5 text-base hover:bg-accent outline-none ring-0 focus:ring-0">
         <div className="flex gap-2 text-sm"><Flag size={20}/> Report (Do nothing)</div>
        </DropdownMenuItem>):
        ( <DropdownMenuItem onClick={() => console.log("Report clicked")} className=" px-4 py-2.5 text-base hover:bg-accent outline-none ring-0 focus:ring-0">
        <div className="flex gap-2 text-sm"><Trash size={20}/> Delete (Do nothing)</div>
       </DropdownMenuItem>)
         }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
