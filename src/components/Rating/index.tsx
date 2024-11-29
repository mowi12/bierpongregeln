import { usePluginData } from "@docusaurus/useGlobalData";
import { LeadboardData } from "@site/src/types/leaderboard";
import Translate from "@docusaurus/Translate";

export default function Rating() {
    const { rating } = usePluginData("leaderboard-plugin") as LeadboardData;
    return (
        <div>
            <div>
                <Translate id="rating.firstPlace" description="The label for the first place in a ranking" values={{points: rating.firstPlace}}>
                    {"1. Platz: {points} Punkte"}
                </Translate>
                {"\u00A0"}
            </div>
            <div>
                <Translate id="rating.secondPlace" description="The label for the second place in a ranking" values={{points: rating.secondPlace}}>
                    {"2. Platz: {points} Punkte"}
                </Translate>
                {"\u00A0"}
            </div>
            <div>
                <Translate id="rating.thirdPlace" description="The label for the third place in a ranking" values={{points: rating.thirdPlace}}>
                    {"3. Platz: {points} Punkte"}
                </Translate>
                {"\u00A0"}
            </div>
        </div>
    );
}
