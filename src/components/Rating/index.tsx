import { usePluginData } from "@docusaurus/useGlobalData";
import { LeadboardData } from "@site/src/types/leaderboard";

function formatRating(rating: number) {
    return `${rating} Punkt${rating > 1 ? "e" : ""}`;
}

export default function Rating() {
    const { rating } = usePluginData("leaderboard-plugin") as LeadboardData;
    return (
        <div>
            <div>{`1. Platz: ${formatRating(rating.firstPlace)}`}</div>
            <div>{`2. Platz: ${formatRating(rating.secondPlace)}`}</div>
            <div>{`3. Platz: ${formatRating(rating.thirdPlace)}`}</div>
        </div>
    );
}
