import { PageHeader } from "@/components/composites/page-header";
import { SectionLabel } from "@/components/composites/section-label";
import { Podium } from "@/components/composites/tournament-results/podium";
import { RatingCard } from "@/components/composites/tournament-results/rating-card";
import { RecentTournaments } from "@/components/composites/tournament-results/recent-tournaments";
import { StandingsTable } from "@/components/composites/tournament-results/standings-table";
import { TournamentsTable } from "@/components/composites/tournament-results/tournaments-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getQualifiedStandings,
    getRecentTournaments,
    getSingleStandings,
    getTeamStandings,
    type PlayerStanding,
    rating,
    scoring,
    type TournamentType,
    tournaments,
} from "@/lib/tournament-utils";

function StandingsPanel({
    value,
    standings,
    description,
}: {
    value: TournamentType;
    standings: PlayerStanding[];
    description: string;
}) {
    return (
        <TabsContent
            value={value}
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8"
        >
            <div className="flex min-w-0 flex-col gap-6">
                <Podium standings={getQualifiedStandings(standings)} />
                <section className="flex flex-col gap-3">
                    <div className="ml-1">
                        <SectionLabel>Rangliste</SectionLabel>
                        <p className="text-muted-foreground mt-1 text-[0.8125rem]">{description}</p>
                    </div>
                    <StandingsTable data={standings} />
                </section>
            </div>

            <aside className="flex flex-col gap-8">
                <section className="flex flex-col gap-3">
                    <SectionLabel className="ml-1">Punktevergabe</SectionLabel>
                    <div className="grid grid-cols-3 gap-2">
                        <RatingCard points={rating.firstPlace} place={1} />
                        <RatingCard points={rating.secondPlace} place={2} />
                        <RatingCard points={rating.thirdPlace} place={3} />
                    </div>
                    <div className="text-muted-foreground ml-1 flex flex-col gap-2 text-[0.8125rem]">
                        <p>
                            Podestpunkte werden mit dem Turnierkoeffizienten multipliziert: Je mehr
                            Spiele bis zum Sieg nötig sind, desto mehr zählt das Turnier
                            (logarithmisch, ein durchschnittliches Turnier zählt 1,0×). Dazu kommt{" "}
                            {scoring.participationPoints} Punkt pro Teilnahme.
                        </p>
                        <p>Gerankt wird nach dem Score = Punkte × Form × Aktivität.</p>
                        <p>
                            <span className="text-foreground font-semibold">Form</span> vergleicht
                            die Punkte pro Turnier mit dem Durchschnitt. Bei wenigen Teilnahmen wird
                            sie zum Durchschnitt hin gezogen, damit ein einzelner Glückstreffer
                            nicht überbewertet wird.
                        </p>
                        <p>
                            <span className="text-foreground font-semibold">Aktivität</span> zieht
                            für jeden verpassten Turniertag nach den ersten{" "}
                            {scoring.inactivityGrace} jeweils{" "}
                            {Math.round((1 - scoring.inactivityDecay) * 100)}&nbsp;% ab. Mehrere
                            Turniere am selben Tag zählen als ein Tag.
                        </p>
                    </div>
                </section>
                <section className="hidden flex-col gap-3 lg:flex">
                    <SectionLabel className="ml-1">Letzte Turniere</SectionLabel>
                    <RecentTournaments tournaments={getRecentTournaments(value, 3)} />
                </section>
            </aside>
        </TabsContent>
    );
}

export default function TournamentResultsPage() {
    const sortedTournaments = [...tournaments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return (
        <Tabs defaultValue="team" className="gap-0">
            <PageHeader
                title="Ergebnisse"
                description="Wertung aus Podestplätzen, Turnierlänge, Form und Aktivität."
                actions={
                    <TabsList aria-label="Rangliste wählen" className="w-full sm:w-72">
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="single">Einzel</TabsTrigger>
                    </TabsList>
                }
            />

            <div className="mt-6 lg:mt-9">
                <StandingsPanel
                    value="team"
                    standings={getTeamStandings()}
                    description="Wertung aller Spieler aus Team-Turnieren."
                />
                <StandingsPanel
                    value="single"
                    standings={getSingleStandings()}
                    description="Wertung aller Spieler aus Einzel-Turnieren."
                />
            </div>

            <section
                id="alle-turniere"
                className="mt-12 flex scroll-mt-6 flex-col gap-3 lg:mt-16 lg:scroll-mt-0"
            >
                <SectionLabel className="ml-1">Alle Turniere</SectionLabel>
                <TournamentsTable tournaments={sortedTournaments} />
            </section>
        </Tabs>
    );
}
