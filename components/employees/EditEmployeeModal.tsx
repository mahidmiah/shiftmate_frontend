'use client'

import useEmployeePageStore from '@/store/employeePageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { Form } from '../ui/form';
import { z } from 'zod';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { toast } from '../ui/use-toast';
import { Employee } from '@/types';

function EditEmployeeModal() {
    const useEmployeePageStoreState = useEmployeePageStore(state => state);

    const data = useEmployeePageStore(state => state.employeesData);
    
    const FormSchema = z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        currentPassword: z.string(),
        background: z.string(),
        foreground: z.string(),
        newPassword: z.string().optional(),
    })

    
    // 1. Define your form.
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: data[0]?.firstName,
            lastName: data[0]?.lastName,
            currentPassword: data[0]?.password,
            background: data[0]?.background,
            foreground: data[0]?.foreground,
            newPassword: '',
        },
    })

    useEffect(() => {
        if (useEmployeePageStoreState.selectedEmployee) {
            form.reset({
                firstName: useEmployeePageStoreState.selectedEmployee.firstName,
                lastName: useEmployeePageStoreState.selectedEmployee.lastName,
                currentPassword: useEmployeePageStoreState.selectedEmployee.password,
                background: useEmployeePageStoreState.selectedEmployee.background,
                foreground: useEmployeePageStoreState.selectedEmployee.foreground,
                newPassword: '',
            });
        }
    }, [useEmployeePageStoreState.selectedEmployee, form.reset]);

    const editEmployee = async (values: z.infer<typeof FormSchema>) => {
        const employeeID = useEmployeePageStoreState.selectedEmployee?.id;
        const { firstName, lastName, currentPassword, background, foreground } = values;
        const password = values.newPassword ? values.newPassword : currentPassword;
        const response = await fetch('https://backend.shiftmate.tech/api/employee/updateEmployee/', {
            method: 'POST',
            body: JSON.stringify({employeeID, firstName, lastName, password, background, foreground}),
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
                title: "Employee has been updated!",
                description: json.message,
            });

            const employee: Employee = {
                id: employeeID,
                firstName: firstName,
                lastName: lastName,
                password: password,
                background: background,
                foreground: foreground,
            }
    
            useEmployeePageStoreState.updateEmployee(employee);
            form.reset();
            useEmployeePageStoreState.setIsEditEmployeeModalOpen(false);
        }
    }

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        editEmployee(values);
    }

    return (
        <div>
            <Sheet open={useEmployeePageStoreState.isEditEmployeeModalOpen} onOpenChange={e => {
                useEmployeePageStoreState.setIsEditEmployeeModalOpen(e);
                if (!e) {
                    form.reset();
                }
            }}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit employee</SheetTitle>
                        <SheetDescription>
                            Edit an existing employee.
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
                                name="background"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Background</FormLabel>
                                        <FormControl>
                                            <Input type='color' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="foreground"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Forground</FormLabel>
                                        <FormControl>
                                            <Input type='color' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <Input className='' placeholder="New password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Update employee</Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default EditEmployeeModal