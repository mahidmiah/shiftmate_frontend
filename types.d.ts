export type Employee = {
    totalHours?: number
    id: string
    firstName: string
    lastName: string
    password: string
    background: string
    foreground: string
}

export type profile = {
    businessName: string
    firstName: string
    lastName: string
    streetLine1: string
    streetLine2: string
    city: string
    postCode: string
    numberOfShifts: number
}

export type Shift = {
    _id: string
    businessID: string
    dayOfWeek: string
    employeeID: string
    endTime: string
    position: string
    startTime: string
    year: number
}

export type weeklyFinance = {
    'Monday': {
        income?: number
        uber?: number
        expense?: number
        notes?: string
    },
    'Tuesday': {
        income?: number
        uber?: number
        expense?: number
        notes?: string
    },
    'Wednesday': {
        income?: number
        uber?: number
        expense?: number
        notes?: string
    },
    'Thursday': {
        income?: number
        uber?: number
        expense?: number
        notes?: string
    },
    'Friday': {
        income?: number
        uber?: number
        expense?: number
        notes?: string
    },
    'Saturday': {
        income?: number
        uber?: number
        expense?: number
        notes?: string
    },
    'Sunday': {
        income?: number
        uber?: number
        expense?: number
        notes?: string
    },
}