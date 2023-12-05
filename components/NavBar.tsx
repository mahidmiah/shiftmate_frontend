'use client'

import useGlobalStore from '@/store/globalSlice'
import { BookUser, CalendarRange, Home, ScrollText, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function NavBar() {

    const pathname = usePathname()
    const globalStore = useGlobalStore(state => state);

    const active = 'flex items-center gap-x-4 w-full h-14 px-4 text-lg font-light text-secondary-foreground bg-accent border-primary border-l-4'
    const nonActive = 'flex items-center gap-x-4 w-full h-14 px-4 text-lg font-light text-secondary-foreground hover:bg-accent border-l-4 border-white hover:border-accent'
    return (
        <div className='h-full w-full flex flex-col mx-3 my-4'>
            <Link href='/app/home' className={(pathname === '/app/home' ? active : nonActive)} onClick={e => globalStore.setIsMobileNavOpen(false)}> <Home size={20} /> Home </Link>
            <Link href='/app/schedule' className={(pathname === '/app/schedule' ? active : nonActive)} onClick={e => globalStore.setIsMobileNavOpen(false)}> <CalendarRange size={20} /> Schedule </Link>
            <Link href='/app/employees' className={(pathname === '/app/employees' ? active : nonActive)} onClick={e => globalStore.setIsMobileNavOpen(false)}> <BookUser size={20} /> Employees </Link>
            <Link href='/app/reports' className={(pathname === '/app/reports' ? active : nonActive)} onClick={e => globalStore.setIsMobileNavOpen(false)}> <ScrollText size={20} /> Reports </Link>
            <Link href='/app/settings' className={(pathname === '/app/settings' ? active : nonActive)} onClick={e => globalStore.setIsMobileNavOpen(false)}> <Settings size={20} /> Settings </Link>
        </div>
    )
}

export default NavBar