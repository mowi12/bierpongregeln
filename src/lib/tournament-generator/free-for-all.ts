import type { FreeForAllMode } from "./types";
import { binomialCoefficient } from "./utils";

// Round-robin: (teams-1) rounds for even teams, teams rounds for odd; floor(teams/2) games per round.
// Games within a round run in parallel across available tables.
function roundRobinDuration(teams: number, tables: number, minutesPerGame: number): number {
    const rounds = teams % 2 === 0 ? teams - 1 : teams;
    const gamesPerRound = Math.floor(teams / 2);
    return rounds * Math.ceil(gamesPerRound / tables) * minutesPerGame;
}

export function generateFreeForAll(
    players: number,
    maxTeamSize: number,
    tables: number,
    minutesPerGame: number,
): FreeForAllMode[] {
    const modes: FreeForAllMode[] = [];
    const maxTeamSizeCapped = Math.min(Math.ceil(players / 2), maxTeamSize);

    for (let teamSize = 1; teamSize <= maxTeamSizeCapped; teamSize++) {
        const teams = Math.ceil(players / teamSize);
        const numberOfGames = binomialCoefficient(teams, 2);
        if (numberOfGames < 1) continue;
        modes.push({
            id: `ffa-${teamSize}`,
            type: "freeForAll",
            teamSize,
            teams,
            numberOfGames,
            gamesPerTeam: teams - 1,
            totalDuration: roundRobinDuration(teams, tables, minutesPerGame),
        });
    }

    return modes;
}
