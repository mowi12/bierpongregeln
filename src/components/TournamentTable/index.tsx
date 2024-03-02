import { usePluginData } from "@docusaurus/useGlobalData";
import { LeadboardData, Tournament } from "@site/src/types/leaderboard";

const headers = ["Datum", "1. Platz", "2. Platz", "3. Platz", "Flavor"];

function createTournamentsTable(tournaments: Tournament[]) {
    const tableStyle = {
        borderStyle: "hidden",
        display: "inline-table",
    };

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tournaments.map((entry) => (
                    <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>{entry.firstPlace.join(" & ")}</td>
                        <td>{entry.secondPlace.join(" & ")}</td>
                        <td>{entry.thirdPlace.join(" & ")}</td>
                        <td>{entry.flavor}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function TournamentTable() {
    const { tournaments } = usePluginData(
        "leaderboard-plugin"
    ) as LeadboardData;
    return <div>{createTournamentsTable(tournaments)}</div>;
}
