'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password required').min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string().min(1, 'Password confirmation required').min(8, 'Password confirmation must be at least 8 characters'),
    ownerFirstName: z.string().min(1, 'First name is required'),
    ownerLastName: z.string().min(1, 'Last name is required'),
    businessName: z.string().min(1, 'Business name is required'),
    businessType: z.string().min(1, 'Business type is required'),
    streetLine1: z.string().min(1, 'Street address is required'),
    streetLine2: z.string(),
    city: z.string().min(1, 'City is required'),
    postCode: z.string().min(1, 'Post code is required'),
})


function SignupForm() {

    const [activeTab, setActiveTab] = useState("1");
    const [loading, setLoading] = useState(false);

    const { toast } = useToast()

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
            ownerFirstName: "",
            ownerLastName: "",
            businessName: "",
            businessType: "Other",
            streetLine1: "",
            streetLine2: "",
            city: "",
            postCode: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true);

        const {email, password, ownerFirstName, ownerLastName, businessName, businessType, streetLine1, streetLine2, city, postCode} = values;

        console.log(email, password)

        const response = await fetch('https://backend.shiftmate.tech/api/business/signup/', {
            method: 'POST',
            body: JSON.stringify({email, password, ownerFirstName, ownerLastName, businessName, businessType, streetLine1, streetLine2, city, postCode}),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech/' 
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
                title: "Successfully signed up!",
                description: json.message,
            });
            form.reset();
        }

        setLoading(false);
    }

    const switchToErrorTab = () => {
        const errors = form.formState.errors;
        const formValues = form.getValues();
        if (formValues.businessName === '' || formValues.ownerFirstName === '' || formValues.ownerLastName === '' || errors.businessName || errors.ownerFirstName || errors.ownerLastName) {
            setActiveTab('1');
        }
        else if (formValues.streetLine1 === '' || formValues.city === '' || formValues.postCode === '' || errors.streetLine1 || errors.city || errors.postCode) {
            setActiveTab('2');
        }
        else if (formValues.email === '' || formValues.password === '' || formValues.passwordConfirmation === '' || errors.email || errors.password || errors.passwordConfirmation) {
            setActiveTab('3');
        }
    }
    
    return (
        <div className='w-96'>

            <h1 className='text-2xl font-medium mb-3 text-center text-primary'>Signup to use ShiftMate</h1>

            <p className='text-center text-sm text-muted-foreground mb-8'>Enter your email, password and business details to signup</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, switchToErrorTab)} className="space-y-8">

                    <Tabs className="w-full" value={activeTab}>

                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="1" className='text-xs' onClick={(e) => setActiveTab('1')}>Business details</TabsTrigger>
                            <TabsTrigger value="2" className='text-xs' onClick={(e) => setActiveTab('2')}>Address</TabsTrigger>
                            <TabsTrigger value="3" className='text-xs' onClick={(e) => setActiveTab('3')}>Eamil/Password</TabsTrigger>
                        </TabsList>

                        <TabsContent value="1" className='space-y-8'>
                            <FormField
                                control={form.control}
                                name="businessName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business name</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Business name" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ownerFirstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input className='' type='string' placeholder="First name" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ownerLastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input className='' type='string' placeholder="Last name" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <div className='w-full flex justify-end'>
                                <Button className='w-1/3' onClick={(e) => setActiveTab('2')}>Next</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="2" className='space-y-8'>
                            <FormField
                                control={form.control}
                                name="streetLine1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street address</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Street address" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="streetLine2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street address 2</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Street address 2" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="City" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="postCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Post code</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Post code" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <div className='w-full flex justify-between'>
                            <Button className='w-1/3' onClick={(e) => setActiveTab('1')}>Back</Button>
                                <Button className='w-1/3' onClick={(e) => setActiveTab('3')}>Next</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="3" className='space-y-8'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
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
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password confirmation</FormLabel>
                                        <FormControl>
                                            <Input className='' type='password' placeholder="Password confirmation" {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />
                            
                            {loading ? (
                                <Button className='w-full' disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </Button>
                            ) : (
                                <Button className='w-full' disabled={loading} type='submit' >Signup</Button>
                            )}

                            
                        </TabsContent>

                    </Tabs>

                </form>
            </Form>
        </div>
    )
}

export default SignupForm