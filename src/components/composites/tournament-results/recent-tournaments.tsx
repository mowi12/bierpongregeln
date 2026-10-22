import { formatDateParts, formatFlavor, type Tournament } from "@/lib/tournament-utils";

export function RecentTournaments({ tournaments }: { tournaments: Tournament[] }) {
    return (
        <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2">
                {tournaments.map((t) => {
                    const { day, month } = formatDateParts(t.date);

                    return (
                        <li
                            key={t.id}
                            className="bg-card flex items-center gap-3 rounded-lg border px-4 py-3"
                        >
                            <time dateTime={t.date} className="w-12 shrink-0 text-center">
                                <span className="block text-xl leading-none font-extrabold tabular-nums lg:text-[1.375rem]">
                                    {day}
                                </span>
                                <span className="text-muted-foreground text-xs font-semibold">
                                    {month}
                                </span>
                            </time>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">{t.firstPlace.join(" & ")}</p>
                                <p className="text-muted-foreground text-[0.8125rem]">
                                    {t.type === "team" ? "Team" : "Einzel"} ·{" "}
                                    {t.participants.length} Teilnehmer
                                </p>
                            </div>
                            <span className="bg-accent text-accent-foreground shrink-0 rounded-full px-2.5 py-1 text-xs font-bold">
                                {formatFlavor(t.flavor)}
                            </span>
                        </li>
                    );
                })}
            </ul>
            <a
                href="#alle-turniere"
                className="text-primary hover:bg-accent focus-visible:ring-ring/50 mt-1 flex min-h-11 items-center justify-center rounded-lg border font-bold transition-colors duration-150 outline-none focus-visible:ring-[3px]"
            >
                Alle Turniere anzeigen
            </a>
        </div>
    );
}
