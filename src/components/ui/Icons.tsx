import { Drama,User  } from "lucide-react"
import { cn } from "@/lib/utils"

type TSize = "sm" | "md" | "lg"
type LogoProps = {
  size?: TSize
  className?: string
}
const logoSizeMap: Record<TSize, string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}
export function Logo({ size = "md", className }: LogoProps) {
  return <Drama className={cn(logoSizeMap[size], className)} />
}

export function UserLogo({ size = "md", className }: LogoProps) {
  return <User className={cn(logoSizeMap[size], className)} />
}