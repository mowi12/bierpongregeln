import { ChartLine } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/composites/page-header";
import { SectionLabel } from "@/components/composites/section-label";
import { Podium } from "@/components/composites/tournament-results/podium";
import { RatingCard } from "@/components/composites/tournament-results/rating-card";
import { RecentTournaments } from "@/components/composites/tournament-results/recent-tournaments";
import {
    ScoreExplanationButton,
    ScoreExplanationProvider,
} from "@/components/composites/tournament-results/score-explanation";
import { StandingsTable } from "@/components/composites/tournament-results/standings-table";
import { TournamentsTable } from "@/components/composites/tournament-results/tournaments-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getBoardScoring,
    getQualifiedStandings,
    getRecentTournaments,
    rating,
    scoring,
    type TournamentType,
    tournaments,
} from "@/lib/tournament-utils";

function StandingsPanel({ value, description }: { value: TournamentType; description: string }) {
    const board = getBoardScoring(value);
    const standings = board.standings;

    return (
        <TabsContent
            value={value}
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8"
        >
            <ScoreExplanationProvider
                type={value}
                breakdowns={board.breakdowns}
                medianGamesToWin={board.medianGamesToWin}
                averagePoints={board.averagePoints}
            >
                <div className="flex min-w-0 flex-col gap-6">
                    <Podium standings={getQualifiedStandings(standings)} />
                    <section className="flex flex-col gap-3">
                        <div className="ml-1 flex items-center justify-between gap-3">
                            <div>
                                <SectionLabel>Rangliste</SectionLabel>
                                <p className="text-muted-foreground mt-1 text-[0.8125rem]">
                                    {description}
                                </p>
                            </div>
                            <Button asChild variant="outline" className="shrink-0">
                                <Link href="/tournament-results/statistics">
                                    <ChartLine aria-hidden="true" />
                                    Statistiken
                                </Link>
                            </Button>
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
                                Podestpunkte werden mit dem Turnierkoeffizienten multipliziert: Je
                                mehr Spiele der Sieger bis einschließlich Finale spielt, desto mehr
                                zählt das Turnier. Dazu kommt {scoring.participationPoints} Punkt
                                pro Teilnahme.
                            </p>
                            <p>
                                Gerankt wird nach dem Score = Punkte × Form × Aktivität. Die Form
                                vergleicht die Punkte pro Turnier mit dem Durchschnitt, die
                                Aktivität zieht für verpasste Turniertage ab.
                            </p>
                        </div>
                        <ScoreExplanationButton />
                    </section>
                    <section className="hidden flex-col gap-3 lg:flex">
                        <SectionLabel className="ml-1">Letzte Turniere</SectionLabel>
                        <RecentTournaments tournaments={getRecentTournaments(value, 3)} />
                    </section>
                </aside>
            </ScoreExplanationProvider>
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
                    description="Wertung aller Spieler aus Team-Turnieren."
                />
                <StandingsPanel
                    value="single"
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
