"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EventCoefficientTable } from "@/components/composites/tournament-results/event-coefficient-table";
import { ScoringLabTable } from "@/components/composites/tournament-results/scoring-lab-table";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    type CoefficientShape,
    computeEventValues,
    computeSystemB,
    DEFAULT_PARAMS,
    evaluateExpectations,
    SCORING_VARIANTS,
    type ScoringParams,
    type TournamentType,
} from "@/lib/scoring";

const COEF_SHAPES: { value: CoefficientShape; label: string }[] = [
    { value: "linear", label: "Linear" },
    { value: "linear-cap2", label: "Linear (max 2×)" },
    { value: "sqrt", label: "Wurzel" },
    { value: "log", label: "Logarithmisch" },
];

function paramsEqual(a: ScoringParams, b: ScoringParams): boolean {
    return (Object.keys(a) as (keyof ScoringParams)[]).every((key) => a[key] === b[key]);
}

function Slider({
    label,
    hint,
    value,
    min,
    max,
    step,
    display,
    onChange,
}: {
    label: string;
    hint: string;
    value: number;
    min: number;
    max: number;
    step: number;
    display: string;
    onChange: (v: number) => void;
}) {
    return (
        <label className="block space-y-1.5" title={hint}>
            <span className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground tabular-nums">{display}</span>
            </span>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="accent-primary w-full"
            />
        </label>
    );
}

