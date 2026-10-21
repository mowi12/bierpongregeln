import { cn } from "@/lib/utils";

const placeTones: Record<number, string> = {
    1: "bg-accent text-accent-foreground",
    2: "bg-coral-soft text-coral-ink",
    3: "bg-secondary text-secondary-foreground",
};

interface RatingCardProps {
    points: number;
    place: number;
}

export function RatingCard({ points, place }: RatingCardProps) {
    const pointsLabel = points === 1 ? "Punkt" : "Punkte";

    return (
        <div className={cn("rounded-lg p-3 lg:p-3.5", placeTones[place])}>
            <div className="text-2xl font-extrabold tabular-nums lg:text-[1.75rem]">{points}</div>
            <div className="text-[0.8125rem] font-semibold" aria-hidden="true">
                {place}. Platz
            </div>
            <span className="sr-only">
                {pointsLabel} für Platz {place}
            </span>
        </div>
    );
}
