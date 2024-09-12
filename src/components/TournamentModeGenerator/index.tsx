import React from "react";
import InputRange from "../InputRange";
import { CardProps } from "@site/src/types/tournament_mode";
import TournamentModeCard from "../TournamentModeCard";

const startValuePlayers = 6;
const startValueMinutesPerGame = 15;
const startValueMaxDuration = 120;
const startValueMaxTeamSize = 2;
const startValueTables = 1;

export default function TournamentModeGenerator() {
    const [players, setPlayers] = React.useState(startValuePlayers);
    const [minutesPerGame, setMinutesPerGame] = React.useState(
        startValueMinutesPerGame
    );
    const [maxDuration, setMaxDuration] = React.useState(startValueMaxDuration);
    const [maxTeamSize, setMaxTeamSize] = React.useState(startValueMaxTeamSize);
    const [tables, setTables] = React.useState(startValueTables);
    const [items, setItems] = React.useState<CardProps[]>([]);

    React.useEffect(() => {
        const items: CardProps[] = [];

        const maxTeamSizeCapped = Math.min(Math.ceil(players / 2), maxTeamSize);
        for (let teamSize = 1; teamSize <= maxTeamSizeCapped; teamSize++) {
            addGameForFreeForAll(players, minutesPerGame, teamSize, items);
            addGamesForGroupPhase(players, minutesPerGame, teamSize, items);
        }

        setItems(items);
    }, [players, minutesPerGame, maxDuration, maxTeamSize, tables]);

    return (
        <div>
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
                    margin: "3rem 0rem 0rem 0rem",
                }}
            >
                <div id="list">
                    {items
                        .sort(
                            (a, b) =>
                                a.details.totalDuration -
                                b.details.totalDuration
                        )
                        .map((item) => (
                            <TournamentModeCard
                                item={item}
                                tables={tables}
                                maxDuration={maxDuration}
                            />
                        ))}
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
                finalsType: finalsType,
                totalDuration: totalDuration,
            },
        });
    }
}
