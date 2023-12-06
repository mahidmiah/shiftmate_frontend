import React, { use } from 'react'
import useEmployeePageStore from '../../store/employeePageSlice'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { toast } from '../ui/use-toast';
import useGlobalStore from '@/store/globalSlice';
import { Shift } from '@/types';

function DeleteEmployeeModal() {
    const useEmployeePageStoreState = useEmployeePageStore(state => state);
    const globalStore = useGlobalStore(state => state);

    const handleDeleteEmployee = async () => {
        const employeeID = useEmployeePageStoreState.selectedEmployee?.id;
        const response = await fetch('https://shiftmate-backend.onrender.com/api/employee/deleteEmployee/', {
            method: 'POST',
            body: JSON.stringify({employeeID}),
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
                title: "Employee has been deleted!",
                description: json.message,
            });
            const employee = useEmployeePageStoreState.selectedEmployee;
            const shifts = globalStore.currentLocalWeeks[`${globalStore.currentYear}_${globalStore.currentWeek}`] as Shift[];
            const shiftsWithEmployeeRemoved = shifts.filter((shift) => shift.employeeID !== employee?.id);
            globalStore.setCurrentLocalWeeks({[`${globalStore.currentYear}_${globalStore.currentWeek}`]: shiftsWithEmployeeRemoved});
            useEmployeePageStoreState.removeEmployee(employee);
            useEmployeePageStoreState.setIsDeleteEmployeeModalOpen(false);
        }
    }

    return (
        <div>
            <AlertDialog open={useEmployeePageStoreState.isDeleteEmployeeModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {useEmployeePageStoreState.selectedEmployee?.firstName} {useEmployeePageStoreState.selectedEmployee?.lastName} &apos;s
                            account (id: {useEmployeePageStoreState.selectedEmployee?.id}) and remove all shifts linked to this employee.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={e => useEmployeePageStoreState.setIsDeleteEmployeeModalOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className=' bg-destructive text-destructive-foreground hover:bg-destructive/90' onClick={handleDeleteEmployee}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default DeleteEmployeeModal