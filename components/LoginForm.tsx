'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password required').min(8, 'Password must be at least 8 characters'),
})

function LoginForm() {

    const [loading, setLoading] = React.useState(false)

    const { toast } = useToast()
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true);

        const {email, password} = values;

        console.log(email, password)

        const response = await fetch('https://shiftmate-backend.onrender.com/api/business/login/', {
            method: 'POST',
            body: JSON.stringify({email, password}),
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
            form.reset();
        }

        if (response.ok) {
            toast({
                className: "absolute top-0 right-0",
                variant: "success",
                title: "Successfully logged in!",
                description: json.message,
            });
            form.reset();
            router.push('/app/home');
        }

        setLoading(false);
    }

    return (
        <div className='w-96'>

            <h1 className='text-2xl font-medium mb-3 text-center text-primary'>Login to your account</h1>

            <p className='text-center text-sm text-muted-foreground mb-8'>Enter your email address and password to login</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input className='' placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input className='' type='password' placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    {loading ? (
                        <Button className='w-full' disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait...
                        </Button>
                    ) : (
                        <Button className='w-full' disabled={loading} type='submit' >Login</Button>
                    )}
                </form>
            </Form>
        </div>
    )
}

export default LoginForm