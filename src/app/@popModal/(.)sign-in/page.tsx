import SignIn from "@/app/(auth)/sign-in/components/SignIn"
import CloseModal from "@/components/ui/CloseModal"

export default function Page() {
    return (
      <div className="fixed inset-0 z-10 bg-black/20 dark:bg-black/50">
        <div className="container flex items-center h-full max-w-lg mx-auto">
          <div className="relative w-full h-fit py-20 px-2 rounded-lg 
                          bg-white dark:bg-gray-800 
                          ring-1 ring-gray-900/5 dark:ring-white/10 
                          shadow-xl">
            <div className="absolute top-4 right-4">
              <CloseModal />
            </div>
  
            <SignIn />
          </div>
        </div>
      </div>
    )
  }
