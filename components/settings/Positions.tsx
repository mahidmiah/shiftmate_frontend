
'use client'

import useGlobalStore from '@/store/globalSlice';
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowDown, ArrowUp, Delete, Plus, XSquare } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import { toast } from '../ui/use-toast';
import AddPositionModal from './AddPositionModal';
import usePositionsTabStore from '@/store/PositionsTabSlice';
import DeletePositionModal from './DeletePositionModal';

function Positions() {

    const globalStore = useGlobalStore(state => state);
    const usePositionsTabState = usePositionsTabStore(state => state);

    const handleMovePosition = (index: number, direction: string) => {
        if(globalStore.positionsData) {
            const newPositionArray = [...globalStore.positionsData];
            if (direction === 'up' && index > 0) {
                // Swap the position with the one above
                [newPositionArray[index], newPositionArray[index - 1]] = [newPositionArray[index - 1], newPositionArray[index]];
                console.log('Up called')
            } else if (direction === 'down' && index < newPositionArray.length - 1) {
                // Swap the position with the one below
                [newPositionArray[index], newPositionArray[index + 1]] = [newPositionArray[index + 1], newPositionArray[index]];
                console.log('Down called')
            }
            globalStore.setPositionsData(newPositionArray);
        }
    };

    const updatePositions = async () => {
        const response = await fetch('https://shiftmate-backend.onrender.com/api/business/updatePositions', {
            method: 'POST',
            body: JSON.stringify({positions: globalStore.positionsData}),
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
        }

        if (response.ok) {
            toast({
                className: "absolute top-0 right-0",
                variant: "success",
                title: "Positions have been updated!",
                description: json.message,
            });
        }
    }
    
    return (
        <div className='mt-6'>
            <Card className='max-w-[600px]'>
                <CardHeader className='flex flex-row justify-between'>
                    <div>
                        <CardTitle>Positions</CardTitle>
                        <CardDescription>Add, delete, and edit the order of positions in your business.</CardDescription>
                    </div>
                    <Button className='text-sm flex items-center gap-x-2' onClick={() => usePositionsTabState.setIsAddPositionModalOpen(true)}><Plus size={16} /> Add position</Button>
                </CardHeader>
                <CardContent>
                    {
                        globalStore.positionsData.map((position, index) => {
                            return (
                                <div key={index} className='flex justify-between items-center border my-1 px-2 py-1 rounded-md'>
                                    <p className='text-md'>{position}</p>
                                    <div className='flex space-x-2'>
                                        <button onClick={() => {
                                            usePositionsTabState.setSelectedPosition(position);
                                            usePositionsTabState.setIsDeletePositionModalOpen(true);
                                        }} className='text-destructive hover:text-destructive/75 mr-4' ><XSquare size={20} /></button>
                                        <button onClick={() => handleMovePosition(index, 'up')} className='text-primary hover:text-primary/75' ><ArrowUp size={20} /></button>
                                        <button onClick={() => handleMovePosition(index, 'down')} className='text-primary hover:text-primary/75' ><ArrowDown size={20} /></button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Button className='mt-4' onClick={updatePositions}>Update</Button>
                </CardContent>
            </Card>

            <AddPositionModal />
            <DeletePositionModal />
        </div>
    )
}

export default Positions