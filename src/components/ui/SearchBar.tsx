  "use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { useRouterWithLoader } from "@/lib/utilui";
import { SubredditCompeteMd, SubRedditDto } from "@/types/subreddit";
import { forwardRef, KeyboardEvent, useImperativeHandle, useRef, useState, } from "react";
import { SubredditAvatar } from "./subreddit/SubredditAvatar";

  export interface SearchBarHandle {
    applyTag: (subreddit: SubRedditDto) => void;
    removeTag: () => void;
  }

  interface SearchBarProps {
    onSearch?: (query: string, tag: SubRedditDto | null) => void;
  }

  export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
    function SearchBar({ onSearch }, ref) {
      const [input, setInput] = useState("");
      const [tag, setTag] = useState<SubRedditDto | null>(null);
      const [subreddits, setSubreddits] = useState<SubredditCompeteMd[]>([]);
      const [loading, setLoading] = useState(false);
      const [open, setOpen] = useState(false);
      const {push} =useRouterWithLoader()
      const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
      const abortRef = useRef<AbortController | null>(null);

      useImperativeHandle(ref, () => ({
        applyTag(subreddit: SubRedditDto) {
          setTag(subreddit);
          setInput("");
          setOpen(false);
          setSubreddits([]);
        },
        removeTag() {
          setTag(null);
        },
      }));

      function handleSearchChange(value: string) {
        setInput(value);

        if (tag) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (abortRef.current) abortRef.current.abort();

        if (!value.trim()) {
          setSubreddits([]);
          setOpen(false);
          return;
        }

        debounceRef.current = setTimeout(async () => {
          const controller = new AbortController();
          abortRef.current = controller;
          setLoading(true);
          try {
            const res = await fetch(
              `/api/subreddit/where-to-post?name=${encodeURIComponent(value)}`,
              { signal: controller.signal }
            );
            const data: SubredditCompeteMd[] = await res.json();
            setSubreddits(data);
            setOpen(data.length > 0);
          } catch (e: any) {
            if (e.name !== "AbortError") setSubreddits([]);
          } finally {
            setLoading(false);
          }
        }, 300);
      }

      function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && input === "" && tag) {
          setTag(null);
        }
        if (e.key === "Enter" && !open) {
          onSearch?.(input, tag);
        }
        if (e.key === "Escape") {
          setOpen(false);
        }
      }

      return (
          <Command shouldFilter={false} className="bg-transparent max-w-xl  w-full">
          <div className=" w-full  max-w-xl ">
              <CommandInput  
                value={input} 
                onValueChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder={tag ? `Search in r/${tag.name}… (Backspace to exit)` : "Search Reddit…"}
                className="bg-transparent outline-none focus:outline-none ring-0 focus:ring-0 rounded-sm "/>
            </div>
          {open && !tag && (
          <CommandList className="absolute top-full z-50  w-full bg-white dark:bg-zinc-900 rounded-md border shadow-md">
              {loading
                ? <CommandEmpty>Searching…</CommandEmpty>
                : <>
                    <CommandEmpty>No communities found.</CommandEmpty>
                    <CommandGroup heading="Communities">
                      {subreddits.map((s) => (
                        <CommandItem
                          key={s.id.toString()}
                          value={s.name}
                          onSelect={() => {
                           // setTag(s);
                            setInput("");
                            setOpen(false);
                            setSubreddits([]);
                            push(`/r/${s.name}`)
                          }}
                        >
                          <div className="flex items-center w-full -ml-1">
                            <SubredditAvatar subreddit={s} size="sm"/>
                            <div className="flex flex-col pl-1">
                            <span className="px-1">r/{s.name}</span>
                            <span className="px-1 text-gray-500">{s.userCount} members</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
              }
            </CommandList>
          )}
        </Command>
      );
    }
  );