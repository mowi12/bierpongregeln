"use client";

import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlayerStanding } from "@/lib/tournament-utils";

function SortButton({
    column,
    children,
}: {
    column: Column<PlayerStanding>;
    children: React.ReactNode;
}) {
    const sorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            {children}
            {sorted === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
            ) : sorted === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
        </Button>
    );
}

const columns: ColumnDef<PlayerStanding>[] = [
    {
        id: "rank",
        header: "#",
        cell: ({ row, table }) => {
            const sortedRows = table.getSortedRowModel().rows;
            const rank = sortedRows.findIndex((r) => r.id === row.id) + 1;
            return <span className="text-muted-foreground">{rank}</span>;
        },
        enableSorting: false,
    },
    {
        accessorKey: "player",
        header: ({ column }) => <SortButton column={column}>Spieler</SortButton>,
    },
    {
        accessorKey: "firstPlace",
        header: ({ column }) => <SortButton column={column}>1. Platz</SortButton>,
        cell: ({ getValue }) => (
            <span className="font-medium text-yellow-600">{getValue() as number}</span>
        ),
    },
    {
        accessorKey: "secondPlace",
        header: ({ column }) => <SortButton column={column}>2. Platz</SortButton>,
        cell: ({ getValue }) => (
            <span className="font-medium text-slate-500">{getValue() as number}</span>
        ),
    },
    {
        accessorKey: "thirdPlace",
        header: ({ column }) => <SortButton column={column}>3. Platz</SortButton>,
        cell: ({ getValue }) => (
            <span className="font-medium text-amber-700">{getValue() as number}</span>
        ),
    },
    {
        accessorKey: "totalScore",
        header: ({ column }) => <SortButton column={column}>Punkte</SortButton>,
        cell: ({ getValue }) => <span className="font-bold">{getValue() as number}</span>,
    },
];

export function StandingsTable({ data }: { data: PlayerStanding[] }) {
    const [sorting, setSorting] = useState<SortingState>([{ id: "totalScore", desc: true }]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Keine Ergebnisse.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
