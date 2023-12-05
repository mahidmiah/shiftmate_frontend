import { create } from "zustand";

interface PositionsTabState {
    isAddPositionModalOpen: boolean;
    setIsAddPositionModalOpen: (isOpen: boolean) => void;
    isDeletePositionModalOpen: boolean;
    setIsDeletePositionModalOpen: (isOpen: boolean) => void;
    selectedPosition: string;
    setSelectedPosition: (position: string) => void;
}

const usePositionsTabStore = create<PositionsTabState>((set) => ({
    isAddPositionModalOpen: false,
    setIsAddPositionModalOpen: (isOpen: boolean) => set(() => ({ isAddPositionModalOpen: isOpen })),
    isDeletePositionModalOpen: false,
    setIsDeletePositionModalOpen: (isOpen: boolean) => set(() => ({ isDeletePositionModalOpen: isOpen })),
    selectedPosition: '',
    setSelectedPosition: (position: string) => set(() => ({ selectedPosition: position })),
}));

export default usePositionsTabStore;