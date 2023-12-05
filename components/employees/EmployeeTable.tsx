'use client'

import { Button } from '@/components/ui/button'
import { ArrowUpDown, Plus } from 'lucide-react'
import React from 'react'

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Employee } from '@/types'
import useEmployeePageStore from '@/store/employeePageSlice'
import DropDownMenu from './DropDownMenu'
import AddEmployeeModal from './AddEmployeeModal'
import EditEmployeeModal from './EditEmployeeModal'
import DeleteEmployeeModal from './DeleteEmployeeModal'


function EmployeeTable() {

    const useEmployeePageStoreState = useEmployeePageStore(state => state);

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: "firstName",
            header: ({ column }) => {
            return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        First name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="camelcase">{row.getValue("firstName")} {row.getValue("lastName")}</div>,
        },
        {
            accessorKey: "lastName",
            header: "Last name",
            cell: ({ row }) => <div className="camelcase">{row.getValue("lastName")}</div>,
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <div className="text-xs">{row.getValue("id")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropDownMenu employee={user as Employee} />
                )
            },
        },
    ]

    function DataTable() {
        const [sorting, setSorting] = React.useState<SortingState>([])
        const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
            []
        )
        const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
        const [rowSelection, setRowSelection] = React.useState({})

        const data = useEmployeePageStore(state => state.employeesData);
    
        const table = useReactTable({
            data,
            columns,
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            onColumnVisibilityChange: setColumnVisibility,
            onRowSelectionChange: setRowSelection,
            state: {
                sorting,
                columnFilters,
                columnVisibility,
                rowSelection,
            },
        })

        return (
            <div className="w-full h-full">
                <div className="flex items-center justify-between gap-x-4 py-4">
                    <Input
                        placeholder="Filter name..."
                        value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("firstName")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Button className='text-sm flex items-center gap-x-2' onClick={e => useEmployeePageStoreState.setIsAddEmployeeModalOpen(true)}><Plus size={16} /> Add employee</Button>
                </div>
                <div className="rounded-md border">
                    <Table className='overflow-hidden'>
                        <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                </TableHead>
                                )
                            })}
                            </TableRow>
                        ))}
                        </TableHeader>
                        <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                    )}
                                </TableCell>
                                ))}
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                        Next
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div>

            {DataTable()}
            <DeleteEmployeeModal />
            <AddEmployeeModal />
            <EditEmployeeModal />

        </div>
    )
}

export default EmployeeTable