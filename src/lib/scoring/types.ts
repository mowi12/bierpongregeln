import type { TournamentType } from "@/lib/tournament-utils";

export type { TournamentType };

/**
 * Shape of the difficulty coefficient as a function of `fieldSize / medianFieldSize`.
 * A median-sized event always evaluates to 1.0x regardless of the shape.
 */
export type CoefficientShape = "linear" | "linear-cap2" | "sqrt" | "log";

/**
 * How old results lose value.
 * - `cliff`: full value until a player stops showing up, then `decayBase` per
 *   missed unit beyond `decayGrace`.
 * - `recency`: every result is weighted by its age with a `recencyHalfLife`, so
 *   the board reflects current form and inactivity fades out on its own.
 */
export type InactivityMode = "cliff" | "recency";

/** Unit in which age / missed time is measured. */
export type InactivityUnit = "tournaments" | "months";

/**
 * What the cliff decay multiplies.
 * - `full`: the whole base score.
 * - `podium`: only the difficulty-weighted podium points; participation points
 *   are "banked" and never decay.
 */
export type DecayScope = "full" | "podium";

/**
 * Tunable parameters of the experimental "System B" score.
 *
 * ```
 * A        = Σ participationPoint × w(event)              (flat, not difficulty-scaled)
 *          + Σ placeWeight × coefficient(event) × w(event)
 *   w(event) = 1                       in cliff mode
 *            = 0.5 ^ (age / halfLife)  in recency mode
 *
 * adjPpg   = (Araw + shrinkage · avgPpg) / (participations + shrinkage)
 * effMult  = (adjPpg / avgPpg) ^ efficiencyExponent
 * decay    = decayBase ^ max(0, missed − decayGrace)     cliff mode only
 *
 * S        = decayedBase × effMult
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
    /** Which mechanism ages old results. */
    inactivityMode: InactivityMode;
    /** Whether age is counted in tournaments or in calendar months. */
    inactivityUnit: InactivityUnit;
    /** `cliff` mode: base of the inactivity decay, per missed unit. 1 disables decay. */
    decayBase: number;
    /** `cliff` mode: missed units forgiven before decay starts biting. */
    decayGrace: number;
    /** `cliff` mode: whether the decay also eats participation points. */
    decayScope: DecayScope;
    /** `recency` mode: age (in the chosen unit) at which a result is worth half. */
    recencyHalfLife: number;
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
    /** Additive score before ageing: participation + difficulty-weighted podium points. */
    baseScore: number;
    /** Shrunk points-per-game used for the efficiency multiplier. */
    adjustedPointsPerGame: number;
    efficiencyMultiplier: number;
    /** Tournaments of this type held since the player's last appearance. */
    missedTournaments: number;
    /** Effective ageing factor applied to the base score (1 = no loss). */
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
