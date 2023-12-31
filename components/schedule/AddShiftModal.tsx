import useSchedulePageStore from '@/store/schedulePageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import useGlobalStore from '@/store/globalSlice';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import useEmployeePageStore from '@/store/employeePageSlice';
import { useMemo } from 'react';
import { toast } from '../ui/use-toast';

function AddShiftModal() {

    const useSchedulePageStoreState = useSchedulePageStore(state => state);
    const globalStore = useGlobalStore(state => state);
    const employeeStore = useEmployeePageStore(state => state);
    const [loading, setLoading] = React.useState(false);

    // Generate start times from 00:00 to 24:00 in increments of 30 minutes
    const generateStartTimes = () => {
        const startTimes = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                const startTime = `${formattedHour}:${formattedMinute}`;
                startTimes.push(startTime);
            }
        }

        startTimes.push('24:00');
        return startTimes;
    };

    const convertToTime = (time: string) => {
        const [hour, minute] = time.split(':');
        if (minute === '00') {
            return Number(hour);
        }
        else {
            return Number(hour) + 0.5;
        }
    }

    const formSchema = z.object({
        employeeId: z.string().min(1, 'Employee is required'),
        position: z.string().min(1, 'Position is required'),
        startTime: z.string().min(1, 'Start time is required'),
        endTime: z.string().min(1, 'End time is required'),
        day: z.string().min(1, 'Day is required'),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            employeeId: "",
            position: "",
            startTime: "",
            endTime: "",
            day: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);

        if (convertToTime(values.startTime) >= convertToTime(values.endTime)) {
            toast({
                className: "absolute top-0 right-0",
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Start time must be before end time.",
            });
            setLoading(false);
            return;
        }

        const { employeeId, position, startTime, endTime, day } = values;
        const response = await fetch('https://backend.shiftmate.tech/api/shift/addShift/', {
            method: 'POST',
            body: JSON.stringify({
                employeeID: employeeId,
                year: globalStore.currentYear,
                weekNumber: globalStore.currentWeek,
                position: position,
                dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
                startTime: startTime,
                endTime: endTime,
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
                title: "Shift has been added!",
                description: json.message,
            });
            let shifts = globalStore.currentLocalWeeks[`${globalStore.currentYear}_${globalStore.currentWeek}`] as Array<[]>;
            if (!shifts) {
                shifts = [];
            }
            shifts.push(json.shift);
            globalStore.setCurrentLocalWeeks({[`${globalStore.currentYear}_${globalStore.currentWeek}`]: shifts});
            form.reset();
            useSchedulePageStoreState.setIsAddShiftModalOpen(false);
        }
        setLoading(false);
    }

    const Spinner = () => (
        <div className="spinner"></div>
    );

    return (
        <div>
            <Sheet open={useSchedulePageStoreState.isAddShiftModalOpen} onOpenChange={(open) => {
                useSchedulePageStoreState.setIsAddShiftModalOpen(open);
                if (!open) {
                    form.reset({
                        employeeId: "",
                        position: "",
                        startTime: "",
                        endTime: "",
                        day: "",
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
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                        control={form.control}
                                        name="employeeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Employee</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select an employee" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {employeeStore.employeesData
                                                                    .sort((a, b) => a.firstName.localeCompare(b.firstName))
                                                                    .map((employee) => (
                                                                        <SelectItem key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</SelectItem>
                                                                    ))}
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
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a position" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {globalStore.positionsData.map((position) => (
                                                                    <SelectItem key={position} value={position}>{position}</SelectItem>
                                                                ))}
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
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start time</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a start time" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {generateStartTimes().map((time) => (
                                                                    <SelectItem key={time + '+'} value={time}>{time}</SelectItem>
                                                                ))}
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
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End time</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select an end time" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {generateStartTimes().map((time) => (
                                                                    <SelectItem key={time + '-'} value={time}>{time}</SelectItem>
                                                                ))}
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
                                    <Button className='w-32' disabled={loading} type="submit">{loading ? <Spinner /> : 'Add shift'}</Button>
                                </form>
                            </Form>
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default AddShiftModal