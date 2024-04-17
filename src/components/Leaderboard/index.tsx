import React from "react";
import { LeaderboardEntry } from "@site/src/types/leaderboard";
import "./style.css";

interface LeaderboardProps {
    data: LeaderboardEntry[];
    minimumParticipationThreshold: number;
}

type Order = "asc" | "desc";

const headers = [
    "Platz",
    "Name",
    "Winrate",
    "PPG",
    "Punkte",
    "Siege",
    "Teilnahmen",
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
            <i>PPG: Points per Game</i>
            <br />
            <i>
                Note: People who have played less than
                {` ${minimumParticipationThreshold} `}
                games are ranked at the bottom of the list.
            </i>
            <br />
            <br />
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onHeaderClick(header, setSortConfig)
                                    }
                                    className={
                                        sortConfig.field === header
                                            ? sortConfig.order
                                            : ""
                                    }
                                >
                                    {header}
                                </button>
                            </th>
                        ))}
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
