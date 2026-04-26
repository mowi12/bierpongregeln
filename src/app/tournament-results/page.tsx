import {
    formatDate,
    formatFlavor,
    rating,
    tournaments,
    getTeamStandings,
    getSingleStandings,
} from "@/lib/tournament-utils";
import { StandingsTable } from "@/components/composites/standings-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function TournamentResultsPage() {
    const teamStandings = getTeamStandings();
    const singleStandings = getSingleStandings();
    const sortedTournaments = [...tournaments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return (
        <div className="mx-auto max-w-4xl space-y-12 py-8">
            <h1 className="text-3xl font-bold">Turnierergebnisse</h1>

            {/* Section 1: Score Calculation */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Punktevergabe</h2>
                <p className="text-muted-foreground">
                    Die Gesamtpunktzahl eines Spielers ergibt sich aus der Summe der Punkte aller
                    Turniere, an denen er auf einem der drei Podestplätze gelandet ist.
                </p>
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-500">🥇</div>
                        <div className="mt-1 text-3xl font-bold">{rating.firstPlace}</div>
                        <div className="text-muted-foreground text-sm">Punkte für Platz 1</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                        <div className="text-2xl font-bold text-slate-400">🥈</div>
                        <div className="mt-1 text-3xl font-bold">{rating.secondPlace}</div>
                        <div className="text-muted-foreground text-sm">Punkte für Platz 2</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                        <div className="text-2xl font-bold text-amber-700">🥉</div>
                        <div className="mt-1 text-3xl font-bold">{rating.thirdPlace}</div>
                        <div className="text-muted-foreground text-sm">Punkte für Platz 3</div>
                    </div>
                </div>
            </section>

            {/* Section 2: Team Tournament Standings */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Team-Rangliste</h2>
                <p className="text-muted-foreground">
                    Gesamtpunktzahl aller Spieler aus Team-Turnieren. Spalten sind sortierbar.
                </p>
                <StandingsTable data={teamStandings} />
            </section>

            {/* Section 3: Single Tournament Standings */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Einzel-Rangliste</h2>
                <p className="text-muted-foreground">
                    Gesamtpunktzahl aller Spieler aus Einzel-Turnieren. Spalten sind sortierbar.
                </p>
                <StandingsTable data={singleStandings} />
            </section>

            {/* Section 4: All Tournaments */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Alle Turniere</h2>
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
                            {sortedTournaments.map((t, i) => (
                                <TableRow key={i}>
                                    <TableCell>{formatDate(t.date)}</TableCell>
                                    <TableCell className="capitalize">
                                        {t.type === "team" ? "Team" : "Einzel"}
                                    </TableCell>
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
            </section>
        </div>
    );
}
