import useGlobalStore from '@/store/globalSlice';
import useSchedulePageStore from '@/store/schedulePageSlice';
import React from 'react'
import { toast } from '../ui/use-toast';
import { Shift } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

function DeleteShiftModal() {

    const useSchedulePageStoreState = useSchedulePageStore(state => state);
    const globalStore = useGlobalStore(state => state);

    const handleDeleteShift = async () => {
        const shiftID = useSchedulePageStoreState.selectedShift?._id;
        const response = await fetch('https://shiftmate-backend.onrender.com/api/shift/deleteShift/', {
            method: 'POST',
            body: JSON.stringify({shiftID}),
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
            toast({
                className: "absolute top-0 right-0",
                variant: "success",
                title: "Shift has been deleted!",
                description: json.message,
            });
            const shifts = globalStore.currentLocalWeeks[`${globalStore.currentYear}_${globalStore.currentWeek}`] as Shift[];
            const shiftsWithShiftRemoved = shifts.filter((shift) => shift._id !== shiftID);
            globalStore.setCurrentLocalWeeks({[`${globalStore.currentYear}_${globalStore.currentWeek}`]: shiftsWithShiftRemoved});
            useSchedulePageStoreState.setIsDeleteShiftModalOpen(false);
        }
    }

    return (
        <div>
            <AlertDialog open={useSchedulePageStoreState.isDeleteShiftModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the shift: {useSchedulePageStoreState.selectedShift._id}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={e => useSchedulePageStoreState.setIsDeleteShiftModalOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className=' bg-destructive text-destructive-foreground hover:bg-destructive/90' onClick={handleDeleteShift}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default DeleteShiftModal