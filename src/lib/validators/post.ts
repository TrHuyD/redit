
import {z} from 'zod'
export const PostValidator = z.object({ 
    title: z.string().min(3, "Title must be at least 3 characters long").max(30, "Title must be less than 30 characters long"),
    subredditId: z.string(),
    content: z.any(),
})
export type PostCreationRequest = z.infer<typeof PostValidator>