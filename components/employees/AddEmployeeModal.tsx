import React from 'react'
import useEmployeePageStore from '@/store/employeePageSlice'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { z } from 'zod';
import getRandomColors from '@/utils/randomColorGen';
import { zodResolver } from '@hookform/resolvers/zod';
import { generate } from 'generate-password';
import { useForm } from 'react-hook-form';
import { toast } from '../ui/use-toast';
import { Employee } from '@/types';

function AddEmployeeModal() {
    const useEmployeePageStoreState = useEmployeePageStore(state => state);

    const formSchema = z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        password: z.string(),
        background: z.string(),
        foreground: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            password: generate({
                length: 16,
                numbers: true,
                symbols: true,
                uppercase: true,
                lowercase: true,
            }),
            background: getRandomColors().bgColor,
            foreground: getRandomColors().fgColor,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values)
        // form.reset();

        await addEmployee(values);

        // useEmployeePageStoreState.setIsAddEmployeeModalOpen(false);
    }

    const addEmployee = async (values: z.infer<typeof formSchema>) => {
        const { firstName, lastName, password, background, foreground } = values;
        const response = await fetch('https://shiftmate-backend.onrender.com/api/employee/addEmployee/', {
            method: 'POST',
            body: JSON.stringify({firstName, lastName, password, background, foreground}),
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
                title: "Employee has been added!",
                description: json.message,
            });
            const id = json.employee._id;
            const newEmployee: Employee = {id, firstName, lastName, password, background, foreground}
            useEmployeePageStoreState.addEmployee(newEmployee);
            form.reset();
            useEmployeePageStoreState.setIsAddEmployeeModalOpen(false);
        }
    }

    return (
        <div>
            <Sheet open={useEmployeePageStoreState.isAddEmployeeModalOpen} onOpenChange={(open) => {
                useEmployeePageStoreState.setIsAddEmployeeModalOpen(open);
                if (!open) {
                    form.reset({
                        firstName: "",
                        lastName: "",
                        password: generate({
                            length: 8,
                            numbers: true,
                            symbols: true,
                            uppercase: true,
                        }),
                        background: getRandomColors().bgColor,
                        foreground: getRandomColors().fgColor,
                    });
                }
            }}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Add employee</SheetTitle>
                        <SheetDescription>
                            Add a new employee to be managed.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="First name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Last name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Add employee</Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default AddEmployeeModal