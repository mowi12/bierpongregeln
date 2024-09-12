import React, { CSSProperties } from "react";
import InputRange from "../components/InputRange";
import Card from "../components/card-components/Card";
import CardHeader from "../components/card-components/CardHeader";
import CardBody from "../components/card-components/CardBody";
import CardFooter from "../components/card-components/CardFooter";
import Columns from "../components/Columns";
import Column from "../components/Column";

const startValuePlayers = 6;
const startValueMinutesPerGame = 15;
const startValueMaxDuration = 120;
const startValueMaxTeamSize = 2;
const startValueTables = 1;

interface CardProps {
    title: string;
    description: string;
    details: FFADetailProps | GroupPhaseDetailProps;
}

class Range {
    min: number;
    max: number;
}

interface FFADetailProps {
    numberOfGames: number;
    gamesPerTeam: number | Range;
    teamSize: number;
    totalDuration: number;
}

interface GroupPhaseDetailProps extends FFADetailProps {
    numberOfGamesPerGroup: number;
    finalsType: number;
}

export default function Modi() {
    const [players, setPlayers] = React.useState(startValuePlayers);
    const [minutesPerGame, setMinutesPerGame] = React.useState(
        startValueMinutesPerGame
    );
    const [maxDuration, setMaxDuration] = React.useState(startValueMaxDuration);
    const [maxTeamSize, setMaxTeamSize] = React.useState(startValueMaxTeamSize);
    const [tables, setTables] = React.useState(startValueTables);
    const [items, setItems] = React.useState<CardProps[]>([]);

    React.useEffect(() => {
        let items: CardProps[] = [];

        const maxTeamSizeCapped = Math.min(Math.ceil(players / 2), maxTeamSize);
        for (let teamSize = 1; teamSize <= maxTeamSizeCapped; teamSize++) {
            addGameForFreeForAll(players, minutesPerGame, teamSize, items);
            addGamesForGroupPhase(players, minutesPerGame, teamSize, items);
        }

        setItems(items);
    }, [players, minutesPerGame, maxDuration, maxTeamSize, tables]);

    return (
        <div>
            <h1>Modi</h1>
            <div className="container">
                <InputRange
                    min={1}
                    max={50}
                    step={1}
                    startValue={startValuePlayers}
                    onChange={setPlayers}
                    label="Spieleranzahl"
                />
                <br />
                <InputRange
                    min={1}
                    max={4}
                    step={1}
                    startValue={startValueMaxTeamSize}
                    onChange={setMaxTeamSize}
                    label="Maximale Teamgröße"
                />
                <br />
                <InputRange
                    min={1}
                    max={4}
                    step={1}
                    startValue={startValueTables}
                    onChange={setTables}
                    label="Anzahl Tische"
                />
                <br />
                <InputRange
                    min={1}
                    max={30}
                    step={1}
                    startValue={startValueMinutesPerGame}
                    onChange={setMinutesPerGame}
                    label="Spieldauer (min)"
                />
                <br />
                <InputRange
                    min={startValueMinutesPerGame}
                    max={240}
                    step={1}
                    startValue={startValueMaxDuration}
                    onChange={setMaxDuration}
                    label="Maximale Turnierdauer (min)"
                />
            </div>
            <div
                style={{
                    border: "1px solid white",
                    padding: "15px",
                    margin: "3rem 15rem 0rem 15rem",
                }}
            >
                <div id="list">
                    {items
                        .sort(
                            (a, b) =>
                                a.details.totalDuration -
                                b.details.totalDuration
                        )
                        .map((item) => {
                            const details = item.details;
                            let style: CSSProperties = {
                                margin: "0rem 0rem 1rem 0rem",
                            };
                            if (
                                item.details.totalDuration / tables >
                                maxDuration
                            ) {
                                style.backgroundColor = "rgba(255, 0, 0, 0.1)";
                                style.border =
                                    "0.25rem solid rgba(255, 0, 0, 0.8)";
                            }
                            return (
                                <Card shadow="tl" style={style}>
                                    <CardHeader>
                                        <h3>{item.title}</h3>
                                    </CardHeader>
                                    <CardBody>{item.description}</CardBody>
                                    <CardFooter>
                                        <Columns>
                                            <Column>
                                                <span>
                                                    Anzahl Spiele:{" "}
                                                    {details.numberOfGames}
                                                </span>
                                            </Column>
                                            <Column>
                                                <span>
                                                    Spiele pro{" "}
                                                    {details.teamSize > 1
                                                        ? "Team"
                                                        : "Spieler"}
                                                    :{" "}
                                                    {typeof details.gamesPerTeam ===
                                                    "object"
                                                        ? `${details.gamesPerTeam.min} - ${details.gamesPerTeam.max}`
                                                        : details.gamesPerTeam}
                                                </span>
                                            </Column>
                                            {"numberOfGamesPerGroup" in
                                            details ? (
                                                <Column>
                                                    <span>
                                                        Spiele pro Gruppe:{" "}
                                                        {
                                                            (
                                                                details as GroupPhaseDetailProps
                                                            )
                                                                .numberOfGamesPerGroup
                                                        }
                                                    </span>
                                                </Column>
                                            ) : null}
                                            {"finalsType" in details ? (
                                                <Column>
                                                    <span>
                                                        Typ:{" "}
                                                        {getFinalsType(
                                                            (
                                                                details as GroupPhaseDetailProps
                                                            ).finalsType
                                                        )}
                                                    </span>
                                                </Column>
                                            ) : null}
                                            <Column>
                                                <span>
                                                    Gesamtdauer:{" "}
                                                    {minutesToDurationString(
                                                        details.totalDuration /
                                                            tables
                                                    )}
                                                </span>
                                            </Column>
                                        </Columns>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

function binomialCoefficient(n: number, k: number): number {
    if (k === 0 || k === n) return 1;
    if (n < 0 || k < 0 || k > n) throw new Error("Invalid input");
    return binomialCoefficient(n - 1, k - 1) + binomialCoefficient(n - 1, k);
}

function minutesToDurationString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) return `${days}d ${remainingHours}h ${remainingMinutes}min`;
    return `${hours}h ${remainingMinutes}min`;
}

function addGameForFreeForAll(
    players: number,
    minutesPerGame: number,
    teamSize: number,
    items: CardProps[]
) {
    const teams = Math.ceil(players / teamSize);
    const games = binomialCoefficient(teams, 2);
    if (games <= 1) return;
    const gamesPerTeam = teams - 1;
    const totalDuration = games * minutesPerGame;

    const titleAddition =
        teamSize > 1 ? ` ${teamSize} Spieler pro Team` : "Einzel";
    let description = "";
    if (teamSize > 1) {
        description =
            "Bei 'Jeder gegen jeden' spielt jedes Team gegen jedes andere Team. Das Team mit den meisten Siegen oder bei Gleichstand, mit der besten Trefferdifferenz gewinnt. Da die Anzahl an Spielen, bei diesem Spielmodus schnell ansteigt, ist er nur für eine geringe Anzahl an Teams empfohlen.";
    } else {
        description =
            "Bei 'Jeder gegen jeden' spielt jeder Spieler gegen jeden anderen Spieler. Der Spielern mit den meisten Siegen oder bei Gleichstand, mit der besten Trefferdifferenz gewinnt. Da die Anzahl an Spielen, bei diesem Spielmodus schnell ansteigt, ist er nur für eine geringe Anzahl an Spielern empfohlen.";
    }
    items.push({
        title: `Jeder gegen jeden - ${titleAddition}`,
        description: description,
        details: {
            teamSize: teamSize,
            numberOfGames: games,
            gamesPerTeam: gamesPerTeam,
            totalDuration: totalDuration,
        },
    });
}

function addGamesForGroupPhase(
    players: number,
    minutesPerGame: number,
    teamSize: number,
    items: CardProps[]
) {
    const teams = Math.ceil(players / teamSize);
    if (teams < 4) return;
    const maxGroupSize = Math.floor(teams / 2);

    for (let groupSize = 2; groupSize <= maxGroupSize; groupSize++) {
        const groupCount = Math.ceil(teams / groupSize);
        if (groupCount % 2 !== 0) continue; // Find logic for K.O. phase

        // Group phase (GP)
        const gamesPerGroupInGP = binomialCoefficient(groupSize, 2);
        const gamesPerTeamInGP = Math.max(gamesPerGroupInGP - 1, 1);
        const gamesInGP = gamesPerGroupInGP * groupCount;

        // K.O. phase (KP)
        const winnersOfGP = groupCount * 2;
        // Type: (Quarterfinals, Semifinals, Finals)
        const rounds = Math.floor(Math.log2(winnersOfGP));
        const finalsType = Math.pow(2, rounds - 1); // Next power of 2; (e.g. 8 -> 4, 5 -> 2, 3 -> 1)
        const gamesInKP = Math.pow(2, rounds) - 1; // 1 game per type * 2 - game about 3rd place

        // Total
        const numberOfGames = gamesInGP + gamesInKP;
        const maximumGamesPerTeam = gamesPerTeamInGP + rounds;
        const totalDuration = numberOfGames * minutesPerGame;

        const titleAddition =
            teamSize > 1 ? `Teams à ${teamSize} Spieler` : "Spieler";
        items.push({
            title: `Gruppenphase (${groupCount} Gruppen à ${groupSize} ${titleAddition})`,
            description:
                "Bei der 'Gruppenphase' werden die Spieler in Gruppen aufgeteilt, in denen jeder gegen jeden spielt. Die besten Spieler jeder Gruppe kommen in die K.O.-Runde. Die Anzahl der Gruppen und Spieler pro Gruppe kann variieren.",
            details: {
                teamSize: teamSize,
                numberOfGames: numberOfGames,
                gamesPerTeam: {
                    min: gamesPerTeamInGP,
                    max: maximumGamesPerTeam,
                },
                numberOfGamesPerGroup: gamesPerGroupInGP,
                finalsType: finalsType,
                totalDuration: totalDuration,
            },
        });
    }
}

function getFinalsType(type: number) {
    switch (type) {
        case 1:
            return "Finale";
        case 2:
            return "Halbfinale";
        case 4:
            return "Viertelfinale";
        case 8:
            return "Achtelfinale";
        case 16:
            return "Sechzehntelfinale";
        default:
            return `${type}tel Finale`;
    }
}
