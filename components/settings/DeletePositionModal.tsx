'use client'

import React, { use } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import usePositionsTabStore from '@/store/PositionsTabSlice';
import { toast } from '../ui/use-toast';
import useGlobalStore from '@/store/globalSlice';

function DeletePositionModal() {

    const usePositionsTabState = usePositionsTabStore(state => state); 
    const globalStore = useGlobalStore(state => state);

    const deletePosition = async (position: string) => {
        const response = await fetch('http://localhost:4000/api/business/deletePosition', {
            method: 'POST',
            body: JSON.stringify({positionID: position}),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:4000' 
            },
            credentials: "include"
        });
        const json = await response.json()
        
        if (!response.ok) {
            toast({
                className: "absolute top-0 right-0",
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: json.error,
            });
            console.log(json.error)
        }

        if (response.ok) {
            toast({
                className: "absolute top-0 right-0",
                variant: "success",
                title: "Position has been deleted!",
                description: json.message,
            });
            const exisingPositions = globalStore.positionsData;
            const newPositions = exisingPositions.filter((item) => item !== position);
            globalStore.setPositionsData(newPositions);
            usePositionsTabState.setIsDeletePositionModalOpen(false);
            usePositionsTabState.setSelectedPosition('');
        }
    }

    return (
        <div>
            <AlertDialog open={usePositionsTabState.isDeletePositionModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the position <span className='font-bold'>{usePositionsTabState.selectedPosition}</span> and remove all shifts linked to this position.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={e => usePositionsTabState.setIsDeletePositionModalOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className=' bg-destructive text-destructive-foreground hover:bg-destructive/90' onClick={() => deletePosition(usePositionsTabState.selectedPosition)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default DeletePositionModal