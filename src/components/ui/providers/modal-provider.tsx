"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface ModalContextType {
  openModal: (content: ReactNode) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)

  function openModal(modalContent: ReactNode) {
    setContent(modalContent)
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
    setContent(null)
  }

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = ""
    }

    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
          <VisuallyHidden>
            <DialogTitle>Modal</DialogTitle>
          </VisuallyHidden>
          {content}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used inside ModalProvider")
  }
  return context
}