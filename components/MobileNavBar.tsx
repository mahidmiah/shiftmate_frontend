'use client';

import React from 'react'
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader } from './ui/sheet';
import Link from 'next/link';
import NavBar from './NavBar';
import useGlobalStore from '@/store/globalSlice';
import { Menu } from 'lucide-react';

function MobileNavBar() {
    const globalStore = useGlobalStore(state => state);
    return (
        <div className='lg:hidden'>
            <Button variant={'ghost'} className="lg:hidden" onClick={e => globalStore.setIsMobileNavOpen(true)}><Menu /></Button>

            <Sheet open={globalStore.isMobileNavOpen} onOpenChange={e => {
                globalStore.setIsMobileNavOpen(e);
            }}>
                <SheetContent side={'left'} className="w-72">
                    <SheetHeader>
                        <Link className="flex items-center justify-center gap-x-2 mt-16" href={'/app/home'} onClick={e => globalStore.setIsMobileNavOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="#1157ee" />
                                <polygon points="50,30 60,50 50,70 40,50" fill="#FFF" />
                            </svg>
                            <p className="text-xl font-semibold text-primary">ShiftMate</p>
                        </Link>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <NavBar />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNavBar