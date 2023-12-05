'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'

import useGlobalStore from '@/store/globalSlice'
import { toast } from '../ui/use-toast'

function ProfileForm() {

    const globalStore = useGlobalStore(state => state);

    // TODO - update local state and backend state
    const updateProfile = async (values: z.infer<typeof formSchema>) => {
        const { businessName, firstName, lastName, addressLine1, addressLine2, city, postCode } = values;
        const response = await fetch('http://localhost:4000/api/profile/updateProfile', {
            method: 'POST',
            body: JSON.stringify({
                businessName,
                streetLine1: addressLine1,
                streetLine2: addressLine2,
                city,
                postCode,
                ownerFirstName: firstName,
                ownerLastName: lastName,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:4000' 
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
            globalStore.setProfileData({
                businessName,
                firstName,
                lastName,
                streetLine1: addressLine1,
                streetLine2: addressLine2 || '',
                city,
                postCode,
                numberOfShifts: 0
            });
            toast({
                className: "absolute top-0 right-0",
                variant: "success",
                title: "Profile has been updated!",
                description: json.message,
            });
            console.log('Profile has been updated!')
        }

        console.log('End');
    }

    const formSchema = z.object({
        businessName: z.string().min(1, 'Business name is required'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        addressLine1: z.string().min(1, 'Address is required'),
        addressLine2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        postCode: z.string().min(1, 'Post code is required'),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            businessName: globalStore.profileData.businessName,
            firstName: globalStore.profileData.firstName,
            lastName: globalStore.profileData.lastName,
            addressLine1: globalStore.profileData.streetLine1,
            addressLine2: globalStore.profileData.streetLine2,
            city: globalStore.profileData.city,
            postCode: globalStore.profileData.postCode,
        },
    })

    useEffect(() => {
        if (globalStore.profileData) {
            form.reset({
                businessName: globalStore.profileData.businessName,
                firstName: globalStore.profileData.firstName,
                lastName: globalStore.profileData.lastName,
                addressLine1: globalStore.profileData.streetLine1,
                addressLine2: globalStore.profileData.streetLine2,
                city: globalStore.profileData.city,
                postCode: globalStore.profileData.postCode,
            });
            console.log('POST CODE:', globalStore.profileData.postCode)
        }
    }, [globalStore.profileData, form.reset]);

    return (
        <div className="max-w-[600px] mt-6">

            <Card>
                <CardHeader>
                    <CardTitle>Business profile</CardTitle>
                    <CardDescription>Update your business profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-4">
                            <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business name</FormLabel>
                                    <FormControl>
                                        <Input className='' placeholder="Business name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Separator />
                            <div className='flex gap-x-4'>
                                <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className='w-1/2'>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="First name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className='w-1/2'>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Last name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <Separator />
                            <div className='flex gap-x-4'>
                                <FormField
                                control={form.control}
                                name="addressLine1"
                                render={({ field }) => (
                                    <FormItem className='w-1/2'>
                                        <FormLabel>Address line 1</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Address line 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="addressLine2"
                                render={({ field }) => (
                                    <FormItem className='w-1/2'>
                                        <FormLabel>Address line 2</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Address line 2 (optional)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div className='flex gap-x-4 pb-4'>
                                <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem className='w-1/2'>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="City" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="postCode"
                                render={({ field }) => (
                                    <FormItem className='w-1/2'>
                                        <FormLabel>postcode</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="postcode" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <Button type="submit">Update</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            
        </div>
    )
}

export default ProfileForm
