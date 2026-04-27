import { rating, tournaments, getTeamStandings, getSingleStandings } from "@/lib/tournament-utils";
import { StandingsTable } from "@/components/composites/tournament-results/standings-table";
import { RatingCard } from "@/components/composites/tournament-results/rating-card";
import { TournamentsTable } from "@/components/composites/tournament-results/tournaments-table";

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
                <div className="grid grid-cols-3 gap-4">
                    <RatingCard emoji="🥇" points={rating.firstPlace} place={1} />
                    <RatingCard emoji="🥈" points={rating.secondPlace} place={2} />
                    <RatingCard emoji="🥉" points={rating.thirdPlace} place={3} />
                </div>
            </section>

            {/* Section 2: Team Tournament Standings */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Team-Rangliste</h2>
                <p className="text-muted-foreground">
                    Gesamtpunktzahl aller Spieler aus Team-Turnieren.
                </p>
                <StandingsTable data={teamStandings} />
            </section>

            {/* Section 3: Single Tournament Standings */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Einzel-Rangliste</h2>
                <p className="text-muted-foreground">
                    Gesamtpunktzahl aller Spieler aus Einzel-Turnieren.
                </p>
                <StandingsTable data={singleStandings} />
            </section>

            {/* Section 4: All Tournaments */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Alle Turniere</h2>
                <TournamentsTable tournaments={sortedTournaments} />
            </section>
        </div>
    );
}
