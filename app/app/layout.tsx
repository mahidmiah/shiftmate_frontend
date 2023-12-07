'use client'

import LogoutButton from "@/components/LogoutButton";
import MobileNavBar from "@/components/MobileNavBar";
import NavBar from "@/components/NavBar";
import { Button, buttonVariants } from "@/components/ui/button";
import useGlobalStore from "@/store/globalSlice";
import { LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Employee, profile } from "@/types";
import useEmployeePageStore from "@/store/employeePageSlice";

export default function ApplLayout({children,}: {children: React.ReactNode}) {

    const globalStore = useGlobalStore(state => state);
    const useEmployeePageStoreState = useEmployeePageStore(state => state);

    const getAllPositions = async () => {
        const response = await fetch('https://backend.shiftmate.tech/api/business/getAllPositions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech/' 
            },
            credentials: "include"
        });
        const data = await response.json()
        const positions: string[] = data.positions;
        globalStore.setPositionsData(positions);
    }

    const getEmployees = async () => {
        if (useEmployeePageStoreState.employeesData.length === 0) {
            const response = await fetch('https://backend.shiftmate.tech/api/employee/getAllEmployees/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech' 
                },
                credentials: "include"
            });
            const data = await response.json()
            const employees: Employee[] = data.employees.map((result: any) => {
                const { _id, firstName, lastName, password, background, foreground } = result
                return {
                    id: _id,
                    firstName,
                    lastName,
                    password,
                    background,
                    foreground,
                }
            })
            useEmployeePageStoreState.setEmployeesData(employees);
        }
    }

    const getProfileData = async () => {
        const response = await fetch('https://backend.shiftmate.tech/api/profile/getProfile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech/' 
            },
            credentials: "include"
        });
        const data = await response.json();
        return data.business;
    }

    useEffect(() => {
        getProfileData().then(data => {
            console.log(data);
            const profile: profile = {
                businessName: data.businessName,
                firstName: data.ownerFirstName,
                lastName: data.ownerLastName,
                streetLine1: data.businessAddress.streetLine1,
                streetLine2: data.businessAddress.streetLine2,
                city: data.businessAddress.city,
                postCode: data.businessAddress.postCode,
                numberOfShifts: data.shifts.length,
            }
            globalStore.setProfileData(profile);
        });
        getEmployees();
        getAllPositions();
    }, [])

    return (
        <section className="w-full h-screen flex-col overflow-hidden">

            {/* Topbar */}
            <div className="w-full h-16 border-b-2 borer-border fixed flex items-center justify-between px-4 lg:px-8 bg-white">

                <MobileNavBar />
                
                <Link className="hidden lg:flex items-center gap-x-2" href={'/app/home'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="#1157ee" />
                        <polygon points="50,30 60,50 50,70 40,50" fill="#FFF" />
                    </svg>
                    <p className="text-xl font-semibold text-primary">ShiftMate</p>
                </Link>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" className="gap-x-2"> <LifeBuoy size={18} /> Help</Button>
                    <LogoutButton />
                </div>
            </div>

            {/* Content container */}
            <div className="w-full h-full pt-16 flex">
                {/* Sidebar */}
                <div className="w-72 h-full border-r-200 border-border hidden lg:flex"><NavBar /></div>

                {/* content */}
                <div className="w-full h-full p-8 pb-16 lg:pb-8 overflow-auto">{children}</div>
            </div>

        </section>
    )
}