export default function ScoringLabPage() {
    const [params, setParams] = useState<ScoringParams>(DEFAULT_PARAMS);
    const [board, setBoard] = useState<TournamentType>("team");

    const set = <K extends keyof ScoringParams>(key: K) => {
        return (value: ScoringParams[K]) => setParams((prev) => ({ ...prev, [key]: value }));
    };

    const setRounded = (key: "efficiencyExponent" | "decayBase", decimals: number) => {
        const factor = 10 ** decimals;
        return (value: number) =>
            setParams((prev) => ({ ...prev, [key]: Math.round(value * factor) / factor }));
    };

    const activeVariantId = useMemo(() => {
        const match = SCORING_VARIANTS.find((v) => paramsEqual(v.params, params));
        return match?.id ?? "custom";
    }, [params]);

    const standings = useMemo(() => computeSystemB(board, params), [board, params]);
    const eventValues = useMemo(() => computeEventValues(board, params), [board, params]);
    const expectations = useMemo(() => evaluateExpectations(params), [params]);
    const passedCount = expectations.filter((e) => e.passed).length;

    return (
        <div className="mx-auto max-w-4xl space-y-10 py-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Wertungs-Labor</h1>
                <p className="text-muted-foreground">
                    Experimenteller Vergleich alternativer Wertungssysteme. Ändert nichts an der{" "}
                    <Link href="/tournament-results" className="underline">
                        aktuellen Rangliste
                    </Link>{" "}
                    – hier lassen sich Varianten durchspielen und mit dem Ist-Zustand vergleichen
                    (Spalte&nbsp;Δ).
                </p>
            </div>

            <Collapsible defaultOpen={false} className="rounded-lg border p-4">
                <CollapsibleTrigger className="flex w-full items-center gap-1 text-left text-sm font-medium [&[data-state=open]>svg]:rotate-180">
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    So wird gerechnet (System B)
                </CollapsibleTrigger>
                <CollapsibleContent className="text-muted-foreground mt-3 space-y-2 text-sm">
                    <p>Pro Spieler und Rangliste (Team / Einzel getrennt):</p>
                    <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                        {`A       = Σ Teilnahmepunkte                       (fix, nicht skaliert)
        + Σ Platzpunkte × Koeffizient(Turnier)   (nach Feldgröße skaliert)

Koeffizient = f(Feldgröße / Median),  Median-Turnier = 1.0×
              Feldgröße = Spieler (Einzel) bzw. Teams (Team)

adjPpg  = (A + Shrinkage · ØPpg) / (Teilnahmen + Shrinkage)
Eff     = (adjPpg / ØPpg) ^ Effizienz-Exponent
Inakt   = Decay-Basis ^ max(0, verpasste Turniere − Karenz)

Score   = A × Eff × Inakt`}
                    </pre>
                    <p>
                        Fixiert nach dem Sensitivitäts-Test: Wurzel-Koeffizient, Shrinkage&nbsp;2,
                        Effizienz-Exponent&nbsp;0,8, Decay&nbsp;0,9 mit Karenz&nbsp;2. Offen zum
                        Justieren bleiben Teilnahmepunkt und Sieggewicht.
                    </p>
                </CollapsibleContent>
            </Collapsible>

            <section className="space-y-6 rounded-lg border p-6">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Variante</h2>
                    <div className="flex flex-wrap gap-2">
                        {SCORING_VARIANTS.map((variant) => (
                            <Button
                                key={variant.id}
                                variant={activeVariantId === variant.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setParams(variant.params)}
                            >
                                {variant.name}
                            </Button>
                        ))}
                        <Button
                            variant={activeVariantId === "custom" ? "default" : "outline"}
                            size="sm"
                            disabled={activeVariantId !== "custom"}
                        >
                            Eigene
                        </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {SCORING_VARIANTS.find((v) => v.id === activeVariantId)?.description ??
                            "Eigene Parameter – über die Regler unten angepasst."}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <Slider
                        label="Teilnahmepunkt"
                        hint="Feste Punkte pro Turnierteilnahme, unabhängig vom Platz."
                        value={params.participationPoint}
                        min={0}
                        max={8}
                        step={1}
                        display={`${params.participationPoint}`}
                        onChange={set("participationPoint")}
                    />
                    <Slider
                        label="Sieggewicht (1. Platz)"
                        hint="Punkte für den 1. Platz vor dem Feldgrößen-Koeffizienten."
                        value={params.firstPlaceWeight}
                        min={10}
                        max={30}
                        step={1}
                        display={`${params.firstPlaceWeight}  (2./3. fix ${params.secondPlaceWeight}/${params.thirdPlaceWeight})`}
                        onChange={set("firstPlaceWeight")}
                    />
                    <Slider
                        label="Shrinkage (K)"
                        hint="Pseudo-Turniere am Feldschnitt, die die Effizienz-Quote kleiner Stichproben stabilisieren."
                        value={params.shrinkage}
                        min={0}
                        max={6}
                        step={1}
                        display={`${params.shrinkage}`}
                        onChange={set("shrinkage")}
                    />
                    <Slider
                        label="Effizienz-Exponent (k)"
                        hint="0 schaltet den Effizienz-Multiplikator ab, höhere Werte lassen die Punkte-pro-Spiel stärker durchschlagen."
                        value={params.efficiencyExponent}
                        min={0}
                        max={1.5}
                        step={0.1}
                        display={params.efficiencyExponent.toFixed(1)}
                        onChange={setRounded("efficiencyExponent", 1)}
                    />
                    <Slider
                        label="Decay-Basis (d)"
                        hint="Faktor pro verpasstem Turnier über die Karenz hinaus. 1 schaltet die Inaktivitäts-Strafe ab."
                        value={params.decayBase}
                        min={0.7}
                        max={1}
                        step={0.01}
                        display={params.decayBase.toFixed(2)}
                        onChange={setRounded("decayBase", 2)}
                    />
                    <Slider
                        label="Decay-Karenz (G)"
                        hint="Anzahl verpasster Turniere, die vor Einsetzen der Strafe verziehen werden."
                        value={params.decayGrace}
                        min={0}
                        max={4}
                        step={1}
                        display={`${params.decayGrace}`}
                        onChange={set("decayGrace")}
                    />
                </div>

                <div className="space-y-1.5">
                    <p className="text-sm font-medium">Feldgrößen-Koeffizient</p>
                    <div className="flex flex-wrap gap-2">
                        {COEF_SHAPES.map((shape) => (
                            <Button
                                key={shape.value}
                                variant={
                                    params.coefficientShape === shape.value ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => set("coefficientShape")(shape.value)}
                            >
                                {shape.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-xl font-semibold">Erwartungen</h2>
                    <span className="text-muted-foreground text-sm tabular-nums">
                        {passedCount} von {expectations.length} erfüllt
                    </span>
                </div>
                <ul className="space-y-1.5 text-sm">
                    {expectations.map((e) => (
                        <li key={e.id} className="flex gap-2">
                            <span
                                className={
                                    e.passed
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-red-600 dark:text-red-400"
                                }
                            >
                                {e.passed ? "✓" : "✕"}
                            </span>
                            <span>
                                <span className="text-muted-foreground">
                                    [{e.board === "team" ? "Team" : "Einzel"} · {e.id}]
                                </span>{" "}
                                {e.description}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-baseline gap-3">
                    <h2 className="text-xl font-semibold">Rangliste</h2>
                    <div className="flex gap-2">
                        <Button
                            variant={board === "team" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBoard("team")}
                        >
                            Team
                        </Button>
                        <Button
                            variant={board === "single" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBoard("single")}
                        >
                            Einzel
                        </Button>
                    </div>
                </div>
                <ScoringLabTable players={standings} />
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Turnierwertigkeit ({board === "team" ? "Team" : "Einzel"})
                </h2>
                <p className="text-muted-foreground text-sm">
                    Feldgrößen-Koeffizient je Turnier und was ein Podestplatz dort wert ist
                    (Platzgewicht&nbsp;× Koeffizient). Referenz ist das Median-Turnier mit{" "}
                    {eventValues[0]?.medianFieldSize ?? 0} {board === "team" ? "Teams" : "Spielern"}{" "}
                    → Koeffizient&nbsp;1,00×. Umschalten über Team&nbsp;/&nbsp;Einzel oben.
                </p>
                <EventCoefficientTable
                    events={eventValues}
                    unit={board === "team" ? "Teams" : "Spieler"}
                />
            </section>
        </div>
    );
}
