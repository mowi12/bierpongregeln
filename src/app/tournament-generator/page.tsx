"use client";

import { useState } from "react";
import {
    generateTournamentModes,
    GeneratorInputs,
    formatDuration,
} from "@/lib/tournament-generator";
import { TournamentModeCard } from "@/components/composites/tournament-generator/tournament-mode-card";

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

    const modes = generateTournamentModes(inputs);
    const withinLimit = modes.filter((m) => m.totalDuration <= inputs.maxDuration).length;

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
            </section>

            <section className="space-y-4">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-semibold">Vorschläge</h2>
                    <span className="text-muted-foreground text-sm">
                        {withinLimit} von {modes.length} im Zeitrahmen
                    </span>
                </div>
                {modes.length > 0 ? (
                    <div className="space-y-3">
                        {modes.map((mode, i) => (
                            <TournamentModeCard
                                key={i}
                                mode={mode}
                                maxDuration={inputs.maxDuration}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Keine Turniervorschläge für die gewählten Einstellungen.
                    </p>
                )}
            </section>
        </div>
    );
}
