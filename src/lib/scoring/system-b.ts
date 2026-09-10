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
    baseScore: number;
    lastEventIndex: number;
}

/**
 * Compute the experimental "System B" ranking for one board.
 * Players are returned sorted by final score, highest first.
 */
export function computeSystemB(board: TournamentType, params: ScoringParams): ScoredPlayer[] {
    const events = boardTournaments(board);
    const medianN = median(events.map(fieldSize));
    const placeWeight = {
        firstPlace: params.firstPlaceWeight,
        secondPlace: params.secondPlaceWeight,
        thirdPlace: params.thirdPlaceWeight,
    } as const;

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
                baseScore: 0,
                lastEventIndex: -1,
            };
            acc.set(player, entry);
        }
        return entry;
    };

    events.forEach((event, index) => {
        const coef = coefficient(params.coefficientShape, fieldSize(event), medianN);
        for (const player of event.participants) {
            const entry = ensure(player);
            entry.participations++;
            entry.baseScore += params.participationPoint;
            entry.lastEventIndex = index;
        }
        for (const place of ["firstPlace", "secondPlace", "thirdPlace"] as const) {
            for (const player of event[place]) {
                const entry = ensure(player);
                entry[place]++;
                entry.baseScore += placeWeight[place] * coef;
            }
        }
    });

    const players = [...acc.values()].filter((p) => p.participations > 0);
    const totalBase = players.reduce((sum, p) => sum + p.baseScore, 0);
    const totalParticipations = players.reduce((sum, p) => sum + p.participations, 0);
    const avgPpg = totalParticipations > 0 ? totalBase / totalParticipations : 1;

    const ranks = currentRankMap(board);

    const scored: ScoredPlayer[] = players.map((p) => {
        const adjustedPointsPerGame =
            (p.baseScore + params.shrinkage * avgPpg) / (p.participations + params.shrinkage);
        const efficiencyMultiplier =
            avgPpg > 0 ? (adjustedPointsPerGame / avgPpg) ** params.efficiencyExponent : 1;
        const missedTournaments = events.length - 1 - p.lastEventIndex;
        const decay = params.decayBase ** Math.max(0, missedTournaments - params.decayGrace);

        return {
            player: p.player,
            participations: p.participations,
            firstPlace: p.firstPlace,
            secondPlace: p.secondPlace,
            thirdPlace: p.thirdPlace,
            podiumFinishes: p.firstPlace + p.secondPlace + p.thirdPlace,
            baseScore: p.baseScore,
            adjustedPointsPerGame,
            efficiencyMultiplier,
            missedTournaments,
            decay,
            finalScore: p.baseScore * efficiencyMultiplier * decay,
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
