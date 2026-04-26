export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export interface FreeForAllMode {
    type: "freeForAll";
    teamSize: number;
    teams: number;
    numberOfGames: number;
    gamesPerTeam: number;
    totalDuration: number;
}

export interface GroupPhaseMode {
    type: "groupPhase";
    teamSize: number;
    teams: number;
    groupCount: number;
    groupSize: number;
    gamesInGP: number;
    gamesInKP: number;
    numberOfGames: number;
    gamesPerTeamMin: number;
    gamesPerTeamMax: number;
    koRounds: number;
    finalsType: number;
    totalDuration: number;
}

export interface SwissMode {
    type: "swiss";
    teamSize: number;
    teams: number;
    rounds: number;
    numberOfGames: number;
    gamesPerTeam: number;
    hasOddTeams: boolean;
    totalDuration: number;
}

export type TournamentMode = FreeForAllMode | GroupPhaseMode | SwissMode;

export interface GeneratorInputs {
    players: number;
    maxTeamSize: number;
    tables: number;
    minutesPerGame: number;
    maxDuration: number;
}

function binomialCoefficient(n: number, k: number): number {
    if (k === 0 || k === n) return 1;
    if (n < 0 || k < 0 || k > n) throw new Error(`Invalid arguments: n=${n}, k=${k}`);
    return binomialCoefficient(n - 1, k - 1) + binomialCoefficient(n - 1, k);
}

// Round-robin: (teams-1) rounds for even, teams rounds for odd; floor(teams/2) games per round.
// With multiple tables, games within a round run in parallel.
function roundRobinDuration(teams: number, tables: number, minutesPerGame: number): number {
    const rounds = teams % 2 === 0 ? teams - 1 : teams;
    const gamesPerRound = Math.floor(teams / 2);
    return rounds * Math.ceil(gamesPerRound / tables) * minutesPerGame;
}

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

function generateFreeForAll(
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

function generateGroupPhase(
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
            const totalDuration =
                groupPhaseDuration(groupCount, groupSize, tables, minutesPerGame) +
                koPhaseDuration(koRounds, tables, minutesPerGame);

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
                totalDuration,
            });
        }
    }

    return modes;
}

function generateSwiss(
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

export function generateTournamentModes(inputs: GeneratorInputs): TournamentMode[] {
    const { players, maxTeamSize, tables, minutesPerGame } = inputs;
    return [
        ...generateFreeForAll(players, maxTeamSize, tables, minutesPerGame),
        ...generateGroupPhase(players, maxTeamSize, tables, minutesPerGame),
        ...generateSwiss(players, maxTeamSize, tables, minutesPerGame),
    ].sort((a, b) => a.totalDuration - b.totalDuration);
}
