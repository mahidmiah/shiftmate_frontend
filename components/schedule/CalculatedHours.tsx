import useEmployeePageStore from '@/store/employeePageSlice';
import useGlobalStore from '@/store/globalSlice';
import { Shift } from '@/types';
import React, { useEffect } from 'react'
import { Separator } from '../ui/separator';

function CalculatedHours() {

    const useEmployeePageStoreState = useEmployeePageStore(state => state);
    const globalStore = useGlobalStore(state => state);

    const convertToTime = (time: string) => {
        const [hour, minute] = time.split(':');
        if (minute === '00') {
            return Number(hour);
        }
        else {
            return Number(hour) + 0.5;
        }
    }
    
    useEffect(() => {
        const employees = useEmployeePageStoreState.employeesData;
        const shifts = globalStore.currentLocalWeeks[`${globalStore.currentYear}_${globalStore.currentWeek}`] as Shift[];
        for (const employee of employees) {
            if (shifts) {
                const shiftsForEmployee = shifts.filter((shift) => shift.employeeID === employee.id);
                let totalHours = 0;
                for (const shift of shiftsForEmployee) {
                    totalHours += (convertToTime(shift.endTime) - convertToTime(shift.startTime));
                }
                employee.totalHours = totalHours;
            }
            else {
                employee.totalHours = 0;
            }
        }
    }, [useEmployeePageStoreState.employeesData, globalStore.currentLocalWeeks])

    return (
        <div className='max-w-[1200px]_ h-fit border rounded-md py-4 px-4'>
            <h1 className='text-3xl font-medium'>Total working hours</h1>
            <p className='mt-2'> View how the total accumalated hours that each employee has worked.</p>
            <Separator className='my-4' />
            <div className='grid md:grid-cols-2 gap-x-6 my-6'>
                {useEmployeePageStoreState.employeesData
                    .sort((a, b) => a.firstName.localeCompare(b.firstName))
                    .map((employee) => {
                        return (
                            <div key={employee.id} className='flex border-b h-8 items-end text-sm'>
                                <div className='w-1/2 pl-2 border-r'>{employee.firstName} {employee.lastName}</div>
                                <div className='w-1/2 pl-2'>{employee.totalHours} hours</div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default CalculatedHours