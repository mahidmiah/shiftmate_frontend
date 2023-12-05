'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';
import useEmployeePageStore from '@/store/employeePageSlice';
import useGlobalStore from '@/store/globalSlice';
import { GanttChartSquare, MapPin, User } from 'lucide-react'
import React from 'react'

function Page() {

    const EmployeeSliceState = useEmployeePageStore(state => state);
    const globalStore = useGlobalStore(state => state);

    return (
        <div>
            <h1 className='text-4xl font-medium'>Welcome back, {globalStore.profileData.firstName}</h1>
            <p className='flex items-center gap-x-2 mt-4'> <MapPin size={20} /> Stroudey Grill & PFC</p>

            <Separator className='my-4' />

            <div className='flex gap-x-8'>
                <Card className='max-w-[300px] mt-8'>
                    <CardHeader>
                        <CardTitle>Number of employess</CardTitle>
                        <CardDescription>Number of regiested employees being managed by your business.</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center gap-y-4'>
                        <User size={64}/>
                        <h1 className='text-2xl font-medium'>{EmployeeSliceState.employeesData.length} employees</h1>
                    </CardContent>
                </Card>

                <Card className='max-w-[300px] mt-8'>
                    <CardHeader>
                        <CardTitle>Shifts managed</CardTitle>
                        <CardDescription>Number of shifts that have been managed by your business.</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center gap-y-4'>
                        <GanttChartSquare size={64}/>
                        <h1 className='text-2xl font-medium'>{globalStore.profileData.numberOfShifts} shifts</h1>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Page