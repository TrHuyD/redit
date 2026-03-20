'use client'

import EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { z } from 'zod'

import { toast } from 'sonner'
import { useUploadThing } from '@/lib/uploadthing'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import '@/styles/editor.css'

type FormData = z.infer<typeof PostValidator>

interface EditorProps {
  subredditId: string
}

export default function Editor({ subredditId }: EditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  })

  const ref = useRef<EditorJS | undefined>(undefined)
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const { startUpload } = useUploadThing('imageUploader')

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async ({ title, content, subredditId }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId }
      const { data } = await axios.post('/api/subreddit/post/create', payload)
      return data
    },
    onError: (err: AxiosError) => {
      const message =
        err.response?.status === 422
          ? 'Please fill in all required fields correctly.'
          : 'Your post was not published. Please try again.'

      toast.error('Something went wrong.', { description: message })
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathname)
      router.refresh()
      toast.success('Your post has been published.')
    },
  })

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default


    if (!ref.current) {
    const editor = new EditorJS({
      holder: 'editor',
      onReady() {
        ref.current = editor
      },
      placeholder: 'Type here to write your post...',
      inlineToolbar: true,
      data: { blocks: [] },
      tools: {
        header: Header,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/link',  
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const uploaded = await startUpload([file])
                const url = uploaded?.[0]?.url

                if (!url) throw new Error('Upload failed')
                
                return {
                  success: 1,
                  file: { url },
                }
              },
            },
          },
        },
        list: List,
        code: Code,
        inlineCode: InlineCode,
        table: Table,
        embed: Embed,
      },
    })
  }}, [startUpload])

  useEffect(() => {
    for (const [, value] of Object.entries(errors)) {
      toast.error('Something went wrong.', {
        description: (value as { message: string }).message,
      })
    }
  }, [errors])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const init = async () => {
      await initializeEditor()
      setTimeout(() => _titleRef.current?.focus(), 0)
    }

    init()

    return () => {
      ref.current?.destroy()
      ref.current = undefined
    }
  }, [isMounted, initializeEditor])

  async function onSubmit(data: FormData): Promise<void> {
    const blocks = await ref.current?.save()

    createPost({
      title: data.title,
      content: blocks,
      subredditId,
    })
  }

  if (!isMounted) return null

  const { ref: titleRef, ...rest } = register('title')

  return (
    <div className="w-full max-w-3xl p-4 rounded-xl border border-border 
    bg-background 
    dark:bg-zinc-900 
    bg-zinc-100 
    text-foreground 
    shadow-sm hover:shadow-md transition">
      <form
        id='subreddit-post-form'
        className='w-fit'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='prose prose-stone dark:prose-invert'>
          <TextareaAutosize
            ref={(e) => {
              titleRef(e)
              _titleRef.current = e
            }}
            {...rest}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none '
          />
              <div className="my-6 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">Content</span>
                <div className="h-px flex-1 bg-border" />
              </div>
          <div id='editor' className='min-h-[500px]' />
          <p className='text-sm'>
            Use{' '}
            <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>  
        </div>
      </form>
    </div>
  )
}
