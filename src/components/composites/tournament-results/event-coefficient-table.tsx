import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { EventValue } from "@/lib/scoring";
import { formatDate } from "@/lib/tournament-utils";

export function EventCoefficientTable({ events }: { events: EventValue[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Flavor</TableHead>
                        <TableHead className="text-center" title="Teilnehmerzahl">
                            Feld
                        </TableHead>
                        <TableHead className="text-center" title="Spiele bis zum Turniersieg">
                            Spiele
                        </TableHead>
                        <TableHead className="text-center" title="Spiele-Koeffizient">
                            Koeff.
                        </TableHead>
                        <TableHead className="text-center" title="Punkte für den 1. Platz">
                            🥇
                        </TableHead>
                        <TableHead className="text-center" title="Punkte für den 2. Platz">
                            🥈
                        </TableHead>
                        <TableHead className="text-center" title="Punkte für den 3. Platz">
                            🥉
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((e) => {
                        const isMedian = Math.abs(e.coefficient - 1) < 0.005;
                        return (
                            <TableRow key={e.id}>
                                <TableCell className="tabular-nums whitespace-nowrap">
                                    {formatDate(e.date)}
                                </TableCell>
                                <TableCell>{e.flavor}</TableCell>
                                <TableCell className="text-center tabular-nums">
                                    {e.participants}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                    {e.gamesToWin}
                                </TableCell>
                                <TableCell
                                    className="text-center font-semibold tabular-nums"
                                    title={
                                        isMedian ? "Median-Turnier (Koeffizient 1.0)" : undefined
                                    }
                                >
                                    {e.coefficient.toFixed(2)}×
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                    {e.firstPlaceValue.toFixed(1)}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                    {e.secondPlaceValue.toFixed(1)}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                    {e.thirdPlaceValue.toFixed(1)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
