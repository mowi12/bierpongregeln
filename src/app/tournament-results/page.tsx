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
    tournaments,
} from "@/lib/tournament-utils";

function StandingsPanel({
    value,
    standings,
    description,
}: {
    value: string;
    standings: PlayerStanding[];
    description: string;
}) {
    return (
        <TabsContent value={value} className="flex flex-col gap-6">
            <Podium standings={getQualifiedStandings(standings)} />
            <section className="flex flex-col gap-3">
                <div className="ml-1">
                    <SectionLabel>Rangliste</SectionLabel>
                    <p className="text-muted-foreground mt-1 text-[0.8125rem]">{description}</p>
                </div>
                <StandingsTable data={standings} />
            </section>
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
                description="Punkte aus allen Turnieren mit Podestplatz."
                actions={
                    <TabsList aria-label="Rangliste wählen" className="w-full sm:w-72">
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="single">Einzel</TabsTrigger>
                    </TabsList>
                }
            />

            <div className="mt-6 grid gap-10 lg:mt-9 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
                <div className="min-w-0">
                    <StandingsPanel
                        value="team"
                        standings={getTeamStandings()}
                        description="Gesamtpunktzahl aller Spieler aus Team-Turnieren."
                    />
                    <StandingsPanel
                        value="single"
                        standings={getSingleStandings()}
                        description="Gesamtpunktzahl aller Spieler aus Einzel-Turnieren."
                    />
                </div>

                <aside className="flex flex-col gap-8">
                    <section className="flex flex-col gap-3">
                        <SectionLabel className="ml-1">Punktevergabe</SectionLabel>
                        <div className="grid grid-cols-3 gap-2">
                            <RatingCard points={rating.firstPlace} place={1} />
                            <RatingCard points={rating.secondPlace} place={2} />
                            <RatingCard points={rating.thirdPlace} place={3} />
                        </div>
                        <p className="text-muted-foreground ml-1 text-[0.8125rem]">
                            Die Gesamtpunktzahl eines Spielers ergibt sich aus der Summe der Punkte
                            aller Turniere, an denen er auf einem der drei Podestplätze gelandet
                            ist.
                        </p>
                    </section>
                    <section className="hidden flex-col gap-3 lg:flex">
                        <SectionLabel className="ml-1">Letzte Turniere</SectionLabel>
                        <RecentTournaments tournaments={getRecentTournaments(3)} />
                    </section>
                </aside>
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
