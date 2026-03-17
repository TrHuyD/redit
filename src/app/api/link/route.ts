import axios from "axios"

export async function Get(req:Request)
{
    const url = new URL(req.url)
    const link = url.searchParams.get("url")
    if(!link) return new Response("Missing href", { status: 400 })
    const res= await axios.get(link)
    const titleMatch = res.data.match(/<title>(.*?)<\/title>/)
    const title = titleMatch ? titleMatch[1] : "No title"
    const descriptionMatch = res.data.match(/<meta name="description" content="(.*?)"/)
    const description = descriptionMatch ? descriptionMatch[1] : " No description"
    const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/)
    const imageUrl = imageMatch ? imageMatch[1] : null
    return Response.json({ success:1, meta:{ title, description,image:{url:imageUrl} }})

}