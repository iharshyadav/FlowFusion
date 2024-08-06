import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { FC } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import SparklesText from '../magicui/sparkles-text'
import ShimmerButton from '../magicui/shimmer-button'
import { DockDemo } from './nav-menu'
import ShinyButton from '../magicui/shiny-button'

interface navbarProps {
  
}

const Navbar: FC<navbarProps> = async ({}) => {
  
  const user = await currentUser()

  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
      <aside className="flex items-center gap-[2px]">
        <SparklesText
          sparklesCount={5}
          text="FlowFusion"
          className="text-4xl"
        />
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-7 list-none">
          <DockDemo />
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        <Link href="/dashboard">
          {user ? (
            <ShinyButton text="Dashboard" className="" />
          ) : (
            <ShinyButton text="Get Started" className="" />
          )}
        </Link>
        {user ? <UserButton afterSignOutUrl="/" /> : null}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  );
}

export default Navbar