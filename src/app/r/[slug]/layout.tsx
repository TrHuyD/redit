import CreatePostButton from "@/components/post/CreatePostButton"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Redit",
  description: "Abc",
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params

  return (
    <div>
      <CreatePostButton />
      {slug}
      {children}
    </div>
  )
}