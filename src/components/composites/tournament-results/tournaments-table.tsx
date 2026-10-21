import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate, formatFlavor, type Tournament } from "@/lib/tournament-utils";

export function TournamentsTable({ tournaments }: { tournaments: Tournament[] }) {
    return (
        <div className="bg-card overflow-hidden rounded-xl border lg:rounded-3xl">
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
                            <TableCell className="text-primary font-bold">
                                {t.firstPlace.join(" & ")}
                            </TableCell>
                            <TableCell className="text-coral-ink font-semibold">
                                {t.secondPlace.join(" & ")}
                            </TableCell>
                            <TableCell className="font-semibold">
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
