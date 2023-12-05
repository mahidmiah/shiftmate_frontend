import { profile, weeklyFinance } from "@/types";
import moment from "moment";
import { create } from "zustand";

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

interface GlobalState {
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (isOpen: boolean) => void;
    profileData: profile;
    setProfileData: (data: profile) => void;
    positionsData: string[];
    setPositionsData: (data: string[]) => void;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    selectedDays: Date[];
    setSelectedDays: (days: Date[]) => void;
    currentWeek: Number;
    setCurrentWeek: (week: Number) => void;
    currentYear: number;
    setCurrentYear: (year: number) => void;
    currentLocalWeeks: Record<string, object>;
    setCurrentLocalWeeks: (data: {}) => void;
    addWeekToLocalWeeks: (week: string, data: object) => void;
    currentLocalWeekFinance: Record<string, weeklyFinance>;
    setCurrentLocalWeekFinance: (data: {}) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
    isMobileNavOpen: false,
    setIsMobileNavOpen: (isOpen: boolean) => set(() => ({ isMobileNavOpen: isOpen })),
    profileData: {
        businessName: '',
        firstName: '',
        lastName: '',
        streetLine1: '',
        streetLine2: '',
        city: '',
        postCode: '',
        numberOfShifts: 0
    },
    setProfileData: (data: profile) => set(() => ({ profileData: data })),
    positionsData: [],
    setPositionsData: (data: string[]) => set(() => ({ positionsData: data })),
    currentDate: new Date(),
    setCurrentDate: (date: Date) => set(() => ({ currentDate: date })),
    selectedDays: getWeekDays(getWeekRange(new Date()).from),
    setSelectedDays: (days: Date[]) => set(() => ({ selectedDays: days })),
    currentWeek: moment(new Date()).isoWeek(),
    setCurrentWeek: (week: Number) => set(() => ({ currentWeek: week })),
    currentYear: moment(new Date()).isoWeekYear(),
    setCurrentYear: (year: number) => set(() => ({ currentYear: year })),
    currentLocalWeeks: {},
    setCurrentLocalWeeks: (data: {}) => set(() => ({ currentLocalWeeks: data })),
    addWeekToLocalWeeks: (week: string, data: object) => set((state) => ({
        currentLocalWeeks: {
            ...state.currentLocalWeeks,
            [week]: data,
        },
    })),
    currentLocalWeekFinance: {},
    setCurrentLocalWeekFinance: (data: {}) => set(() => ({ currentLocalWeekFinance: data })),
}));

export default useGlobalStore;