import type { TournamentType } from "@/lib/tournament-utils";

export type { TournamentType };

/**
 * Shape of the difficulty coefficient as a function of `fieldSize / medianFieldSize`.
 * A median-sized event always evaluates to 1.0x regardless of the shape.
 */
export type CoefficientShape = "linear" | "linear-cap2" | "sqrt" | "log";

/**
 * Tunable parameters of the experimental "System B" score.
 *
 * ```
 * A        = Σ participationPoint                         (flat, not difficulty-scaled)
 *          + Σ placeWeight × coefficient(event)           (difficulty-scaled)
 *
 * adjPpg   = (A + shrinkage · avgPpg) / (participations + shrinkage)
 * effMult  = (adjPpg / avgPpg) ^ efficiencyExponent
 * decay    = decayBase ^ max(0, missed − decayGrace)
 *
 * S        = A × effMult × decay
 * ```
 */
export interface ScoringParams {
    /** Flat points for entering a tournament. Not scaled by field size. */
    participationPoint: number;
    /** Points for 1st place before the difficulty coefficient. */
    firstPlaceWeight: number;
    /** Points for 2nd place before the difficulty coefficient. */
    secondPlaceWeight: number;
    /** Points for 3rd place before the difficulty coefficient. */
    thirdPlaceWeight: number;
    /** How the difficulty coefficient grows with field size. */
    coefficientShape: CoefficientShape;
    /** Pseudo-tournaments at the field average added when estimating a player's rate. */
    shrinkage: number;
    /** Exponent applied to `adjPpg / avgPpg`. 0 disables the efficiency guardrail. */
    efficiencyExponent: number;
    /** Base of the inactivity decay. 1 disables decay. */
    decayBase: number;
    /** Missed tournaments that are forgiven before decay starts biting. */
    decayGrace: number;
}

export interface ScoringVariant {
    id: string;
    name: string;
    description: string;
    params: ScoringParams;
}

export interface ScoredPlayer {
    player: string;
    participations: number;
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    podiumFinishes: number;
    /** Raw additive score `A` (participation + difficulty-weighted podium points). */
    baseScore: number;
    /** Shrunk points-per-game used for the efficiency multiplier. */
    adjustedPointsPerGame: number;
    efficiencyMultiplier: number;
    /** Tournaments of this type held since the player's last appearance. */
    missedTournaments: number;
    decay: number;
    /** Final score `S` used for ranking. */
    finalScore: number;
    /** 1-based rank in the current (shipped) ranking, or null if unranked there. */
    currentRank: number | null;
}

export interface ExpectationResult {
    id: string;
    board: TournamentType;
    description: string;
    passed: boolean;
}

export interface EventValue {
    id: string;
    date: string;
    flavor: string;
    /** Raw participant count. */
    participants: number;
    /** Effective field size used for the coefficient: players (single) or teams (team). */
    effectiveFieldSize: number;
    /** Median effective field size of the board — the event that scores exactly 1.0x. */
    medianFieldSize: number;
    coefficient: number;
    firstPlaceValue: number;
    secondPlaceValue: number;
    thirdPlaceValue: number;
}
