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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import '@/styles/editor.css'
import { ID } from '@/types/ID'
import { withToast } from '@/lib/withToast'

type FormData = z.infer<typeof PostValidator>

interface EditorProps {
  id: ID
  registerSaveDraft?: (fn: () => Promise<void>) => void
}

let TEMP_DRAFT: {
  title: string
  blocks: any
} | null = null

export default function Editor({ id, registerSaveDraft }: EditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId: id,
      title: '',
      content: null,
    },
  })
  const ref = useRef<EditorJS | null>(null)
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const queryClient = useQueryClient()
  const { startUpload } = useUploadThing('imageUploader')

  const saveDraft = useCallback(async () => {
    if (!ref.current) return
    try {
      const blocks = await ref.current.save()
      const title = _titleRef.current?.value ?? ''
      TEMP_DRAFT = { title, blocks }
    } catch (err) {
      console.error('saveDraft failed', err)
    }
  }, [])

  useEffect(() => {
    if (!registerSaveDraft) return
    registerSaveDraft(saveDraft)
  }, [registerSaveDraft, saveDraft])

  const { mutate: createPost } = useMutation<{ postId: bigint }, Error, PostCreationRequest>({
    mutationFn:  withToast(async ({ title, content, subredditId }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId }
      const { data } = await axios.post('/api/subreddit/post/create', payload)
      return data 
    }),
    onSuccess: (data) => {
      const newPathname = pathname.split('/')[2]

      TEMP_DRAFT = null

      queryClient.invalidateQueries({
        queryKey: ['posts', newPathname],
      })

      router.push(`/r/${newPathname}/comments/${data.postId}`)
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

    if (ref.current) return

    const parsed = TEMP_DRAFT

    const editor = new EditorJS({
      holder: 'editor',
      onReady() {
        ref.current = editor
      },
      placeholder: 'Type here to write your post...',
      inlineToolbar: true,
      data: parsed?.blocks ?? { blocks: [] },
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

    setTimeout(() => {
      if (parsed?.title && _titleRef.current) {
        _titleRef.current.value = parsed.title
      }
      _titleRef.current?.focus()
    }, 0)
  }, [startUpload])

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

    initializeEditor()

    return () => {
      ref.current?.destroy()
      ref.current = null
    }
  }, [isMounted, initializeEditor])

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save()

    createPost({
      title: data.title,
      content: blocks,
      subredditId: id,
    })
  }

  if (!isMounted) return null

  const { ref: titleRef, ...rest } = register('title')

  return (
    <div className="w-full max-w-3xl p-4 rounded-xl border border-border 
    bg-background dark:bg-zinc-900 bg-zinc-100 text-foreground 
    shadow-sm hover:shadow-md transition">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e)
              _titleRef.current = e
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />

          <div className="my-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Content</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div id="editor" className="min-h-[500px]" />

          <p className="text-sm">
            Use{' '}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  )
}