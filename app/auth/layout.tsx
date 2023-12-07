'use client'

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image'
import auth_hero_2 from '@/public/auth_hero_2.png'

export default function AuthLayout({children,}: {children: React.ReactNode}) {

    const pathname = usePathname()

    return (
        <section className='w-screen h-screen flex'>

            <div className="h-full hidden w-1/2 bg-primary xl:flex flex-col justify-between text-secondary p-8">
                <div className="flex items-center gap-x-2">
                    <div className='flex flex-col items-center justify-center text-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="#FFF" />
                            <polygon points="50,30 60,50 50,70 40,50" fill="#1157ee" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold">ShiftMate</p>
                </div>
                <div className="overflow-hidden flex items-center justify-center pb-16">
                    <Image
                        src={auth_hero_2}
                        alt="Picture of the author"
                        // width={500} automatically provided
                        // height={500} automatically provided
                        // blurDataURL="data:..." automatically provided
                        // placeholder="blur" // Optional blur-up while loading
                    />
                </div>
                <div className="font-medium pb-8">
                    <p className="text-lg mt-4">&quot;ShiftMate has been a game-changer for managing shifts! This app is incredibly efficient and has saved me so much time. With its user-friendly interface and powerful features, I can easily schedule and organize shifts for my team. It&apos;s a must-have tool for any business owner or manager.&quot;</p>
                    <p className="text-lg mt-4">~ Sofia Davis</p>
                </div>
            </div>

            <div className="h-full w-full xl:w-1/2 overflow-hidden relative">

                <div className="absolute w-full top-8 px-8 flex justify-between xl:justify-end items-center">
                    <div className="flex items-center gap-x-2 xl:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="#1157ee" />
                            <polygon points="50,30 60,50 50,70 40,50" fill="#FFF" />
                        </svg>
                        <p className="text-3xl font-bold text-primary">ShiftMate</p>
                    </div>
                    <Link className={buttonVariants({ variant: "ghost" })} href={pathname === '/auth/signup' ? "/auth/login" : "/auth/signup"}>{pathname === '/auth/signup' ? "Login" : "Signup"}</Link>
                </div>

                {children}   

            </div>

        </section>
    )
}