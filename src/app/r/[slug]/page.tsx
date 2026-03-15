
import { getAuthToken } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
      slug: string
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    console.log("subreddit 's page loaded ")
  
  }