import axios from "axios"
import he from 'he'
export async function GET(req: Request) {
  const url = new URL(req.url)
  const link = url.searchParams.get("url")

  if (!link) return new Response("Missing url", { status: 400 })

  // Basic SSRF guard
  try {
    const parsed = new URL(link)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return new Response("Invalid protocol", { status: 400 })
    }
  } catch {
    return new Response("Invalid URL", { status: 400 })
  }

  try {
    const res = await axios.get(link, {
      timeout: 5000,
      maxContentLength: 5000000, // 500kb cap
      headers: { "User-Agent": "Mozilla/5.0 (compatible; link-preview-bot)" },
    })

    const html: string = res.data

    const get = (regex: RegExp) => regex.exec(html)?.[1] ?? null

    const title =
      get(/<title[^>]*>([^<]*)<\/title>/i) ??
      get(/<meta\s+property="og:title"\s+content="([^"]*)"/i) ??
      "No title"

    const description =
      get(/<meta\s+name="description"\s+content="([^"]*)"/i) ??
      get(/<meta\s+property="og:description"\s+content="([^"]*)"/i) ??
      "No description"
    const clear_description= he.decode(description)
    const imageUrl =
      get(/<meta\s+property="og:image"\s+content="([^"]*)"/i) ??
      get(/<meta\s+name="twitter:image"\s+content="([^"]*)"/i)
 
    return Response.json({
      success: 1,
      meta: { title :title, 
        description :clear_description,
        image: { url: imageUrl },
       },
    })
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Response(`Failed to fetch URL: ${err.message}`, { status: 502 })
    }
    return new Response("Internal error", { status: 500 })
  }
}