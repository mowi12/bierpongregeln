"use client";

import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { Race, RacePlayer } from "@/lib/tournament-stats";

type Mode = "rank" | "score" | "points";
type Filter = "5" | "10" | "all";

const modes: { value: Mode; label: string }[] = [
    { value: "rank", label: "Rang" },
    { value: "score", label: "Score" },
    { value: "points", label: "Punkte" },
];

const filters: { value: Filter; label: string }[] = [
    { value: "5", label: "Top 5" },
    { value: "10", label: "Top 10" },
    { value: "all", label: "Alle" },
];

const descriptions: Record<Mode, string> = {
    rank: "Platz nach jedem Turnier, sortiert wie die Rangliste der Ergebnisseite. Gezeigt werden die Spieler der Rangliste (ab 3 Teilnahmen) ab ihrem ersten Turnier.",
    score: "Score (Punkte × Form × Aktivität) nach jedem Turnier. Nach ihm wird die Rangliste sortiert, wer Turniere verpasst, fällt ab.",
    points: "Punkte nach jedem Turnier: Teilnahmepunkte plus Podestpunkte × Turnierkoeffizient.",
};

// The top ten of the final ranking keep their style in every view and filter. Only five colors
// stay distinguishable, so places 6 to 10 reuse them with a dashed line.
const highlightColors = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"];
const HIGHLIGHTED_PLAYERS = 10;
const DASH = "6 4";
const CHART_HEIGHT_PX = 320;
// Chart height without the x-axis and the top margin
const PLOT_HEIGHT_PX = 282;
const LABEL_HEIGHT_PX = 13;

const decimalFormat = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const factorFormat = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function valuesOf(player: RacePlayer, mode: Mode): (number | null)[] {
    if (mode === "rank") return player.ranks;
    if (mode === "points") return player.points;
    return player.scores;
}

function formatValue(value: number, mode: Mode): string {
    if (mode === "rank") return `#${value}`;
    return decimalFormat.format(value);
}

function joinNames(names: string[]): string {
    return names.length <= 1
        ? (names[0] ?? "")
        : `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`;
}

/** Short line in the style of a series, used in the legend and the tooltip. */
function LineKey({ color, dashed }: { color?: string; dashed?: boolean }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 4" className="h-1 w-4 shrink-0 overflow-visible">
            <line
                x1="1"
                y1="2"
                x2="15"
                y2="2"
                stroke={color ? `var(${color})` : "var(--muted-foreground)"}
                strokeOpacity={color ? 1 : 0.5}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={dashed ? "4 3" : undefined}
            />
        </svg>
    );
}

/** Narrow screens get no end labels, so the plot can use the full width. */
function useIsWide() {
    const [isWide, setIsWide] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(min-width: 40rem)");
        const update = () => setIsWide(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);
    return isWide;
}

function SegmentedControl<T extends string>({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <fieldset className="bg-secondary inline-grid auto-cols-fr grid-flow-col gap-1 rounded-lg p-1">
            <legend className="sr-only">{label}</legend>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    aria-pressed={option.value === value}
                    onClick={() => onChange(option.value)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground focus-visible:ring-ring/50 aria-pressed:bg-card aria-pressed:text-foreground inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-bold whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-[3px] aria-pressed:shadow-sm"
                >
                    {option.label}
                </button>
            ))}
        </fieldset>
    );
}

/**
 * Race for the ranking over all tournaments of one type.
 */
