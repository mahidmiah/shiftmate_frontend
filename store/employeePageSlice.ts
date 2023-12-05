import { Employee } from "@/types";
import { create } from "zustand";

interface EmployeePageState {
    employeesData: Employee[];
    isAddEmployeeModalOpen: boolean;
    isEditEmployeeModalOpen: boolean;
    isDeleteEmployeeModalOpen: boolean;
    selectedEmployee: Employee;
    setSelectedEmployee: (employee: Employee) => void;
    setEmployeesData: (employees: Employee[]) => void;
    setIsAddEmployeeModalOpen: (isOpen: boolean) => void;
    setIsEditEmployeeModalOpen: (isOpen: boolean) => void;
    setIsDeleteEmployeeModalOpen: (isOpen: boolean) => void;
    addEmployee: (employee: Employee) => void;
    removeEmployee: (employee: Employee) => void;
    updateEmployee: (employee: Employee) => void;
}

const useEmployeePageStore = create<EmployeePageState>((set) => ({
    employeesData: [],
    isAddEmployeeModalOpen: false,
    isEditEmployeeModalOpen: false,
    isDeleteEmployeeModalOpen: false,
    selectedEmployee: {} as Employee,
    setSelectedEmployee: (employee: Employee) => set(() => ({ selectedEmployee: employee })),
    setEmployeesData: (employees: Employee[]) => set(() => ({ employeesData: employees })),
    setIsAddEmployeeModalOpen: (isOpen: boolean) => set(() => ({ isAddEmployeeModalOpen: isOpen })),
    setIsEditEmployeeModalOpen: (isOpen: boolean) => set(() => ({ isEditEmployeeModalOpen: isOpen })),
    setIsDeleteEmployeeModalOpen: (isOpen: boolean) => set(() => ({ isDeleteEmployeeModalOpen: isOpen })),
    addEmployee: (employee: Employee) => set((state) => ({ employeesData: [...state.employeesData, employee] })),
    removeEmployee: (employee: Employee) => set((state) => ({ employeesData: state.employeesData.filter((e) => e.id !== employee.id) })),
    updateEmployee: (employee: Employee) => set((state) => ({
        employeesData: state.employeesData.map((e) => {
            if (e.id === employee.id) {
                console.log("employee found", employee);
                return { ...employee };
            }
            return e;
        })
    })),
}));

export default useEmployeePageStore;