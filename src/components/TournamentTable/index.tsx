import { usePluginData } from "@docusaurus/useGlobalData";
import { LeadboardData, Tournament } from "@site/src/types/leaderboard";
import Translate from "@docusaurus/Translate";

function createTournamentsTable(tournaments: Tournament[]) {
    const tableStyle = {
        borderStyle: "hidden",
        display: "inline-table",
    };

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th key="tournamentTable.date">
                        <Translate id="tournamentTable.date" description="The date of the tournament">
                            Datum
                        </Translate>
                    </th>
                    <th key="tournamentTable.firstPlace">
                        <Translate id="tournamentTable.firstPlace" description="The first place of the tournament">
                            1. Platz
                        </Translate>
                    </th>
                    <th key="tournamentTable.secondPlace">
                        <Translate id="tournamentTable.secondPlace" description="The second place of the tournament">
                            2. Platz
                        </Translate>
                    </th>
                    <th key="tournamentTable.thirdPlace">
                        <Translate id="tournamentTable.thirdPlace" description="The third place of the tournament">
                            3. Platz
                        </Translate>
                    </th>
                    <th key="tournamentTable.flavor">
                        <Translate id="tournamentTable.flavor" description="The flavor of the tournament">
                            Flavor
                        </Translate>
                    </th>
                </tr>
            </thead>
            <tbody>
                {tournaments.map((entry) => (
                    <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>{entry.firstPlace.join(" & ")}</td>
                        <td>{entry.secondPlace.join(" & ")}</td>
                        <td>{entry.thirdPlace.join(" & ")}</td>
                        <td>{formatFlavor(entry.flavor)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function formatFlavor(flavor: string | string[]) {
    if (Array.isArray(flavor)) {
        return flavor.join(" & ");
    }
    return flavor;
}

export default function TournamentTable() {
    const { tournaments } = usePluginData(
        "leaderboard-plugin"
    ) as LeadboardData;
    return <div>{createTournamentsTable(tournaments)}</div>;
}
