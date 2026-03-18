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
    <Link href={href} className={`flex items-center gap-2 ${className ?? ""}`}>
      {avatar}
      <span className="py-1">{label}</span>
    </Link>
  );
}