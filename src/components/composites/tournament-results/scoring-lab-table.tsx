"use client";

import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { ScoredPlayer } from "@/lib/scoring";
import { QUALIFIED_MIN_PARTICIPATIONS } from "@/lib/tournament-utils";

function DeltaCell({ player, rank }: { player: ScoredPlayer; rank: number }) {
    if (player.currentRank === null) {
        return <span className="text-muted-foreground">neu</span>;
    }
    const delta = player.currentRank - rank;
    if (delta === 0) return <span className="text-muted-foreground">–</span>;
    return (
        <span
            className={
                delta > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
            }
        >
            {delta > 0 ? `▲ ${delta}` : `▼ ${-delta}`}
        </span>
    );
}

function Rows({ players, startRank }: { players: ScoredPlayer[]; startRank: number }) {
    return (
        <>
            {players.map((p, i) => {
                const rank = startRank + i;
                return (
                    <TableRow key={p.player}>
                        <TableCell className="text-muted-foreground tabular-nums">{rank}</TableCell>
                        <TableCell className="font-medium">{p.player}</TableCell>
                        <TableCell className="text-center tabular-nums">
                            {p.participations}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                            {p.firstPlace}/{p.secondPlace}/{p.thirdPlace}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                            {p.baseScore.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                            {p.efficiencyMultiplier.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                            {p.decay.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-semibold tabular-nums">
                            {p.finalScore.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                            <DeltaCell player={p} rank={rank} />
                        </TableCell>
                    </TableRow>
                );
            })}
        </>
    );
}

const HEADERS: { label: string; title: string; align?: "left" }[] = [
    { label: "#", title: "Rang", align: "left" },
    { label: "Spieler", title: "Spieler", align: "left" },
    { label: "TN", title: "Teilnahmen" },
    { label: "1/2/3", title: "Erste / zweite / dritte Plätze" },
    { label: "Punkte", title: "Rohpunktzahl A (Teilnahme + gewichtete Podestpunkte)" },
    { label: "×Eff", title: "Effizienz-Multiplikator (geshrinkte Punkte pro Spiel)" },
    { label: "×Inakt", title: "Alterungsfaktor (gealterte Basis / Rohbasis)" },
    { label: "Score", title: "Endpunktzahl = gealterte Basis × Eff" },
    { label: "Δ", title: "Ränge gewonnen (▲) oder verloren (▼) gegenüber der aktuellen Wertung" },
];

export function ScoringLabTable({ players }: { players: ScoredPlayer[] }) {
    const qualified = players.filter((p) => p.participations >= QUALIFIED_MIN_PARTICIPATIONS);
    const unqualified = players.filter((p) => p.participations < QUALIFIED_MIN_PARTICIPATIONS);

    return (
        <div className="space-y-6">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {HEADERS.map((h) => (
                                <TableHead
                                    key={h.label}
                                    title={h.title}
                                    className={h.align === "left" ? "" : "text-center"}
                                >
                                    {h.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {qualified.length > 0 ? (
                            <Rows players={qualified} startRank={1} />
                        ) : (
                            <TableRow>
                                <TableCell colSpan={HEADERS.length} className="h-24 text-center">
                                    Keine Ergebnisse.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {unqualified.length > 0 && (
                <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors [&[data-state=open]>svg]:rotate-180">
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        Spieler mit weniger als {QUALIFIED_MIN_PARTICIPATIONS} Teilnahmen (nicht
                        gewertet)
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {HEADERS.map((h) => (
                                            <TableHead
                                                key={h.label}
                                                title={h.title}
                                                className={h.align === "left" ? "" : "text-center"}
                                            >
                                                {h.label}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Rows players={unqualified} startRank={qualified.length + 1} />
                                </TableBody>
                            </Table>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
}
