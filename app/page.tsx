import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link className={'text-md ' + buttonVariants({ variant: "default" }) } href={'/auth/login'}>Go to App</Link>
    </main>
  )
}
