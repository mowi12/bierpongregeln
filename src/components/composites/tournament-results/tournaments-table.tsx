import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type Tournament, formatDate, formatFlavor } from "@/lib/tournament-utils";

export function TournamentsTable({ tournaments }: { tournaments: Tournament[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Flavor</TableHead>
                        <TableHead>1. Platz</TableHead>
                        <TableHead>2. Platz</TableHead>
                        <TableHead>3. Platz</TableHead>
                        <TableHead>Teilnehmer</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tournaments.map((t) => (
                        <TableRow key={t.id}>
                            <TableCell>{formatDate(t.date)}</TableCell>
                            <TableCell>{t.type === "team" ? "Team" : "Einzel"}</TableCell>
                            <TableCell>{formatFlavor(t.flavor)}</TableCell>
                            <TableCell className="font-medium text-yellow-600">
                                {t.firstPlace.join(" & ")}
                            </TableCell>
                            <TableCell className="font-medium text-slate-500">
                                {t.secondPlace.join(" & ")}
                            </TableCell>
                            <TableCell className="font-medium text-amber-700">
                                {t.thirdPlace.join(" & ")}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {t.participants.length}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
