import type { SwissMode } from "./types";

export function generateSwiss(
    players: number,
    maxTeamSize: number,
    tables: number,
    minutesPerGame: number,
): SwissMode[] {
    const modes: SwissMode[] = [];
    const maxTeamSizeCapped = Math.min(Math.ceil(players / 2), maxTeamSize);

    for (let teamSize = 1; teamSize <= maxTeamSizeCapped; teamSize++) {
        const teams = Math.ceil(players / teamSize);
        if (teams < 4) continue;

        const standardRounds = Math.ceil(Math.log2(teams));
        const gamesPerRound = Math.floor(teams / 2);

        for (let rounds = 2; rounds <= standardRounds; rounds++) {
            modes.push({
                id: `swiss-${teamSize}-${rounds}`,
                type: "swiss",
                teamSize,
                teams,
                rounds,
                numberOfGames: rounds * gamesPerRound,
                gamesPerTeam: rounds,
                hasOddTeams: teams % 2 !== 0,
                totalDuration: rounds * Math.ceil(gamesPerRound / tables) * minutesPerGame,
            });
        }
    }

    return modes;
}
