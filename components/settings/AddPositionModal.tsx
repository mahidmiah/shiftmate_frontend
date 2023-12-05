import usePositionsTabStore from '@/store/PositionsTabSlice';
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import useGlobalStore from '@/store/globalSlice';

function AddPositionModal() {

    const usePositionsTabState = usePositionsTabStore(state => state);
    const globalStore = useGlobalStore(state => state);

    const addNewPosition = async (values: z.infer<typeof formSchema>) => {
        const { position } = values;
        const response = await fetch('http://localhost:4000/api/business/addPosition/', {
            method: 'POST',
            body: JSON.stringify({name: position}),
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
                title: "Position has been added!",
                description: json.message,
            });
            const exisingPositions = globalStore.positionsData;
            const newPositions = [...exisingPositions, position];
            globalStore.setPositionsData(newPositions);
            usePositionsTabState.setIsAddPositionModalOpen(false);
            form.reset();
        }
    }
    
    const formSchema = z.object({
        position: z.string().min(1, 'Position is required'),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            position: "",
        },
    })

    return (
        <div>
            <Sheet open={usePositionsTabState.isAddPositionModalOpen} onOpenChange={(open) => {
                usePositionsTabState.setIsAddPositionModalOpen(open);
                if (!open) {
                    form.reset({
                        position: "",
                    });
                }
            }}>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>Add position</SheetTitle>
                        <SheetDescription>
                            Add a new position.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addNewPosition)} className="space-y-8">
                                <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position name</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Position name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Add position</Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default AddPositionModal