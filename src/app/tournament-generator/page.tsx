"use client";

import { useState } from "react";
import {
    generateTournamentModes,
    GeneratorInputs,
    TournamentMode,
    formatDuration,
} from "@/lib/tournament-generator";
import { Button } from "@/components/ui/button";
import { TournamentModeCard } from "@/components/composites/tournament-generator/tournament-mode-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

function GeneratorInput({
    label,
    value,
    min,
    max,
    unit,
    format,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    unit?: string;
    format?: (v: number) => string;
    onChange: (v: number) => void;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
                <label className="font-medium">{label}</label>
                <span className="text-muted-foreground tabular-nums">
                    {format ? format(value) : unit ? `${value} ${unit}` : value}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="accent-primary w-full"
            />
        </div>
    );
}

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
    const withinLimit = allModes.filter((m) => m.totalDuration <= inputs.maxDuration);
    const exceeding = allModes.filter((m) => m.totalDuration > inputs.maxDuration);
    const bestFitDuration =
        withinLimit.length > 0 ? withinLimit[withinLimit.length - 1].totalDuration : -1;

    return (
        <div className="mx-auto max-w-4xl space-y-10 py-8">
            <h1 className="text-3xl font-bold">Turniermodus Generator</h1>

            <section className="space-y-6 rounded-lg border p-6">
                <h2 className="text-xl font-semibold">Einstellungen</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <GeneratorInput
                        label="Spieleranzahl"
                        value={inputs.players}
                        min={2}
                        max={50}
                        onChange={set("players")}
                    />
                    <GeneratorInput
                        label="Maximale Teamgröße"
                        value={inputs.maxTeamSize}
                        min={1}
                        max={4}
                        onChange={set("maxTeamSize")}
                    />
                    <GeneratorInput
                        label="Anzahl Tische"
                        value={inputs.tables}
                        min={1}
                        max={10}
                        onChange={set("tables")}
                    />
                    <GeneratorInput
                        label="Spieldauer"
                        value={inputs.minutesPerGame}
                        min={1}
                        max={60}
                        format={formatDuration}
                        onChange={set("minutesPerGame")}
                    />
                    <GeneratorInput
                        label="Maximale Turnierdauer"
                        value={inputs.maxDuration}
                        min={inputs.minutesPerGame}
                        max={480}
                        format={formatDuration}
                        onChange={set("maxDuration")}
                    />
                </div>
                <div className="space-y-1.5">
                    <p className="text-sm font-medium">Spielmodi</p>
                    <div className="flex flex-wrap gap-2">
                        {(Object.keys(MODE_LABELS) as ModeType[]).map((type) => (
                            <Button
                                key={type}
                                variant={enabledModes[type] ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleMode(type)}
                            >
                                {MODE_LABELS[type]}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-semibold">Vorschläge</h2>
                    <span className="text-muted-foreground text-sm">
                        {withinLimit.length} von {allModes.length} im Zeitrahmen
                    </span>
                </div>

                {withinLimit.length > 0 ? (
                    <div className="space-y-3">
                        {withinLimit.map((mode, i) => (
                            <TournamentModeCard
                                key={i}
                                mode={mode}
                                players={inputs.players}
                                maxDuration={inputs.maxDuration}
                                isBestFit={mode.totalDuration === bestFitDuration}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Keine Turniervorschläge für die gewählten Einstellungen.
                    </p>
                )}

                {exceeding.length > 0 && (
                    <Collapsible defaultOpen={false} className="mt-2">
                        <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors [&[data-state=open]>svg]:rotate-180">
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            {exceeding.length}{" "}
                            {exceeding.length === 1
                                ? "Vorschlag überschreitet"
                                : "Vorschläge überschreiten"}{" "}
                            die maximale Turnierdauer
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-3">
                            {exceeding.map((mode, i) => (
                                <TournamentModeCard
                                    key={i}
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
    );
}
