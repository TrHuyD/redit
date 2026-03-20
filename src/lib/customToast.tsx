import { buttonVariants } from '@/components/ui/Button'
import Link from 'next/link'
import { toast } from 'sonner'

export const loginToast = () => {
  const id = toast.error('Login required.', {
    description: 'You need to be logged in to do that.',
    action: (
      <Link
        onClick={() => toast.dismiss(id)}
        href='/sign-in'
        className={buttonVariants({ variant: 'outline' })}
      >
        Login
      </Link>
    ),
  })
}