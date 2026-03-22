import Link from "next/link";
import { ReactNode } from "react";

interface EntityTagProps {
  href: string;
  avatar: ReactNode;
  label: string;
  className?: string;
}

export default function EntityTag({ href, avatar, label, className }: EntityTagProps) {
  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-2 w-fit
        px-2 py-1 rounded-full
        text-zinc-800 hover:text-zinc-400
        dark:text-zinc-400 dark:hover:text-zinc-200
        bg-transparent hover:bg-white/5 
        ring-1 ring-transparent hover:ring-white/10
        transition-all duration-200
        ${className ?? ""}
      `}
      prefetch={false}
    >
      <span className="shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
        {avatar}
      </span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </Link>
  );
}