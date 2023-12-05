import React, { useEffect } from 'react'
import { Separator } from '../ui/separator'
import useGlobalStore from '@/store/globalSlice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { weeklyFinance } from '@/types';
import { toast } from '../ui/use-toast';
import useSchedulePageStore from '@/store/schedulePageSlice';
import { da } from 'date-fns/locale';

interface Props {
    day: string;
}

function WeeklyFinances({day}: Props) {

    const globalStore = useGlobalStore(state => state);
    const useSchedulePageStoreState = useSchedulePageStore(state => state);
    const [dailyIncome, setDailyIncome] = React.useState(0);
    const [dailyUber, setDailyUber] = React.useState(0);
    const [dailyExpense, setDailyExpense] = React.useState(0);
    const [dailyProfit, setDailyProfit] = React.useState(0);
    const [dailyNotes, setDailyNotes] = React.useState('');

    const [weeklyIncome, setWeeklyIncome] = React.useState(0);
    const [weeklyUber, setWeeklyUber] = React.useState(0);
    const [weeklyExpense, setWeeklyExpense] = React.useState(0);
    const [weeklyProfit, setWeeklyProfit] = React.useState(0);

    type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

    const formSchema = z.object({
        cash: z.string().transform((val) => Number(val)).optional(),
        uber: z.string().transform((val) => Number(val)).optional(),
        expense: z.string().transform((val) => Number(val)).optional(),
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

    useEffect(() => {
        const getFinances = async () => {
            let day_: Day;
            day_ = day as Day;
            const response = await fetch('http://localhost:4000/api/week/getFinancials', {
                method: 'POST',
                body: JSON.stringify({year: globalStore.currentYear, weekNumber: globalStore.currentWeek}),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:4000' 
                },
                credentials: "include"
            });
            const json = await response.json();
            const data: weeklyFinance = json.week;
            globalStore.setCurrentLocalWeekFinance({...globalStore.currentLocalWeekFinance, [`${globalStore.currentYear}_${globalStore.currentWeek}`]: data});
        }

        getFinances();

    }, [globalStore.currentYear, globalStore.currentWeek])

    useEffect(() => {
        if (globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`] === undefined) return;
        const income = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day as keyof weeklyFinance].income as number || 0;
        const uber = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day as keyof weeklyFinance].uber as number || 0;
        const expense = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day as keyof weeklyFinance].expense as number || 0;
        const profit = (income + uber) - expense;
        const notes_ = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day as keyof weeklyFinance].notes as string || '';

        setDailyIncome(income);
        setDailyUber(uber);
        setDailyExpense(expense);
        setDailyProfit(profit);

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let weeklyIncome_ = 0;
        let weeklyUber_ = 0;
        let weeklyExpense_ = 0;
        let weeklyProfit_ = 0;
        days.forEach((day_) => {
            const income_ = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day_ as keyof weeklyFinance].income as number || 0;
            const uber_ = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day_ as keyof weeklyFinance].uber as number || 0;
            const expense_ = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day_ as keyof weeklyFinance].expense as number || 0;
            const profit_ = (income_ + uber_) - expense_;

            console.log(day_, income_, uber_, expense_, profit_);

            weeklyIncome_ += income_;
            weeklyUber_ += uber_;
            weeklyExpense_ += expense_;
            weeklyProfit_ += profit_;
        })
        setWeeklyIncome(weeklyIncome_);
        setWeeklyUber(weeklyUber_);
        setWeeklyExpense(weeklyExpense_);
        setWeeklyProfit(weeklyProfit_);
        setDailyNotes(notes_);

    },[globalStore.currentLocalWeekFinance, day])

    //xl:w-[400px] 2xl:w-[600px]

    return (
        <div className='border rounded-md py-4 px-4'>
            <h1 className='text-3xl font-medium'>Weekly finances </h1>
            <p className='mt-2'> View and record your weekly business finances.</p>
            <Separator className='my-4' />
            <div className='flex justify-between items-center'>
                <p><span className='font-semibold'>Day:</span> {day}</p>
                <Button className='text-xs h-8' onClick={() => useSchedulePageStoreState.setIsAddFinanceModalOpen(true)}>Update</Button>
            </div>
            <Separator className='my-4' />

            <div className='flex flex-col md:flex-row gap-x-4 w-full'>
                <div className='flex md:w-1/2 flex-col gap-y-4 md:border-r py-2 pr-4'>
                    <h1 className='text-md'><span className='text-sm font-semibold'>Daily cash:</span> £{dailyIncome}</h1>
                    <h1 className='text-md'><span className='text-sm font-semibold'>Daily uber:</span> £{dailyUber}</h1>
                    <h1 className='text-md'><span className='text-sm font-semibold'>Daily expense:</span> £{dailyExpense}</h1>
                    <Separator className='' />
                    <div>
                        <h1 className='text-ms font-bold'>Total Daily profit:</h1>
                        <h1 className='text-ms font-bold text-blue-600'>£{dailyProfit}</h1>
                    </div>
                </div>
                <div className='flex md:w-1/2 flex-col gap-y-4 py-2 pr-4'>
                    <h1 className='text-md'><span className='text-sm font-semibold'>Total weekly cash:</span> £{weeklyIncome}</h1>
                    <h1 className='text-md'><span className='text-sm font-semibold'>Total weekly uber:</span> £{weeklyUber}</h1>
                    <h1 className='text-md'><span className='text-sm font-semibold'>Total weekly expenses:</span> £{weeklyExpense}</h1>
                    <Separator className='' />
                    <div>
                        <h1 className='text-ms font-bold'>Total Weekly profit</h1>
                        <h1 className='text-ms font-bold text-blue-600'>£{weeklyProfit}</h1>
                    </div>
                </div>
            </div>
            <Separator className='my-4' />
            <h1 className='text-2xl font-medium'>Notes</h1>
            <p>{dailyNotes}</p>
        </div>
    )
}

export default WeeklyFinances