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
import { PlayerStanding, QUALIFIED_MIN_PARTICIPATIONS } from "@/lib/tournament-utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const DEFAULT_SORTING: SortingState = [
    { id: "winRate", desc: true },
    { id: "pointsPerGame", desc: true },
    { id: "totalScore", desc: true },
    { id: "firstPlace", desc: true },
    { id: "participations", desc: true },
];

function SortButton({
    column,
    children,
    title,
}: {
    column: Column<PlayerStanding>;
    children: React.ReactNode;
    title?: string;
}) {
    const sorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            title={title}
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
            const rank = table.getRowModel().rows.findIndex((r) => r.id === row.id) + 1;
            return <span className="text-muted-foreground tabular-nums">{rank}</span>;
        },
        enableSorting: false,
    },
    {
        accessorKey: "player",
        header: ({ column }) => <SortButton column={column}>Spieler</SortButton>,
    },
    {
        accessorKey: "winRate",
        header: ({ column }) => (
            <SortButton column={column} title="Siegquote (Siege / Teilnahmen)">
                Quote
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">
                {((getValue() as number) * 100).toFixed(1)}%
            </span>
        ),
        sortingFn: "basic",
    },
    {
        accessorKey: "pointsPerGame",
        header: ({ column }) => (
            <SortButton column={column} title="Punkte pro Teilnahme">
                P/TN
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">
                {(getValue() as number).toFixed(1)}
            </span>
        ),
        sortingFn: "basic",
    },
    {
        accessorKey: "totalScore",
        header: ({ column }) => (
            <SortButton column={column} title="Gesamtpunkte">
                Punkte
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">{getValue() as number}</span>
        ),
    },
    {
        accessorKey: "firstPlace",
        header: ({ column }) => (
            <SortButton column={column} title="Siege (1. Platz)">
                Siege
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">{getValue() as number}</span>
        ),
    },
    {
        accessorKey: "participations",
        header: ({ column }) => (
            <SortButton column={column} title="Teilnahmen">
                TN
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">{getValue() as number}</span>
        ),
    },
];

function RankedTable({ data }: { data: PlayerStanding[] }) {
    const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableMultiSort: true,
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
                            <TableRow key={row.id}>
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

const columnsNoRank = columns.filter((c) => c.id !== "rank");

function UnrankedTable({ data }: { data: PlayerStanding[] }) {
    const [sorting, setSorting] = useState<SortingState>([{ id: "totalScore", desc: true }]);

    const table = useReactTable({
        data,
        columns: columnsNoRank,
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
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function StandingsTable({ data }: { data: PlayerStanding[] }) {
    const qualified = data.filter((p) => p.participations >= QUALIFIED_MIN_PARTICIPATIONS);
    const unqualified = data.filter((p) => p.participations < QUALIFIED_MIN_PARTICIPATIONS);

    return (
        <div className="space-y-6">
            <RankedTable data={qualified} />
            {unqualified.length > 0 && (
                <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors [&[data-state=open]>svg]:rotate-180">
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        Spieler mit weniger als {QUALIFIED_MIN_PARTICIPATIONS} Teilnahmen (nicht
                        gewertet)
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                        <UnrankedTable data={unqualified} />
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
}
