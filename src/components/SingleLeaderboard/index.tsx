import { usePluginData } from "@docusaurus/useGlobalData";
import Leaderboard from "../Leaderboard";
import { LeadboardData } from "@site/src/types/leaderboard";

export default function SingleLeaderboard() {
    const { singleLeaderboard, minimumParticipationThreshold } = usePluginData(
        "leaderboard-plugin"
    ) as LeadboardData;
    return (
        <Leaderboard
            data={singleLeaderboard}
            minimumParticipationThreshold={minimumParticipationThreshold}
        />
    );
}
