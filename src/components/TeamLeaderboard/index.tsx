import { LeadboardData } from "@site/src/types/leaderboard";
import Leaderboard from "../Leaderboard";
import { usePluginData } from "@docusaurus/useGlobalData";

export default function TeamLeaderboard() {
    const { teamLeaderboard, minimumParticipationThreshold } = usePluginData(
        "leaderboard-plugin"
    ) as LeadboardData;
    return (
        <Leaderboard
            data={teamLeaderboard}
            minimumParticipationThreshold={minimumParticipationThreshold}
        />
    );
}
