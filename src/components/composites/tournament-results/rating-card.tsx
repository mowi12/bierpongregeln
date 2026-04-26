interface RatingCardProps {
    emoji: string;
    points: number;
    place: number;
}

export function RatingCard({ emoji, points, place }: RatingCardProps) {
    const pointsLabel = points === 1 ? "Punkt" : "Punkte";
    const label = `${pointsLabel} für Platz ${place}`;

    return (
        <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold">{emoji}</div>
            <div className="mt-1 text-3xl font-bold">{points}</div>
            <div className="text-muted-foreground text-sm">{label}</div>
        </div>
    );
}
