"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/composites/page-header";
import { SectionLabel } from "@/components/composites/section-label";
import { GeneratorSlider } from "@/components/composites/tournament-generator/generator-slider";
import { TournamentModeCard } from "@/components/composites/tournament-generator/tournament-mode-card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    formatDuration,
    type GeneratorInputs,
    generateTournamentModes,
    type TournamentMode,
} from "@/lib/tournament-generator";

type ModeType = TournamentMode["type"];

const MODE_LABELS: Record<ModeType, string> = {
    freeForAll: "Jeder gegen Jeden",
    groupPhase: "Gruppenphase",
    swiss: "Schweizer System",
};

const DEFAULTS: GeneratorInputs = {
    players: 6,
    maxTeamSize: 2,
    tables: 1,
    minutesPerGame: 15,
    maxDuration: 120,
};

export default function TournamentGeneratorPage() {
    const [inputs, setInputs] = useState<GeneratorInputs>(DEFAULTS);
    const [enabledModes, setEnabledModes] = useState<Record<ModeType, boolean>>({
        freeForAll: true,
        groupPhase: true,
        swiss: true,
    });

    function toggleMode(type: ModeType) {
        setEnabledModes((prev) => ({ ...prev, [type]: !prev[type] }));
    }

    function set(key: keyof GeneratorInputs) {
        return (value: number) =>
            setInputs((prev) => {
                const next = { ...prev, [key]: value };
                if (next.maxDuration < next.minutesPerGame) {
                    next.maxDuration = next.minutesPerGame;
                }
                return next;
            });
    }

    const allModes = generateTournamentModes(inputs).filter((m) => enabledModes[m.type]);
    const fitting = allModes.filter((m) => m.totalDuration <= inputs.maxDuration);
    const exceeding = allModes.filter((m) => m.totalDuration > inputs.maxDuration);
    const bestFitDuration = fitting.length > 0 ? fitting[fitting.length - 1].totalDuration : -1;
    // Show the recommendation(s) first, the remaining suggestions keep their order
    const withinLimit = [
        ...fitting.filter((m) => m.totalDuration === bestFitDuration),
        ...fitting.filter((m) => m.totalDuration !== bestFitDuration),
    ];

    return (
        <>
            <PageHeader
                title="Turniermodus Generator"
                description="Passende Turniermodi für Spieler, Tische und verfügbare Zeit."
            />

            <div className="mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[23.75rem_minmax(0,1fr)] lg:items-start">
                <section
                    aria-label="Einstellungen"
                    className="bg-card flex flex-col gap-6 rounded-xl border p-5 md:p-7 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:max-h-[calc(100dvh-var(--header-height)-3rem)] lg:overflow-y-auto lg:rounded-3xl"
                >
                    <SectionLabel>Einstellungen</SectionLabel>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
                        <GeneratorSlider
                            id="players"
                            label="Spieleranzahl"
                            value={inputs.players}
                            min={2}
                            max={50}
                            onChange={set("players")}
                        />
                        <GeneratorSlider
                            id="maxTeamSize"
                            label="Maximale Teamgröße"
                            value={inputs.maxTeamSize}
                            min={1}
                            max={4}
                            onChange={set("maxTeamSize")}
                        />
                        <GeneratorSlider
                            id="tables"
                            label="Anzahl Tische"
                            value={inputs.tables}
                            min={1}
                            max={10}
                            onChange={set("tables")}
                        />
                        <GeneratorSlider
                            id="minutesPerGame"
                            label="Spieldauer"
                            value={inputs.minutesPerGame}
                            min={1}
                            max={60}
                            format={formatDuration}
                            onChange={set("minutesPerGame")}
                        />
                        <GeneratorSlider
                            id="maxDuration"
                            label="Maximale Turnierdauer"
                            value={inputs.maxDuration}
                            min={inputs.minutesPerGame}
                            max={480}
                            format={formatDuration}
                            onChange={set("maxDuration")}
                        />
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <p className="text-[0.9375rem] font-semibold">Spielmodi</p>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(MODE_LABELS) as ModeType[]).map((type) => (
                                <Button
                                    key={type}
                                    variant={enabledModes[type] ? "default" : "outline"}
                                    size="sm"
                                    aria-pressed={enabledModes[type]}
                                    onClick={() => toggleMode(type)}
                                >
                                    {MODE_LABELS[type]}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                <section aria-label="Vorschläge" className="flex min-w-0 flex-col gap-3">
                    <div className="ml-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <SectionLabel>Vorschläge</SectionLabel>
                        <span className="text-muted-foreground text-[0.8125rem]">
                            {withinLimit.length} von {allModes.length} im Zeitrahmen
                        </span>
                    </div>

                    {withinLimit.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {withinLimit.map((mode) => (
                                <TournamentModeCard
                                    key={mode.id}
                                    mode={mode}
                                    players={inputs.players}
                                    maxDuration={inputs.maxDuration}
                                    isBestFit={mode.totalDuration === bestFitDuration}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="bg-card text-muted-foreground rounded-xl border p-5 lg:rounded-3xl">
                            Keine Turniervorschläge für die gewählten Einstellungen.
                        </p>
                    )}

                    {exceeding.length > 0 && (
                        <Collapsible defaultOpen={false} className="mt-2">
                            <CollapsibleTrigger className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex min-h-11 items-center gap-1.5 rounded-full px-1 text-sm font-semibold transition-colors outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
                                <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
                                {exceeding.length}{" "}
                                {exceeding.length === 1
                                    ? "Vorschlag überschreitet"
                                    : "Vorschläge überschreiten"}{" "}
                                die maximale Turnierdauer
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1 flex flex-col gap-3">
                                {exceeding.map((mode) => (
                                    <TournamentModeCard
                                        key={mode.id}
                                        mode={mode}
                                        players={inputs.players}
                                        maxDuration={inputs.maxDuration}
                                    />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                </section>
            </div>
        </>
    );
}
