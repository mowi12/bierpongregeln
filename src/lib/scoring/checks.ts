import { QUALIFIED_MIN_PARTICIPATIONS, type TournamentType } from "@/lib/tournament-utils";
import { computeSystemB } from "./system-b";
import type { ExpectationResult, ScoredPlayer, ScoringParams } from "./types";

/**
 * Plain-language expectations about where specific players should land, collected
 * while designing the score. They are not part of the ranking — they are a quick
 * read on whether a given parameter set still matches intuition after a change.
 *
 * One earlier expectation was dropped on purpose: "Marcel above Moritz W. on the
 * team board" is incompatible with rewarding large fields, because Moritz W. won
 * the biggest tournament on record while Marcel did not reach that podium.
 */
interface Expectation {
    id: string;
    board: TournamentType;
    description: string;
    check: (ctx: BoardContext) => boolean;
}

interface BoardContext {
    /** 1-based rank over all players of the board, by final score. */
    rank: (player: string) => number;
    /** 1-based rank among players with at least the qualified number of participations. */
    qualifiedRank: (player: string) => number;
    qualifiedCount: number;
    /** 1-based rank the player would hold if participation points were removed. */
    rankWithoutParticipationPoints: (player: string) => number;
}

const rankLookup = (players: ScoredPlayer[]) => {
    const byPlayer = new Map(players.map((p, i) => [p.player, i + 1]));
    return (player: string) => byPlayer.get(player) ?? Number.POSITIVE_INFINITY;
};

function buildContext(board: TournamentType, params: ScoringParams): BoardContext {
    const players = computeSystemB(board, params);
    const qualified = players.filter((p) => p.participations >= QUALIFIED_MIN_PARTICIPATIONS);
    const withoutParticipation = computeSystemB(board, { ...params, participationPoint: 0 });
    return {
        rank: rankLookup(players),
        qualifiedRank: rankLookup(qualified),
        qualifiedCount: qualified.length,
        rankWithoutParticipationPoints: rankLookup(withoutParticipation),
    };
}

const EXPECTATIONS: Expectation[] = [
    {
        id: "S1",
        board: "single",
        description: "Moritz W. is #1 (most points, most podiums, high activity)",
        check: (c) => c.rank("Moritz W.") === 1,
    },
    {
        id: "S2",
        board: "single",
        description: "Leonhard ranks above Louis (more points, podiums and participations)",
        check: (c) => c.rank("Leonhard") < c.rank("Louis"),
    },
    {
        id: "S3",
        board: "single",
        description: "Marcel ranks above Louis (same reasons)",
        check: (c) => c.rank("Marcel") < c.rank("Louis"),
    },
    {
        id: "T2",
        board: "team",
        description:
            "Michael is in the top 25% of qualified players (few games hold him back from #1)",
        check: (c) => c.qualifiedRank("Michael") <= Math.ceil(c.qualifiedCount * 0.25),
    },
    {
        id: "T3",
        board: "team",
        description:
            "Felix S. (most team appearances, no wins) gains from the participation points",
        check: (c) => c.rank("Felix S.") < c.rankWithoutParticipationPoints("Felix S."),
    },
    {
        id: "T4",
        board: "team",
        description: "Millane ranks below Leonhard and Louis (one old win, long inactive)",
        check: (c) => c.rank("Millane") > c.rank("Leonhard") && c.rank("Millane") > c.rank("Louis"),
    },
];

export function evaluateExpectations(params: ScoringParams): ExpectationResult[] {
    const contexts: Record<TournamentType, BoardContext> = {
        single: buildContext("single", params),
        team: buildContext("team", params),
    };
    return EXPECTATIONS.map(({ id, board, description, check }) => ({
        id,
        board,
        description,
        passed: check(contexts[board]),
    }));
}
