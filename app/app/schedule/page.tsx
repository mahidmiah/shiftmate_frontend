'use client'

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import useGlobalStore from '@/store/globalSlice';
import { CalendarIcon, CalendarRange, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { DayModifiers } from 'react-day-picker';
import { toast } from '@/components/ui/use-toast';
import useEmployeePageStore from '@/store/employeePageSlice';
import { Employee, weeklyFinance } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import useSchedulePageStore from '@/store/schedulePageSlice';
import AddShiftModal from '@/components/schedule/AddShiftModal';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import EditShiftModal from '@/components/schedule/EditShiftModal';
import DeleteShiftModal from '@/components/schedule/DeleteShiftModal';
import CalculatedHours from '@/components/schedule/CalculatedHours';
import WeeklyFinances from '@/components/schedule/WeeklyFinances';
import AddFinanceModal from '@/components/schedule/AddFinanceModal';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Page() {

    const globalStore = useGlobalStore(state => state);
    const employeeStore = useEmployeePageStore(state => state);
    const useSchedulePageStoreState = useSchedulePageStore(state => state);

    const [day, setDay] = useState('Monday');
    const [shiftData, setShiftData] = useState<{ [key: string]: JSX.Element | undefined }>();
    const [loading, setLoading] = useState(false);
    const [weekCount, setWeekCount] = useState(0);

    const generateNewWeek = async () => {
        setLoading(true);
        const response = await fetch('https://backend.shiftmate.tech/api/week/addWeek', {
            method: 'POST',
            body: JSON.stringify({
                year: globalStore.currentYear, 
                weekNumber: globalStore.currentWeek,
                startDate: moment(globalStore.selectedDays[0]).format('LL'),
                endDate: moment(globalStore.selectedDays[6]).format('LL'),
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech' 
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
                title: "Successfully generated new week!",
                description: json.message,
            });
            const response2 = await fetch('https://backend.shiftmate.tech/api/shift/getAllShifts', {
                method: 'POST',
                body: JSON.stringify({weekNumber: globalStore.currentWeek, year: globalStore.currentYear}),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech/' 
                },
                credentials: "include"
            });
            const json2 = await response2.json();

            globalStore.setCurrentLocalWeeks({...globalStore.currentLocalWeeks, [`${globalStore.currentYear}_${globalStore.currentWeek}`]: json2.shifts});
            setWeekCount(weekCount + 1);
        }
        
        setLoading(false);
    }

    const convertToTime = (time: string) => {
        const [hour, minute] = time.split(':');
        if (minute === '00') {
            return Number(hour);
        }
        else {
            return Number(hour) + 0.5;
        }
    }

    const getWeekDays = (weekStart: Date): Date[] => {
        const days = [weekStart];
        for (let i = 1; i < 7; i += 1) {
            days.push(
                moment(weekStart)
                    .add(i, 'days')
                    .toDate()
            );
        }
        return days;
    }

    const getWeekRange = (date: Date) => {
        return {
            from: moment(date)
                .startOf('isoWeek') 
                .toDate(),
            to: moment(date)
                .startOf('isoWeek')
                .add(4, 'days')
                .toDate(),
        };
    }

    const [hoverRange, setHoverRange] = useState<{ from: Date; to: Date } | undefined>(undefined);

    const handleDayChange = (date: Date) => {
        globalStore.setSelectedDays(getWeekDays(getWeekRange(date).from));
        globalStore.setCurrentWeek(moment(date).isoWeek());
        globalStore.setCurrentYear(moment(date).isoWeekYear());
    };

    const handleDayEnter = (date: Date) => {
        setHoverRange(getWeekRange(date));
    };
    
    const handleDayLeave = () => {
        setHoverRange(undefined);
    };

    const daysAreSelected = globalStore.selectedDays.length > 0;
    
    const modifiers = {
        hoverRange,
        selectedRange: daysAreSelected && {
            from: globalStore.selectedDays[0],
            to: globalStore.selectedDays[4],
        },
        hoverRangeStart: hoverRange && hoverRange.from,
        hoverRangeEnd: hoverRange && hoverRange.to,
        selectedRangeStart: daysAreSelected && globalStore.selectedDays[0],
        selectedRangeEnd: daysAreSelected && globalStore.selectedDays[4],
    } as DayModifiers;

    const generateShiftCells = () => {
        const cells: { [key: string]: any } = {};

        const currentLocalWeeks = globalStore.currentLocalWeeks[`${globalStore.currentYear}_${globalStore.currentWeek}`];
        if (currentLocalWeeks) {
            Object.values(currentLocalWeeks).forEach((shift: any, index: any) => {
                const timeDifference = convertToTime(shift.endTime) - convertToTime(shift.startTime);
                const width = timeDifference * 160;
                const employee = employeeStore.employeesData.find((employee: Employee) => employee.id === shift.employeeID);
                cells[`${shift.position}_${shift.dayOfWeek}_${shift.startTime}`] = (
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <HoverCard>
                                <div className={`relative h-8 z-10 rounded-md px-2 text-xs flex items-center`} style={{ width: `${width - 5}px`, backgroundColor: `${employee?.background}`, color: `${employee?.foreground}` }}>
                                    <HoverCardTrigger className='flex items-center hover:cursor-pointer'>
                                        <Avatar className='h-6 w-6 mr-2 text-black overflow-hidden'>
                                            <AvatarFallback>{employee?.firstName[0]}{employee?.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        {employee?.firstName} {employee?.lastName}
                                    </HoverCardTrigger>
                                </div>
                                <HoverCardContent>
                                    <h1><span className='text-sm font-semibold'>Name: </span>{employee?.firstName} {employee?.lastName}</h1>
                                    <span className='font-semibold'>Start time:</span> {shift.startTime}
                                    <br />
                                    <span className='font-semibold'>End time:</span> {shift.endTime}
                                </HoverCardContent>
                            </HoverCard>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem onClick={e => {useSchedulePageStoreState.setIsEditShiftModalOpen(true); useSchedulePageStoreState.setSelectedShift(shift);}}>Edit shift</ContextMenuItem>
                            <ContextMenuItem onClick={e => {useSchedulePageStoreState.setIsDeleteShiftModalOpen(true); useSchedulePageStoreState.setSelectedShift(shift);}}>Delete shift</ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                );
            });
        }

        setShiftData(cells);
    }

    useEffect(() => {
        const currentDate = new Date();
        const daysOfCurrentWeek = getWeekDays(getWeekRange(currentDate).from);
        globalStore.setSelectedDays(daysOfCurrentWeek);
        globalStore.setCurrentWeek(moment(currentDate).isoWeek());
        globalStore.setCurrentYear(moment(currentDate).isoWeekYear());
    }, []);

    useEffect(() => {
        const getWeek = async () => {
            console.log('Getting week...');
            setLoading(true);
            const response = await fetch('https://backend.shiftmate.tech/api/shift/getAllShifts', {
                method: 'POST',
                body: JSON.stringify({weekNumber: globalStore.currentWeek, year: globalStore.currentYear}),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://backend.shiftmate.tech/' 
                },
                credentials: "include"
            });

            const json = await response.json();

            if (response.ok) {
                toast({
                    className: "absolute top-0 right-0",
                    variant: "success",
                    title: "Successfully loaded datas!",
                    description: json.message,
                });
                globalStore.setCurrentLocalWeeks({...globalStore.currentLocalWeeks, [`${globalStore.currentYear}_${globalStore.currentWeek}`]: json.shifts});
            }
            
            setLoading(false);
        }

        if (!globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`)) {
            getWeek();
            console.log('currentLocalWeeks: ', globalStore.currentLocalWeeks);
        }

        generateShiftCells();
    }, [globalStore.currentWeek, globalStore.currentYear, globalStore.currentLocalWeeks, weekCount])

    const generateGraph = () => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const income_: any[] = [];
        const uber_: any[] = [];
        const expense_: any[] = [];

        days.forEach((day) => {
            if (globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`] === undefined) return;
            const finance = globalStore.currentLocalWeekFinance[`${globalStore.currentYear}_${globalStore.currentWeek}`][day as keyof weeklyFinance];
            income_.push(finance.income);
            uber_.push(finance.uber);
            expense_.push(finance.expense);
        });

        const data = {
            labels: days,
            datasets: [
                {
                    label: 'Income',
                    data: income_,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.5)',
                    fill: false,
                },
                {
                    label: 'Uber',
                    data: uber_,
                    borderColor: 'rgba(192,75,75,1)',
                    backgroundColor: 'rgba(192,75,75,0.5)',
                    fill: false,
                },
                {
                    label: 'Expense',
                    data: expense_,
                    borderColor: 'rgba(75,75,192,1)',
                    backgroundColor: 'rgba(75,75,192,0.5)',
                    fill: false,
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    
                },
                title: {
                    display: true,
                    text: 'Weekly Finance',
                },
            },
        };

        return <Line data={data} options={options} />;
    }

    return (
        <>

        <h1 className='text-4xl font-medium'>Schedule</h1>
        <p className='mt-2'> Edit your weekly shifts.</p>
        <Separator className='my-4' />

        <div className='bg-accent h-10 w-full rounded-md mb-4 flex items-center justify-between px-1'>
            <div className='flex items-center gap-x-2'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={"h-8 text-left font-normal flex gap-4 text-xs"}>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            {globalStore.selectedDays.length === 7 && (
                                <>
                                <div className='hidden lg:flex'>
                                {moment(globalStore.selectedDays[0]).format('LL')} 
                                {' - '}
                                {moment(globalStore.selectedDays[6]).format('LL')}
                                </div>
                                <div className='lg:hidden'>
                                Week
                                </div>
                                </>
                                
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            ISOWeek
                            selected={globalStore.selectedDays}
                            showWeekNumber
                            showOutsideDays={true}
                            modifiers={modifiers}
                            onDayClick={handleDayChange}
                            onDayMouseEnter={handleDayEnter}
                            onDayMouseLeave={handleDayLeave}
                            disabled={false}
                            formatters={{
                                formatWeekNumber: (weekNumber) => (<p className='text-xs flex items-center h-full'>{`WK${weekNumber}`}</p>)
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        {globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) && 
                        <Button variant={"outline"} className={"h-8 text-left font-normal flex gap-4 text-xs"}>
                            <CalendarRange className="ml-auto h-4 w-4 opacity-50" />
                            {day}
                        </Button>}
                    </PopoverTrigger>
                    <PopoverContent className="w-28 p-0" align="start">
                        <div className='text-xs p-1'>
                            <Button className="w-full text-left text-xs" variant={day === 'Monday' ? "default" : "ghost"} onClick={() => setDay('Monday')}>Monday</Button>
                            <Button className="w-full text-left text-xs" variant={day === 'Tuesday' ? "default" : "ghost"} onClick={() => setDay('Tuesday')}>Tuesday</Button>
                            <Button className="w-full text-left text-xs" variant={day === 'Wednesday' ? "default" : "ghost"} onClick={() => setDay('Wednesday')}>Wednesday</Button>
                            <Button className="w-full text-left text-xs" variant={day === 'Thursday' ? "default" : "ghost"} onClick={() => setDay('Thursday')}>Thursday</Button>
                            <Button className="w-full text-left text-xs" variant={day === 'Friday' ? "default" : "ghost"} onClick={() => setDay('Friday')}>Friday</Button>
                            <Button className="w-full text-left text-xs" variant={day === 'Saturday' ? "default" : "ghost"} onClick={() => setDay('Saturday')}>Saturday</Button>
                            <Button className="w-full text-left text-xs" variant={day === 'Sunday' ? "default" : "ghost"} onClick={() => setDay('Sunday')}>Sunday</Button>
                        </div>
                    </PopoverContent>
                </Popover>
                
                <h1 className='ml-4 text-xs hidden md:flex'>Year: {String(globalStore.currentYear)}</h1>
                <h1 className='ml-4 text-xs hidden md:flex'>Week: {String(globalStore.currentWeek)}</h1>
            </div>
            <div>
                {globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) 
                && 
                (<Button variant={"outline"} className='h-8 text-sm flex items-center gap-x-2' onClick={() => useSchedulePageStoreState.setIsAddShiftModalOpen(true)}><Plus size={16} /> Add shift</Button>)}
            </div>
        </div>

        {
            !loading ? (
                <div className='w-full border rounded-md flex overflow-auto'>
                {
                    globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) ? (
                        <>
                            <div className='flex flex-col sticky left-0 z-50'>
                                <div className='TOP_LEFT_CORNER h-10 w-40 border-r bg-accent border-b'>
                                    {/* top left corner */}
                                </div>
                                {/* Positions */}
                                {
                                    globalStore.positionsData?.map((position, index) => (
                                        index === globalStore.positionsData.length - 1 ?
                                        (
                                        <div className='px-4 py-2 h-10 w-40 border-r bg-accent z-50' key={index}>
                                            <div className='text-sm font-semibold'>{position}</div>
                                        </div>
                                        )
                                        :
                                        (
                                        <div className='px-4 py-2 border-b h-10 w-40 border-r bg-accent z-50' key={index}>
                                            <div className='text-sm font-semibold'>{position}</div>
                                        </div>
                                        )
                                    ))
                                }
                            </div>
                            {/* Main */}
                            <div className='flex flex-col'>
                                {/* Time of day from 00 to 24 */}
                                <div className='flex'>
                                    {
                                        [...Array(24)].map((_, index) => (
                                            <div className='px-4 py-2 h-10 w-40 border-r border-b bg-accent' key={index}>
                                                <div className='text-sm font-semibold'>{index}:00</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                {/* Shifts */}
                                {
                                    globalStore.positionsData?.map((position, positionIndex) => (
                                        <div className='flex' key={positionIndex}>
                                            {
                                                [...Array(24)].map((_, timeIndex) => (
                                                    positionIndex === globalStore.positionsData.length - 1 ?
                                                    (
                                                    <div className='py-2 h-10 w-40 border-r static flex items-center' key={timeIndex}>
                                                        {/* <div className='text-xs'>{position}_{day}_{timeIndex}:00</div> */}
                                                        <div className='relative'>{shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:00`]}</div>
                                                        <div className='relative left-[80px]'>{shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:30`]}</div>
                                                        {/* {shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:00`]}
                                                        {shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:30`]} */}
                                                    </div>
                                                    )
                                                    :
                                                    (
                                                    <div className='py-2 h-10 w-40 border-r border-b static flex items-center' key={timeIndex}>
                                                        {/* <div className='text-xs'>{position}_{day}_{timeIndex}:00</div> */}
                                                        <div className='relative'>{shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:00`]}</div>
                                                        <div className='relative left-[80px]'>{shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:30`]}</div>
                                                        {/* {shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:00`]}
                                                        {shiftData && shiftData[`${position}_${day}_${timeIndex < 10 ? `0${timeIndex}` : timeIndex}:30`]} */}
                                                    </div>
                                                    )
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )
                    :
                    (
                        <div className='mx-auto h-48 flex items-center'>
                            <div className='flex flex-col gap-y-2'>
                                <h1>No shifts for this week.</h1>
                                <Button onClick={generateNewWeek} className='h-8 text-sm flex items-center gap-x-2'><Plus size={16} /> Add Week</Button>
                            </div>
                        </div>
                    )
                }
            </div>
            )
            :
            (   
                <div className='w-full border rounded-md flex overflow-auto'>
                    <div className='mx-auto h-48 flex items-center'>
                        <div>
                            <h1>Loading...</h1>
                        </div>
                    </div>
                </div>
            )
        }

        <AddShiftModal />
        <EditShiftModal />
        <DeleteShiftModal />
        <AddFinanceModal />
        
        {globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) && (
            <div className='mt-6 2xl:grid grid-cols-3 gap-x-6'>
            <div className=''><CalculatedHours /></div>
            <div className='mt-6 2xl:mt-0'><WeeklyFinances day={day} /></div>
            <div className='border rounded-md py-4 px-4 mt-6 2xl:mt-0'>
                <h1 className='text-3xl font-medium'>Statistics</h1>
                <p className='mt-2'> View your weekly business statisics.</p>
                <Separator className='my-4' />
                {globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) && generateGraph()}
            </div>
        </div>
        )}
        {/* <div className='mt-6 2xl:grid grid-cols-3 gap-x-6'>
            <div className=''>{globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) && <CalculatedHours />}</div>
            <div className='mt-6 2xl:mt-0'>{globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) && <WeeklyFinances day={day} />}</div>
            <div className='border rounded-md py-4 px-4 mt-6 2xl:mt-0'>
                <h1 className='text-3xl font-medium'>Statistics</h1>
                <p className='mt-2'> View your weekly business statisics.</p>
                <Separator className='my-4' />
                {globalStore.currentLocalWeeks.hasOwnProperty(`${globalStore.currentYear}_${globalStore.currentWeek}`) && generateGraph()}
            </div>
        </div> */}
        </>
    )
}

export default Page