export function RaceChart({ race }: { race: Race }) {
    const { steps } = race;
    const lastStep = steps.length - 1;
    const [mode, setMode] = useState<Mode>("rank");
    const [filter, setFilter] = useState<Filter>("10");
    const isWide = useIsWide();

    const players = useMemo(
        () =>
            race.players
                .map((player, index) => ({
                    ...player,
                    key: `p${index}`,
                    color:
                        index < HIGHLIGHTED_PLAYERS
                            ? highlightColors[index % highlightColors.length]
                            : undefined,
                    dashed: index >= highlightColors.length && index < HIGHLIGHTED_PLAYERS,
                }))
                .filter((_, index) => filter === "all" || index < Number(filter)),
        [race.players, filter],
    );
    const highlighted = players.filter((player) => player.color);

    const config = useMemo(
        () =>
            Object.fromEntries(
                players.map((player) => [
                    player.key,
                    {
                        label: player.player,
                        color: player.color ? `var(${player.color})` : "var(--muted-foreground)",
                    },
                ]),
            ) satisfies ChartConfig,
        [players],
    );

    const data = steps.map((s, index) => {
        const row: Record<string, string | number | null> = { id: s.id };
        for (const player of players) {
            row[player.key] = valuesOf(player, mode)[index];
        }
        return row;
    });

    const allValues = players.flatMap((player) =>
        valuesOf(player, mode).filter((v): v is number => v !== null),
    );
    const max = Math.max(1, ...allValues);
    const domain: [number, number] = mode === "rank" ? [1, max] : [0, max];

    // Label the line ends from the top down and skip a label that would overlap the one above
    const labeled = new Set<string>();
    if (isWide) {
        const unitsPerLabel = ((domain[1] - domain[0]) / PLOT_HEIGHT_PX) * LABEL_HEIGHT_PX;
        const placed: number[] = [];
        const ends = highlighted
            .map((player) => ({ key: player.key, value: valuesOf(player, mode)[lastStep] }))
            .filter((end): end is { key: string; value: number } => end.value !== null)
            .sort((a, b) => (mode === "rank" ? a.value - b.value : b.value - a.value));
        for (const end of ends) {
            if (placed.every((value) => Math.abs(value - end.value) >= unitsPerLabel)) {
                labeled.add(end.key);
                placed.push(end.value);
            }
        }
    }

    const current = steps[lastStep];
    const caption = (() => {
        const names = joinNames(current.leaders);
        if (current.leaders.length === 0) return "Noch niemand in der Rangliste";
        if (lastStep === 0) return `${names} legt vor`;
        if (current.leadChange) return `${names} übernimmt die Führung`;
        return `${names} bleibt vorne`;
    })();

    const leadChanges = steps.flatMap((s, index) =>
        s.leadChange
            ? s.leaders.flatMap((leader) => {
                  const player = players.find((p) => p.player === leader);
                  const value = player ? valuesOf(player, mode)[index] : null;
                  return value === null ? [] : [{ id: s.id, value, key: `${s.id}-${leader}` }];
              })
            : [],
    );

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <SegmentedControl label="Ansicht" options={modes} value={mode} onChange={setMode} />
                <SegmentedControl
                    label="Spieler"
                    options={filters}
                    value={filter}
                    onChange={setFilter}
                />
            </div>
            <p className="text-muted-foreground ml-1 text-[0.8125rem]">{descriptions[mode]}</p>

            <div className="bg-card flex flex-col gap-4 rounded-xl border px-2 pt-5 pb-4 lg:rounded-3xl lg:px-5 lg:pt-7">
                <p className="px-2 lg:px-1" aria-live="polite">
                    <span className="text-label text-muted-foreground mr-2 uppercase tabular-nums">
                        {current.date}
                    </span>
                    <span className="font-semibold">{caption}</span>
                </p>

                <ChartContainer
                    config={config}
                    className="aspect-auto w-full"
                    style={{ height: CHART_HEIGHT_PX }}
                >
                    <LineChart
                        data={data}
                        accessibilityLayer
                        margin={{ top: 8, left: -8, right: isWide ? 96 : 12, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="id"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={12}
                            tickFormatter={(id: string) =>
                                steps.find((s) => s.id === id)?.label ?? ""
                            }
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={44}
                            reversed={mode === "rank"}
                            domain={domain}
                            allowDecimals={false}
                            tickFormatter={(value: number) =>
                                mode === "rank" ? `#${value}` : `${value}`
                            }
                        />
                        <ChartTooltip
                            cursor={{ strokeWidth: 1 }}
                            content={({ active, label }) => {
                                if (!active) return null;
                                const index = steps.findIndex((s) => s.id === label);
                                if (index < 0) return null;
                                const rows = players
                                    .map((player) => ({
                                        player,
                                        value: valuesOf(player, mode)[index],
                                        rank: player.ranks[index],
                                        form: player.forms[index],
                                        activity: player.activities[index],
                                    }))
                                    .filter((row) => row.value !== null)
                                    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
                                const shown = rows.slice(0, 8);
                                return (
                                    <div className="bg-popover text-popover-foreground grid min-w-44 gap-1.5 rounded-lg border px-3 py-2 text-xs shadow-float">
                                        <p className="font-semibold">
                                            {steps[index].date} · {steps[index].flavor}
                                        </p>
                                        {shown.map(({ player, value, form, activity }) => (
                                            <div
                                                key={player.key}
                                                className="flex items-center gap-2"
                                            >
                                                <LineKey
                                                    color={player.color}
                                                    dashed={player.dashed}
                                                />
                                                <span className="font-bold tabular-nums">
                                                    {formatValue(value as number, mode)}
                                                </span>
                                                <span className="text-muted-foreground truncate">
                                                    {player.player}
                                                </span>
                                                {mode === "score" && form !== null && (
                                                    <span className="text-muted-foreground ml-auto pl-3 whitespace-nowrap tabular-nums">
                                                        Form ×{factorFormat.format(form)}
                                                        {activity !== null &&
                                                            activity < 1 &&
                                                            ` · Akt. ×${factorFormat.format(activity)}`}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {rows.length > shown.length && (
                                            <p className="text-muted-foreground">
                                                + {rows.length - shown.length} weitere
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        />
                        {/* Gray context lines first, so the highlighted ones are drawn on top */}
                        {[...players].reverse().map((player) => (
                            <Line
                                key={player.key}
                                dataKey={player.key}
                                name={player.player}
                                type="monotoneX"
                                stroke={`var(--color-${player.key})`}
                                strokeWidth={player.color ? 2 : 1.5}
                                strokeOpacity={player.color ? 1 : 0.35}
                                strokeDasharray={player.dashed ? DASH : undefined}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                connectNulls={false}
                                isAnimationActive={false}
                                activeDot={player.color ? { r: 4 } : false}
                                dot={(props: { cx?: number; cy?: number; index?: number }) => {
                                    const { cx, cy, index } = props;
                                    if (!player.color || index !== lastStep || cx === undefined) {
                                        return <g key={`${player.key}-${index}`} />;
                                    }
                                    return (
                                        <g key={`${player.key}-${index}`}>
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={4}
                                                fill={`var(${player.color})`}
                                                stroke="var(--card)"
                                                strokeWidth={2}
                                            />
                                            {labeled.has(player.key) && (
                                                <text
                                                    x={cx + 10}
                                                    y={cy}
                                                    dominantBaseline="central"
                                                    className="fill-foreground text-xs font-semibold"
                                                >
                                                    {player.player}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }}
                            />
                        ))}
                        {leadChanges.map((change) => (
                            <ReferenceDot
                                key={change.key}
                                x={change.id}
                                y={change.value}
                                r={6}
                                fill="var(--coral)"
                                stroke="var(--card)"
                                strokeWidth={2}
                                ifOverflow="visible"
                            />
                        ))}
                    </LineChart>
                </ChartContainer>

                <ul className="flex flex-wrap gap-x-4 gap-y-1.5 px-2 text-[0.8125rem] lg:px-1">
                    {highlighted.map((player) => (
                        <li key={player.key} className="flex items-center gap-1.5">
                            <LineKey color={player.color} dashed={player.dashed} />
                            {player.player}
                        </li>
                    ))}
                    {players.length > highlighted.length && (
                        <li className="text-muted-foreground flex items-center gap-1.5">
                            <LineKey />
                            Weitere Spieler
                        </li>
                    )}
                    <li className="text-muted-foreground flex items-center gap-1.5">
                        <span aria-hidden="true" className="bg-coral size-2.5 rounded-full" />
                        Führungswechsel
                    </li>
                </ul>
            </div>
        </div>
    );
}
