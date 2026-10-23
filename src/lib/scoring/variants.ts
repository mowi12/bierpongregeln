import type { ScoringParams, ScoringVariant } from "./types";

/**
 * Baseline "System B" parameters. The values that survived the sensitivity sweep
 * unchanged (coefficient shape, shrinkage, efficiency exponent, decay) are fixed
 * here; `participationPoint` and `podiumWeight` are the knobs left open for
 * tuning on the scoring lab page.
 */
export const DEFAULT_PARAMS: ScoringParams = {
    participationPoint: 2,
    podiumWeight: 1,
    coefficientShape: "sqrt",
    shrinkage: 2,
    efficiencyExponent: 0.8,
    inactivityMode: "cliff",
    inactivityUnit: "tournaments",
    decayBase: 0.9,
    decayGrace: 2,
    decayScope: "full",
    recencyHalfLife: 8,
};

/** The configuration agreed for the official leaderboard. */
export const FINAL_PARAMS: ScoringParams = {
    ...DEFAULT_PARAMS,
    participationPoint: 1,
    podiumWeight: 1,
    coefficientShape: "log",
    shrinkage: 2,
    efficiencyExponent: 0.8,
    inactivityMode: "cliff",
    inactivityUnit: "tournaments",
    decayBase: 0.9,
    decayGrace: 2,
    decayScope: "full",
};

export const SCORING_VARIANTS: ScoringVariant[] = [
    {
        id: "final",
        name: "Final",
        description:
            "The agreed configuration: log games-to-win coefficient, shrinkage 2, efficiency " +
            "exponent 0.8, 1 point per appearance, podium points 15/8/3, and a cliff decay of " +
            "0.9 per tournament after 2 missed, applied to the whole score.",
        params: FINAL_PARAMS,
    },
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
        name: "V-C · Podium-heavy + activity",
        description:
            "Podium places weigh more (×1.3, 1st ≈ 20) and every appearance is worth 3 " +
            "points, so loyal players climb while the podium regulars stay clearly on top.",
        params: {
            ...DEFAULT_PARAMS,
            participationPoint: 3,
            podiumWeight: 1.3,
        },
    },
];
