"use client";

import {
    type Column,
    type ColumnDef,
    createSortedRowModel,
    flexRender,
    rowSortingFeature,
    type SortingState,
    sortFn_alphanumeric,
    sortFn_basic,
    sortFn_text,
    tableFeatures,
    useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type PlayerStanding, QUALIFIED_MIN_PARTICIPATIONS } from "@/lib/tournament-utils";

const features = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic, text: sortFn_text },
});

const tableCardClassName = "bg-card overflow-hidden rounded-xl border lg:rounded-3xl";

/**
 * Keeps rank and player visible while the other columns scroll horizontally on small screens.
 */
function stickyColumnClassName(columnId: string, hasRank: boolean): string | undefined {
    const base = "bg-card group-hover/row:bg-background sticky z-10 transition-colors";
    if (columnId === "rank") return `${base} left-0 w-10 min-w-10`;
    if (columnId === "player") return `${base} ${hasRank ? "left-10" : "left-0"}`;
    return undefined;
}

const DEFAULT_SORTING: SortingState = [{ id: "score", desc: true }];

const decimalFormat = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const factorFormat = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function SortButton({
    column,
    children,
    title,
}: {
    column: Column<typeof features, PlayerStanding, unknown>;
    children: React.ReactNode;
    title?: string;
}) {
    const sorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 px-3 text-xs font-bold tracking-[0.06em] uppercase"
            title={title}
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            {children}
            {sorted === "asc" ? (
                <ArrowUp className="size-3.5" />
            ) : sorted === "desc" ? (
                <ArrowDown className="size-3.5" />
            ) : (
                <ArrowUpDown className="size-3.5 opacity-60" />
            )}
        </Button>
    );
}

const columns: ColumnDef<typeof features, PlayerStanding>[] = [
    {
        id: "rank",
        header: "#",
        cell: ({ row, table }) => {
            const rank = table.getRowModel().rows.findIndex((r) => r.id === row.id) + 1;
            return <span className="text-muted-foreground font-bold tabular-nums">{rank}</span>;
        },
        enableSorting: false,
    },
    {
        accessorKey: "player",
        header: ({ column }) => <SortButton column={column}>Spieler</SortButton>,
        cell: ({ getValue }) => <span className="font-semibold">{getValue() as string}</span>,
    },
    {
        accessorKey: "score",
        header: ({ column }) => (
            <SortButton column={column} title="Wertung: Punkte × Form × Aktivität">
                Score
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center font-extrabold tabular-nums">
                {decimalFormat.format(getValue() as number)}
            </span>
        ),
        sortFn: "basic",
    },
    {
        accessorKey: "points",
        header: ({ column }) => (
            <SortButton
                column={column}
                title="Teilnahmepunkte plus Podestpunkte × Turnierkoeffizient"
            >
                Punkte
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">
                {decimalFormat.format(getValue() as number)}
            </span>
        ),
        sortFn: "basic",
    },
    {
        accessorKey: "form",
        header: ({ column }) => (
            <SortButton
                column={column}
                title="Punkte pro Turnier im Vergleich zum Durchschnitt (über 1 = besser)"
            >
                Form
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">
                ×{factorFormat.format(getValue() as number)}
            </span>
        ),
        sortFn: "basic",
    },
    {
        accessorKey: "activity",
        header: ({ column }) => (
            <SortButton column={column} title="Abzug für verpasste Turniere (×1,00 = kein Abzug)">
                Aktivität
            </SortButton>
        ),
        cell: ({ getValue }) => (
            <span className="block text-center tabular-nums">
                ×{factorFormat.format(getValue() as number)}
            </span>
        ),
        sortFn: "basic",
    },
    {
        id: "placements",
        // Sorts by wins, then 2nd places, then 3rd places.
        accessorFn: (row) => row.firstPlace * 10_000 + row.secondPlace * 100 + row.thirdPlace,
        header: ({ column }) => (
            <SortButton column={column} title="Platzierungen: 1. / 2. / 3. Plätze">
                1/2/3
            </SortButton>
        ),
        cell: ({ row }) => (
            <span className="block text-center whitespace-nowrap tabular-nums">
                {row.original.firstPlace}/{row.original.secondPlace}/{row.original.thirdPlace}
            </span>
        ),
        sortFn: "basic",
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

    const table = useTable({
        features,
        data,
        columns,
        onSortingChange: setSorting,
        state: { sorting },
    });

    return (
        <div className={tableCardClassName}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={stickyColumnClassName(header.column.id, true)}
                                >
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
                            <TableRow key={row.id} className="group/row">
                                {row.getAllCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={stickyColumnClassName(cell.column.id, true)}
                                    >
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
    const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

    const table = useTable({
        features,
        data,
        columns: columnsNoRank,
        onSortingChange: setSorting,
        state: { sorting },
    });

    return (
        <div className={tableCardClassName}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={stickyColumnClassName(header.column.id, false)}
                                >
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
                        <TableRow key={row.id} className="group/row">
                            {row.getAllCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={stickyColumnClassName(cell.column.id, false)}
                                >
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
