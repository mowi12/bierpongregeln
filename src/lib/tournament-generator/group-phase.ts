import { GroupPhaseMode } from "./types";
import { binomialCoefficient } from "./utils";

// All groups play their round-robins simultaneously, sharing available tables.
function groupPhaseDuration(
    groupCount: number,
    groupSize: number,
    tables: number,
    minutesPerGame: number,
): number {
    const rounds = groupSize % 2 === 0 ? groupSize - 1 : groupSize;
    const gamesPerRound = groupCount * Math.floor(groupSize / 2);
    return rounds * Math.ceil(gamesPerRound / tables) * minutesPerGame;
}

// KO rounds are sequential; games within each round run in parallel.
function koPhaseDuration(koRounds: number, tables: number, minutesPerGame: number): number {
    let duration = 0;
    for (let r = 0; r < koRounds; r++) {
        const gamesInRound = Math.pow(2, koRounds - 1 - r);
        duration += Math.ceil(gamesInRound / tables) * minutesPerGame;
    }
    return duration;
}

export function generateGroupPhase(
    players: number,
    maxTeamSize: number,
    tables: number,
    minutesPerGame: number,
): GroupPhaseMode[] {
    const modes: GroupPhaseMode[] = [];
    const maxTeamSizeCapped = Math.min(Math.ceil(players / 2), maxTeamSize);

    for (let teamSize = 1; teamSize <= maxTeamSizeCapped; teamSize++) {
        const teams = Math.ceil(players / teamSize);
        if (teams < 4) continue;
        const maxGroupSize = Math.floor(teams / 2);

        for (let groupSize = 2; groupSize <= maxGroupSize; groupSize++) {
            // Require evenly-sized groups to avoid undersized groups skewing results.
            if (teams % groupSize !== 0) continue;
            const groupCount = teams / groupSize;

            // groupCount must be a power of 2 (≥ 2) so that winners fit a clean
            // single-elimination bracket without byes.
            if (groupCount < 2 || (groupCount & (groupCount - 1)) !== 0) continue;

            const gamesInGP = binomialCoefficient(groupSize, 2) * groupCount;
            // Each group advances 2 winners into a single-elimination KO.
            const winnersOfGP = groupCount * 2;
            const koRounds = Math.log2(winnersOfGP); // exact: winnersOfGP is a power of 2
            const gamesInKP = winnersOfGP - 1;
            // finalsType = games in first KO round = groupCount (e.g. 4 → Viertelfinale)
            const finalsType = groupCount;

            const gamesPerTeamInGP = groupSize - 1;
            modes.push({
                type: "groupPhase",
                teamSize,
                teams,
                groupCount,
                groupSize,
                gamesInGP,
                gamesInKP,
                numberOfGames: gamesInGP + gamesInKP,
                gamesPerTeamMin: gamesPerTeamInGP,
                gamesPerTeamMax: gamesPerTeamInGP + koRounds,
                koRounds,
                finalsType,
                totalDuration:
                    groupPhaseDuration(groupCount, groupSize, tables, minutesPerGame) +
                    koPhaseDuration(koRounds, tables, minutesPerGame),
            });
        }
    }

    return modes;
}
