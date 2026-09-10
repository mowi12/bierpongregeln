import type { ScoringParams, ScoringVariant } from "./types";

/**
 * Baseline "System B" parameters. The values that survived the sensitivity sweep
 * unchanged (coefficient shape, shrinkage, efficiency exponent, decay) are fixed
 * here; `participationPoint` and `firstPlaceWeight` are the knobs left open for
 * tuning on the scoring lab page.
 */
export const DEFAULT_PARAMS: ScoringParams = {
    participationPoint: 2,
    firstPlaceWeight: 15,
    secondPlaceWeight: 8,
    thirdPlaceWeight: 3,
    coefficientShape: "sqrt",
    shrinkage: 2,
    efficiencyExponent: 0.8,
    decayBase: 0.9,
    decayGrace: 2,
};

export const SCORING_VARIANTS: ScoringVariant[] = [
    {
        id: "v-a",
        name: "V-A · Difficulty-light",
        description:
            "Gentlest difficulty coefficient (log) with strong shrinkage. Big events barely " +
            "outweigh small ones; short records are pulled hard toward the field average.",
        params: {
            ...DEFAULT_PARAMS,
            coefficientShape: "log",
            shrinkage: 4,
            efficiencyExponent: 0.6,
        },
    },
    {
        id: "v-b",
        name: "V-B · Balanced",
        description:
            "The recommended baseline: sqrt difficulty coefficient, moderate shrinkage, a " +
            "strong efficiency guardrail and a gentle inactivity decay.",
        params: { ...DEFAULT_PARAMS },
    },
    {
        id: "v-c",
        name: "V-C · Win-heavy + activity",
        description:
            "Wins weigh more (1st = 20) and every appearance is worth 3 points, so loyal " +
            "players climb while the field of winners stays clearly on top.",
        params: {
            ...DEFAULT_PARAMS,
            participationPoint: 3,
            firstPlaceWeight: 20,
        },
    },
];
