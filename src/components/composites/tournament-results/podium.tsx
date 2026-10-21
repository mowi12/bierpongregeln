import type { PlayerStanding } from "@/lib/tournament-utils";
import { cn } from "@/lib/utils";

const percentFormat = new Intl.NumberFormat("de-DE", {
    style: "percent",
    maximumFractionDigits: 0,
});

const places = [
    {
        // 1st place: center and tallest
        order: "order-2",
        avatar: "bg-accent text-accent-foreground",
        block: "bg-primary text-primary-foreground h-[7.5rem] lg:h-[9.375rem]",
        delay: "[animation-delay:160ms]",
    },
    {
        order: "order-1",
        avatar: "bg-coral-soft text-coral-ink",
        block: "bg-coral text-coral-foreground h-[5.75rem] lg:h-[7rem]",
        delay: "[animation-delay:80ms]",
    },
    {
        order: "order-3",
        avatar: "bg-secondary text-secondary-foreground",
        block: "bg-secondary text-secondary-foreground h-[4.5rem] lg:h-[5.25rem]",
        delay: "[animation-delay:0ms]",
    },
];

function getInitials(name: string): string {
    return name
        .split(/[\s.]+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

/**
 * Top three of the ranked standings, shown as 2 – 1 – 3. The list keeps the real order for
 * assistive technology; only the visual order changes.
 */
export function Podium({ standings }: { standings: PlayerStanding[] }) {
    const podium = standings.slice(0, 3);

    return (
        <ol
            aria-label="Podest"
            className="bg-card grid grid-cols-3 items-end gap-2 rounded-xl border px-4 pt-5 lg:gap-4 lg:rounded-3xl lg:px-7 lg:pt-7"
        >
            {podium.map((player, index) => {
                const place = places[index];

                return (
                    <li
                        key={player.player}
                        className={cn("flex min-w-0 flex-col items-center gap-2", place.order)}
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "flex size-13 items-center justify-center rounded-full text-lg font-extrabold lg:size-16 lg:text-[1.375rem]",
                                place.avatar,
                            )}
                        >
                            {getInitials(player.player)}
                        </span>
                        <span className="w-full truncate text-center font-bold lg:text-lg">
                            {player.player}
                        </span>
                        <span className="text-muted-foreground -mt-1.5 text-center text-xs tabular-nums lg:text-[0.8125rem]">
                            <span className="block lg:inline">
                                Quote {percentFormat.format(player.winRate)}
                            </span>
                            <span className="hidden lg:inline"> · </span>
                            <span className="block lg:inline">{player.totalScore} Pkt.</span>
                        </span>
                        <span
                            className={cn(
                                "flex w-full origin-bottom justify-center rounded-t-xl pt-2.5 motion-safe:animate-podium-rise motion-safe:fill-mode-both lg:pt-3.5",
                                place.block,
                                place.delay,
                            )}
                        >
                            <span className="text-[1.75rem] leading-none font-extrabold lg:text-[2.5rem]">
                                <span className="sr-only">Platz </span>
                                {index + 1}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
