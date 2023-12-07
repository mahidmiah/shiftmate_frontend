import useSchedulePageStore from '@/store/schedulePageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import useGlobalStore from '@/store/globalSlice';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import useEmployeePageStore from '@/store/employeePageSlice';
import { toast } from '../ui/use-toast';
import { weeklyFinance } from '@/types';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

function AddFinanceModal() {

    const useSchedulePageStoreState = useSchedulePageStore(state => state);
    const globalStore = useGlobalStore(state => state);

    const formSchema = z.object({
        day: z.string(),
        cash: z.number().or(z.string()),
        uber: z.number().or(z.string()),
        expense: z.number().or(z.string()),
        notes: z.string().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cash: 0,
            uber: 0,
            expense: 0,
            notes: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch('https://backend.shiftmate.tech/api/week/addFinancials', {
            method: 'POST',
            body: JSON.stringify({
                year: globalStore.currentYear as number, 
                weekNumber: globalStore.currentWeek as number, 
                dayOfWeek: values.day, 
                income: Number(values.cash) || 0, 
                uber: Number(values.uber) || 0, 
                expense: Number(values.expense) || 0, 
                notes: values.notes
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech/' 
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
                title: "Finances have been updated!",
                description: json.message,
            });
            useSchedulePageStoreState.setIsAddFinanceModalOpen(false);
            form.reset();
            const data = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`];
            const day_ = values.day[0].toUpperCase() + values.day.slice(1) as keyof weeklyFinance;
            data[day_] = {
                income: Number(values.cash) || 0, 
                uber: Number(values.uber) || 0, 
                expense: Number(values.expense) || 0, 
                notes: values.notes
            }
            globalStore.setCurrentLocalWeekFinance({...globalStore.currentLocalWeekFinance, [`${globalStore.currentYear}_${globalStore.currentWeek}`]: data});
        }
    }

    return (
        <div>
            <Sheet open={useSchedulePageStoreState.isAddFinanceModalOpen} onOpenChange={(open) => {
                useSchedulePageStoreState.setIsAddFinanceModalOpen(open);
                if (!open) {
                    form.reset({
                        cash: 0,
                        uber: 0,
                        expense: 0,
                        notes: "",
                    });
                }
            }}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Add shift</SheetTitle>
                        <SheetDescription>
                            Add a new shift.
                        </SheetDescription>
                        <div className="grid gap-4 py-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                    <FormField
                                    control={form.control}
                                    name="day"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Day</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a day" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value={'monday'}>Monday</SelectItem>
                                                            <SelectItem value={'tuesday'}>Tuesday</SelectItem>
                                                            <SelectItem value={'wednesday'}>Wednesday</SelectItem>
                                                            <SelectItem value={'thursday'}>Thursday</SelectItem>
                                                            <SelectItem value={'friday'}>Friday</SelectItem>
                                                            <SelectItem value={'saturday'}>Saturday</SelectItem>
                                                            <SelectItem value={'sunday'}>Sunday</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="cash"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cash</FormLabel>
                                            <FormControl>
                                                <Input className='' placeholder="Cash" {...field} type='number' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="uber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Uber</FormLabel>
                                            <FormControl>
                                                <Input className='' placeholder="Uber" {...field} type='number' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="expense"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expense</FormLabel>
                                            <FormControl>
                                                <Input className='' placeholder="Expense" {...field} type='number' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea className='' placeholder="Notes" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <div className='h-4'></div>
                                    <Button className='px-8' type="submit">Update</Button>
                                </form>
                            </Form>
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default AddFinanceModal