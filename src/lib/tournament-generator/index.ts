export { formatDuration } from "./types";
export type {
    FreeForAllMode,
    GroupPhaseMode,
    SwissMode,
    TournamentMode,
    GeneratorInputs,
} from "./types";

import { GeneratorInputs, TournamentMode } from "./types";
import { generateFreeForAll } from "./free-for-all";
import { generateGroupPhase } from "./group-phase";
import { generateSwiss } from "./swiss";

export function generateTournamentModes(inputs: GeneratorInputs): TournamentMode[] {
    const { players, maxTeamSize, tables, minutesPerGame } = inputs;
    return [
        ...generateFreeForAll(players, maxTeamSize, tables, minutesPerGame),
        ...generateGroupPhase(players, maxTeamSize, tables, minutesPerGame),
        ...generateSwiss(players, maxTeamSize, tables, minutesPerGame),
    ].sort((a, b) => a.totalDuration - b.totalDuration);
}
