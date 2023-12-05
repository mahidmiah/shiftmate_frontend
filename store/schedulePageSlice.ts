import { Shift } from "@/types";
import { create } from "zustand";

interface SchedulePageState {
    selectedShift: Shift;
    isAddShiftModalOpen: boolean;
    isEditShiftModalOpen: boolean;
    isDeleteShiftModalOpen: boolean;
    isAddFinanceModalOpen: boolean;
    setSelectedShift: (shift: Shift) => void;
    setIsAddShiftModalOpen: (isOpen: boolean) => void;
    setIsEditShiftModalOpen: (isOpen: boolean) => void;
    setIsDeleteShiftModalOpen: (isOpen: boolean) => void;
    setIsAddFinanceModalOpen: (isOpen: boolean) => void;
}

const useSchedulePageStore = create<SchedulePageState>((set) => ({
    selectedShift: {} as Shift,
    isAddShiftModalOpen: false,
    isEditShiftModalOpen: false,
    isDeleteShiftModalOpen: false,
    isAddFinanceModalOpen: false,
    setSelectedShift: (shift: Shift) => set(() => ({ selectedShift: shift })),
    setIsAddShiftModalOpen: (isOpen: boolean) => set(() => ({ isAddShiftModalOpen: isOpen })),
    setIsEditShiftModalOpen: (isOpen: boolean) => set(() => ({ isEditShiftModalOpen: isOpen })),
    setIsDeleteShiftModalOpen: (isOpen: boolean) => set(() => ({ isDeleteShiftModalOpen: isOpen })),
    setIsAddFinanceModalOpen: (isOpen: boolean) => set(() => ({ isAddFinanceModalOpen: isOpen })),
}));

export default useSchedulePageStore;