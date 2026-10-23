import type { RecordEntry } from "@/lib/tournament-stats";

/**
 * Grid of fun records, e.g. most titles or the longest attendance streak. Every holder gets its
 * own line, so the & between the players of a team stays unambiguous.
 */
export function RecordCards({ records }: { records: RecordEntry[] }) {
    return (
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3.5">
            {records.map((record) => (
                <li
                    key={record.title}
                    className="bg-card flex flex-col gap-1 rounded-xl border px-4 py-3.5 lg:rounded-3xl lg:px-6 lg:py-5"
                >
                    <span className="text-label text-muted-foreground flex items-center gap-2 uppercase">
                        <span
                            aria-hidden="true"
                            className="bg-coral size-2 shrink-0 rounded-full"
                        />
                        {record.title}
                    </span>
                    <span className="text-card-title lg:text-card-title-lg flex flex-col">
                        {record.holders.map((holder) => (
                            <span key={holder.join()}>{holder.join(" & ")}</span>
                        ))}
                    </span>
                    <span className="text-[0.9375rem] font-semibold">
                        {record.value}
                        {record.detail && (
                            <span className="text-muted-foreground font-normal">
                                {" "}
                                · {record.detail}
                            </span>
                        )}
                    </span>
                </li>
            ))}
        </ul>
    );
}
