import {
    formatFlavor,
    getSingleStandings,
    getTeamStandings,
    QUALIFIED_MIN_PARTICIPATIONS,
    type Tournament,
    type TournamentType,
    tournaments,
} from "@/lib/tournament-utils";
import type { CoefficientShape, EventValue, ScoredPlayer, ScoringParams } from "./types";

/**
 * Effective field size: head count for single events, team count for team events.
 * An odd participant count means one player ran a team solo — that still counts
 * as a full team, so the team count is rounded up.
 */
export function fieldSize(t: Tournament): number {
    return t.type === "team" ? Math.ceil(t.participants.length / 2) : t.participants.length;
}

function median(values: number[]): number {
    if (values.length === 0) return 1;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Difficulty coefficient for an event, normalised so a median-sized event is 1.0x.
 */
export function coefficient(shape: CoefficientShape, n: number, medianN: number): number {
    if (medianN <= 1 || n <= 0) return 1;
    const ratio = n / medianN;
    switch (shape) {
        case "linear":
            return ratio;
        case "linear-cap2":
            return Math.min(2, ratio);
        case "sqrt":
            return Math.sqrt(ratio);
        case "log":
            return Math.log(n) / Math.log(medianN);
    }
}

function boardTournaments(board: TournamentType): Tournament[] {
    return tournaments
        .filter((t) => t.type === board)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** Whole calendar months from `fromISO` to `toISO`, never negative. */
function monthsBetween(fromISO: string, toISO: string): number {
    const from = new Date(fromISO);
    const to = new Date(toISO);
    const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    return Math.max(0, months);
}

function currentRankMap(board: TournamentType): Map<string, number> {
    const standings = board === "team" ? getTeamStandings() : getSingleStandings();
    const qualified = standings.filter((s) => s.participations >= QUALIFIED_MIN_PARTICIPATIONS);
    const map = new Map<string, number>();
    qualified.forEach((s, i) => {
        map.set(s.player, i + 1);
    });
    return map;
}

interface Accumulator {
    player: string;
    participations: number;
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    /** Recency-weighted participation points (equals `rawParticipation` in cliff mode). */
    participationScore: number;
    /** Recency-weighted, difficulty-weighted podium points. */
    podiumScore: number;
    /** Un-aged additive score, used for the efficiency baseline. */
    rawBaseScore: number;
    lastEventIndex: number;
    lastEventDate: string;
}

/**
 * Compute the experimental "System B" ranking for one board.
 * Players are returned sorted by final score, highest first.
 */
export function computeSystemB(board: TournamentType, params: ScoringParams): ScoredPlayer[] {
    const events = boardTournaments(board);
    if (events.length === 0) return [];

    const medianN = median(events.map(fieldSize));
    const lastIndex = events.length - 1;
    const newestDate = events[lastIndex].date;
    const halfLife = Math.max(params.recencyHalfLife, 0.1);
    const placeWeight = {
        firstPlace: params.firstPlaceWeight,
        secondPlace: params.secondPlaceWeight,
        thirdPlace: params.thirdPlaceWeight,
    } as const;

    const ageOf = (event: Tournament, index: number): number =>
        params.inactivityUnit === "months"
            ? monthsBetween(event.date, newestDate)
            : lastIndex - index;

    const acc = new Map<string, Accumulator>();
    const ensure = (player: string): Accumulator => {
        let entry = acc.get(player);
        if (!entry) {
            entry = {
                player,
                participations: 0,
                firstPlace: 0,
                secondPlace: 0,
                thirdPlace: 0,
                participationScore: 0,
                podiumScore: 0,
                rawBaseScore: 0,
                lastEventIndex: -1,
                lastEventDate: newestDate,
            };
            acc.set(player, entry);
        }
        return entry;
    };

    events.forEach((event, index) => {
        const coef = coefficient(params.coefficientShape, fieldSize(event), medianN);
        const weight =
            params.inactivityMode === "recency" ? 0.5 ** (ageOf(event, index) / halfLife) : 1;
        for (const player of event.participants) {
            const entry = ensure(player);
            entry.participations++;
            entry.participationScore += params.participationPoint * weight;
            entry.rawBaseScore += params.participationPoint;
            entry.lastEventIndex = index;
            entry.lastEventDate = event.date;
        }
        for (const place of ["firstPlace", "secondPlace", "thirdPlace"] as const) {
            for (const player of event[place]) {
                const entry = ensure(player);
                entry[place]++;
                const points = placeWeight[place] * coef;
                entry.podiumScore += points * weight;
                entry.rawBaseScore += points;
            }
        }
    });

    const players = [...acc.values()].filter((p) => p.participations > 0);
    const totalRawBase = players.reduce((sum, p) => sum + p.rawBaseScore, 0);
    const totalParticipations = players.reduce((sum, p) => sum + p.participations, 0);
    const avgPpg = totalParticipations > 0 ? totalRawBase / totalParticipations : 1;

    const ranks = currentRankMap(board);

    const scored: ScoredPlayer[] = players.map((p) => {
        const adjustedPointsPerGame =
            (p.rawBaseScore + params.shrinkage * avgPpg) / (p.participations + params.shrinkage);
        const efficiencyMultiplier =
            avgPpg > 0 ? (adjustedPointsPerGame / avgPpg) ** params.efficiencyExponent : 1;

        const missedUnits =
            params.inactivityUnit === "months"
                ? monthsBetween(p.lastEventDate, newestDate)
                : lastIndex - p.lastEventIndex;

        let decayedBase: number;
        if (params.inactivityMode === "recency") {
            decayedBase = p.participationScore + p.podiumScore;
        } else {
            const decayFactor = params.decayBase ** Math.max(0, missedUnits - params.decayGrace);
            decayedBase =
                params.decayScope === "podium"
                    ? p.participationScore + p.podiumScore * decayFactor
                    : (p.participationScore + p.podiumScore) * decayFactor;
        }

        const decay = p.rawBaseScore > 0 ? decayedBase / p.rawBaseScore : 1;

        return {
            player: p.player,
            participations: p.participations,
            firstPlace: p.firstPlace,
            secondPlace: p.secondPlace,
            thirdPlace: p.thirdPlace,
            podiumFinishes: p.firstPlace + p.secondPlace + p.thirdPlace,
            baseScore: p.rawBaseScore,
            adjustedPointsPerGame,
            efficiencyMultiplier,
            missedTournaments: lastIndex - p.lastEventIndex,
            decay,
            finalScore: decayedBase * efficiencyMultiplier,
            currentRank: ranks.get(p.player) ?? null,
        };
    });

    return scored.sort((a, b) => {
        if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
        if (b.baseScore !== a.baseScore) return b.baseScore - a.baseScore;
        return b.participations - a.participations;
    });
}

/**
 * Per-tournament difficulty coefficient and what a podium finish there is worth,
 * for one board. Ordered newest first.
 */
export function computeEventValues(board: TournamentType, params: ScoringParams): EventValue[] {
    const events = boardTournaments(board);
    const medianN = median(events.map(fieldSize));

    return events
        .map((event, index) => {
            const effectiveFieldSize = fieldSize(event);
            const coef = coefficient(params.coefficientShape, effectiveFieldSize, medianN);
            return {
                id: `${board}-${index}`,
                date: event.date,
                flavor: formatFlavor(event.flavor),
                participants: event.participants.length,
                effectiveFieldSize,
                medianFieldSize: medianN,
                coefficient: coef,
                firstPlaceValue: params.firstPlaceWeight * coef,
                secondPlaceValue: params.secondPlaceWeight * coef,
                thirdPlaceValue: params.thirdPlaceWeight * coef,
            };
        })
        .reverse();
}
