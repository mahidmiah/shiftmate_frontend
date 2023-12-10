'use client';

import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import useEmployeePageStore from '@/store/employeePageSlice';
import { Employee, Shift, profile } from "@/types";
import useGlobalStore from '@/store/globalSlice';
import usePositionsTabStore from '@/store/PositionsTabSlice';
import useSchedulePageStore from '@/store/schedulePageSlice';

function LogoutButton() {

    const router = useRouter();
    const useEmployeeState = useEmployeePageStore(state => state);
    const useGlobalState = useGlobalStore(state => state);
    const usePositionState = usePositionsTabStore(state => state);
    const useScheduleState = useSchedulePageStore(state => state);

    const logout = async () => {
        const response = await fetch('https://backend.shiftmate.tech/api/business/logout/', {
            method: 'POST',
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
                title: "Successfully logged out!",
                description: json.message,
            });
            router.push('/auth/login');
            
            // Reset employee state
            useEmployeeState.setEmployeesData([]);
            useEmployeeState.setSelectedEmployee([] as unknown as Employee);

            // Reset global state
            useGlobalState.setProfileData({} as unknown as profile);
            useGlobalState.setPositionsData([]);
            useGlobalState.setCurrentLocalWeeks([]);
            useGlobalState.setCurrentLocalWeekFinance([]);

            // Reset position state
            usePositionState.setSelectedPosition('');

            // Reset schedule state
            useScheduleState.setSelectedShift({} as unknown as Shift);
        }
    }

    return (
        // <Link className={'text-md ' + buttonVariants({ variant: "ghost" }) } href={'/auth/login'} onClick={logout}>Log out</Link>
        <button className={'text-md ' + buttonVariants({ variant: "ghost" }) } onClick={logout}>Log out</button>
    )
}

export default LogoutButton