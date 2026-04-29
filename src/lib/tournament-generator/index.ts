export type {
    FreeForAllMode,
    GeneratorInputs,
    GroupPhaseMode,
    SwissMode,
    TournamentMode,
} from "./types";
export { formatDuration } from "./types";

import { generateFreeForAll } from "./free-for-all";
import { generateGroupPhase } from "./group-phase";
import { generateSwiss } from "./swiss";
import type { GeneratorInputs, TournamentMode } from "./types";

export function generateTournamentModes(inputs: GeneratorInputs): TournamentMode[] {
    const { players, maxTeamSize, tables, minutesPerGame } = inputs;
    return [
        ...generateFreeForAll(players, maxTeamSize, tables, minutesPerGame),
        ...generateGroupPhase(players, maxTeamSize, tables, minutesPerGame),
        ...generateSwiss(players, maxTeamSize, tables, minutesPerGame),
    ].sort((a, b) => a.totalDuration - b.totalDuration);
}
