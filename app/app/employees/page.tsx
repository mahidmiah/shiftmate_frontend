import React from 'react'
import EmployeeTable from '@/components/employees/EmployeeTable'
import { Separator } from '@/components/ui/separator'

function Page() {
        
    return (
        <div className=''>
            <h1 className='text-4xl font-medium'>Employees</h1>
            <p className='text-muted-foreground mt-4'>View, edit, and add employees to be managed.</p>
            <Separator className='mt-2' />
            <div className='w-full flex items-center justify-between mt-8'>
                <p className='text-2xl font-medium'>Employee managment</p>
            </div>
            <EmployeeTable />
        </div>
    )
}

export default Page