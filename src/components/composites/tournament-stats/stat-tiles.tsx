import { formatShortDate, type Overview } from "@/lib/tournament-stats";

/**
 * Row of key figures. Values use proportional figures, since they never align in a column.
 */
export function StatTiles({ overview }: { overview: Overview }) {
    const tiles = [
        {
            label: "Turniere",
            value: overview.tournaments,
            detail: overview.since ? `seit ${formatShortDate(overview.since)}` : undefined,
        },
        {
            label: "Spieler",
            value: overview.players,
            detail: `${overview.oneTimers} nur einmal dabei`,
        },
        { label: "Größtes Turnier", value: overview.largestTournament, detail: "Teilnehmer" },
        {
            label: "Durchschnitt",
            value: overview.averageSize.toLocaleString("de-DE", { maximumFractionDigits: 1 }),
            detail: "Teilnehmer pro Turnier",
        },
    ];

    return (
        <dl className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3.5">
            {tiles.map((tile) => (
                <div
                    key={tile.label}
                    className="bg-card flex flex-col rounded-xl border px-4 py-3.5 lg:rounded-3xl lg:px-6 lg:py-5"
                >
                    <dt className="text-label text-muted-foreground uppercase">{tile.label}</dt>
                    <dd className="text-title lg:text-title-lg mt-1">{tile.value}</dd>
                    {tile.detail && (
                        <dd className="text-muted-foreground text-[0.8125rem]">{tile.detail}</dd>
                    )}
                </div>
            ))}
        </dl>
    );
}
