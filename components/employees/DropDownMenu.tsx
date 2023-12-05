import React from 'react'
import { Employee } from '../../types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import useEmployeePageStore from '../../store/employeePageSlice'

function DropDownMenu({employee}: {employee: Employee}) {
    const useEmployeePageStoreState = useEmployeePageStore(state => state);
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='flex flex-col'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.id)}>
                        Copy Employee ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {useEmployeePageStoreState.setSelectedEmployee(employee); useEmployeePageStoreState.setIsDeleteEmployeeModalOpen(true);}}>
                        Delete Employee
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {useEmployeePageStoreState.setSelectedEmployee(employee); useEmployeePageStoreState.setIsEditEmployeeModalOpen(true);}}>
                        Edit Employee
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default DropDownMenu