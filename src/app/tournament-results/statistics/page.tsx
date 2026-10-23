import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/composites/page-header";
import { SectionLabel } from "@/components/composites/section-label";
import { ParticipationChart } from "@/components/composites/tournament-stats/participation-chart";
import { RaceChart } from "@/components/composites/tournament-stats/race-chart";
import { RecordCards } from "@/components/composites/tournament-stats/record-cards";
import { StatTiles } from "@/components/composites/tournament-stats/stat-tiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOverview, getParticipation, getRace, getRecords } from "@/lib/tournament-stats";
import { QUALIFIED_MIN_PARTICIPATIONS, type TournamentType } from "@/lib/tournament-utils";

export const metadata: Metadata = {
    title: "Statistiken | Bierpongregeln",
    description: "Zahlen, Verläufe und Rekorde aus allen Bierpong-Turnieren.",
};

function StatsPanel({ value }: { value: TournamentType }) {
    return (
        <TabsContent value={value} className="flex flex-col gap-10 lg:gap-14">
            <StatTiles overview={getOverview(value)} />
            <section className="flex flex-col gap-3">
                <SectionLabel className="ml-1">Das Rennen um Platz 1</SectionLabel>
                <RaceChart race={getRace(value)} />
            </section>
            <section className="flex flex-col gap-3">
                <div className="ml-1">
                    <SectionLabel>Teilnehmer pro Turnier</SectionLabel>
                    <p className="text-muted-foreground mt-1 text-[0.8125rem]">
                        Neu dabei heißt: erstes Turnier überhaupt, egal ob Team oder Einzel.
                    </p>
                </div>
                <ParticipationChart data={getParticipation(value)} />
            </section>
            <section className="flex flex-col gap-3">
                <SectionLabel className="ml-1">Rekorde</SectionLabel>
                <RecordCards records={getRecords(value, QUALIFIED_MIN_PARTICIPATIONS)} />
            </section>
        </TabsContent>
    );
}

export default function StatisticsPage() {
    return (
        <Tabs defaultValue="team" className="gap-0">
            <Link
                href="/tournament-results"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 -ml-2 mb-3 inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg px-2 text-[0.9375rem] font-semibold transition-colors duration-150 outline-none focus-visible:ring-[3px]"
            >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Ergebnisse
            </Link>
            <PageHeader
                title="Statistiken"
                description="Zahlen, Verläufe und Rekorde aus allen Turnieren."
                actions={
                    <TabsList aria-label="Turniertyp wählen" className="w-full sm:w-72">
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="single">Einzel</TabsTrigger>
                    </TabsList>
                }
            />
            <div className="mt-6 lg:mt-9">
                <StatsPanel value="team" />
                <StatsPanel value="single" />
            </div>
        </Tabs>
    );
}
