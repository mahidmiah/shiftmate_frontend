'use client';

import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { toast } from './ui/use-toast';

function LogoutButton() {

    const logout = async () => {
        const response = await fetch('https://shiftmate-backend.onrender.com/api/business/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://shiftmate-backend.onrender.com/' 
            },
            credentials: "include"
        });

        const json = await response.json();

        if (!response.ok) {
            toast({
                className: "absolute top-0 right-0",
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: json.error,
            });
        }

        if (response.ok) {
            toast({
                className: "absolute top-0 right-0",
                variant: "success",
                title: "Successfully logged out!",
                description: json.message,
            });
        }
    }

    return (
        <Link className={'text-md ' + buttonVariants({ variant: "ghost" }) } href={'/auth/login'} onClick={logout}>Log out</Link>
    )
}

export default LogoutButton