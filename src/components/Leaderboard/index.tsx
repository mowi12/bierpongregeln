import React from "react";
import { LeaderboardEntry } from "@site/src/types/leaderboard";
import "./style.css";
import Admonition from "@theme/Admonition";
import Translate from "@docusaurus/Translate";

interface LeaderboardProps {
    data: LeaderboardEntry[];
    minimumParticipationThreshold: number;
}

type Order = "asc" | "desc";

const headers = [
    "place",
    "name",
    "winrate",
    "pointsPerGame",
    "points",
    "wins",
    "participations",
];

interface Key {
    name: keyof LeaderboardEntry;
    order: Order;
}

const keys: Key[] = [
    {
        name: "place",
        order: "asc",
    },
    {
        name: "name",
        order: "asc",
    },
    {
        name: "winrate",
        order: "desc",
    },
    {
        name: "pointsPerGame",
        order: "desc",
    },
    {
        name: "points",
        order: "desc",
    },
    {
        name: "wins",
        order: "desc",
    },
    {
        name: "participations",
        order: "asc",
    },
];

interface SortConfig {
    field: string;
    order: Order;
}

let oldSortConfig: SortConfig = {
    field: headers[0],
    order: keys[0].order,
};

type ValueOf<T> = T[keyof T];

function formatCellContent(content: ValueOf<LeaderboardEntry>) {
    if (typeof content === "number") {
        return content.toLocaleString("de-DE", { maximumFractionDigits: 2 });
    }
    return content;
}

function sortFields(
    a: LeaderboardEntry,
    b: LeaderboardEntry,
    sortConfig: SortConfig
) {
    const { name, order } = keys[headers.indexOf(sortConfig.field)];
    const aAttribute = a[name];
    const bAttribute = b[name];

    if (typeof aAttribute === "string" && typeof bAttribute === "string") {
        return order === "asc"
            ? aAttribute.localeCompare(bAttribute)
            : aAttribute.localeCompare(bAttribute);
    }

    if (typeof aAttribute === "number" && typeof bAttribute === "number") {
        return order === "asc"
            ? aAttribute - bAttribute
            : bAttribute - aAttribute;
    }

    throw new Error("Cannot compare different types!");
}

// https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
let once = false;

function sortLeaderBoard(
    leaderboard: LeaderboardEntry[],
    sortConfig: SortConfig | null
) {
    if (isDev && !once) {
        once = true;
        return;
    }

    if (sortConfig !== null) {
        if (sortConfig.order === "desc") {
            leaderboard.sort((a, b) => sortFields(b, a, sortConfig));
        } else {
            leaderboard.sort((a, b) => sortFields(a, b, sortConfig));
        }
    }
}

function onHeaderClick(
    header: string,
    setSortConfig: (sortConfig: SortConfig) => void
) {
    let newSortConfig: SortConfig;
    if (oldSortConfig.field === header) {
        const newOrder = oldSortConfig.order === "asc" ? "desc" : "asc";
        newSortConfig = { field: header, order: newOrder };
    } else {
        newSortConfig = { field: header, order: "asc" };
    }
    oldSortConfig = newSortConfig;
    setSortConfig(newSortConfig);
}

export default function Leaderboard(props: LeaderboardProps) {
    const { data, minimumParticipationThreshold } = props;
    const [sortConfig, setSortConfig] = React.useState(oldSortConfig);

    React.useMemo(() => {
        sortLeaderBoard(data, sortConfig);
    }, [data, sortConfig]);

    return (
        <div>
            <Admonition type="info">
                <Translate id="leaderboard.message"
                    values={{
                        threshold: minimumParticipationThreshold,
                        br: <br />,
                    }}
                >
                    {`PPG: Points per Game,{br}
                    Achtung: Personen, die an weniger als {threshold} Spielen teilgenommen haben, werden am Ende der Tabelle angezeigt.`}
                </Translate>
            </Admonition>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th key="place">
                            <button
                                type="button"
                                onClick={() =>
                                    onHeaderClick("place", setSortConfig)
                                }
                                className={sortConfig.field === "place" ? sortConfig.order : ""}
                            >
                                <Translate id="leaderboardTable.place" description="The place in the leaderboard">
                                    Platz
                                </Translate>
                            </button>
                        </th>
                        <th key="name">
                            <button
                                type="button"
                                onClick={() =>
                                    onHeaderClick("name", setSortConfig)
                                }
                                className={sortConfig.field === "name" ? sortConfig.order : ""}
                            >
                                <Translate id="leaderboardTable.name" description="The name of the player">
                                    Name
                                </Translate>
                            </button>
                        </th>
                        <th key="winrate">
                            <button
                                type="button"
                                onClick={() =>
                                    onHeaderClick("winrate", setSortConfig)
                                }
                                className={sortConfig.field === "winrate" ? sortConfig.order : ""}
                            >
                                <Translate id="leaderboardTable.winrate" description="The winrate of the player">
                                    Winrate
                                </Translate>
                            </button>
                        </th>
                        <th key="pointsPerGame">
                            <button
                                type="button"
                                onClick={() =>
                                    onHeaderClick("pointsPerGame", setSortConfig)
                                }
                                className={sortConfig.field === "pointsPerGame" ? sortConfig.order : ""}
                            >
                                <Translate id="leaderboardTable.ppg" description="The points per game of the player">
                                    PPG
                                </Translate>
                            </button>
                        </th>
                        <th key="points">
                            <button
                                type="button"
                                onClick={() =>
                                    onHeaderClick("points", setSortConfig)
                                }
                                className={sortConfig.field === "points" ? sortConfig.order : ""}
                            >
                                <Translate id="leaderboardTable.points" description="The points of the player">
                                    Punkte
                                </Translate>
                            </button>
                        </th>
                        <th key="wins">
                            <button
                                type="button"
                                onClick={() =>
                                    onHeaderClick("wins", setSortConfig)
                                }
                                className={sortConfig.field === "wins" ? sortConfig.order : ""}
                            >
                                <Translate id="leaderboardTable.wins" description="The wins of the player">
                                    Siege
                                </Translate>
                            </button>
                        </th>
                        <th key="participations">
                            <button
                                type="button"
                                onClick={() =>
                                    onHeaderClick("participations", setSortConfig)
                                }
                                className={sortConfig.field === "participations" ? sortConfig.order : ""}
                            >
                                <Translate id="leaderboardTable.participations" description="The participations of the player">
                                    Teilnahmen
                                </Translate>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => (
                        <tr key={entry.name}>
                            {keys.map(({ name }) => (
                                <td key={name}>
                                    {formatCellContent(entry[name])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
