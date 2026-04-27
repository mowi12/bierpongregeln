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
