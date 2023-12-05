import Positions from '@/components/settings/Positions'
import ProfileForm from '@/components/settings/ProfileForm'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

function Page() {
    return (
        <div>
            <h1 className='text-4xl font-medium'>Settings</h1>
            <p className='mt-2'> Edit your business settings.</p>
            <Separator className='my-4' />

            <Tabs defaultValue="profile" className="">
                <TabsList className='w-full flex justify-start'>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="positions">Positions</TabsTrigger>
                </TabsList>
                <TabsContent value="profile"><ProfileForm /></TabsContent>
                <TabsContent value="positions"><Positions /></TabsContent>
            </Tabs>
        </div>
    )
}

export default Page