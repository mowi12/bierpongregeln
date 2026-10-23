import tournamentData from "../../tournaments.json";

export type TournamentType = "single" | "team";

export interface Tournament {
    id: string;
    date: string;
    flavor: string | string[];
    type: string;
    firstPlace: string[];
    secondPlace: string[];
    thirdPlace: string[];
    participants: string[];
    /** Games a player or team has to play and win to take the tournament. */
    gamesToWin: number;
}

export interface Rating {
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
}

export interface PlayerStanding {
    player: string;
    participations: number;
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    podiumFinishes: number;
    /** Participation points plus podium points weighted by the tournament coefficient. */
    points: number;
    /** Points per tournament relative to the average, shrunk toward 1 for few participations. */
    form: number;
    /** Deduction for tournament days missed since the last participation (1 = none). */
    activity: number;
    /** Final ranking value: `points × form × activity`. */
    score: number;
}

export const QUALIFIED_MIN_PARTICIPATIONS = 3;

/**
 * Parameters of the ranking:
 *
 * ```
 * coefficient = ln(gamesToWin) / ln(median gamesToWin of the board)
 * points      = Σ participationPoints + Σ rating[place] × coefficient
 * form        = ((points + shrinkage · avg) / (participations + shrinkage) / avg) ^ formExponent
 *               avg = points per participation over all players of the board
 * activity    = inactivityDecay ^ max(0, missed tournament days − inactivityGrace)
 *               (several tournaments on the same date count as one missed day)
 * score       = points × form × activity
 * ```
 */
export const scoring = {
    /** Points for every tournament entered. */
    participationPoints: 1,
    /** Pseudo-tournaments at the average added to each player's record for the form. */
    shrinkage: 2,
    /** How strongly the form moves the score. */
    formExponent: 0.8,
    /** Factor per missed tournament day once the grace is used up. */
    inactivityDecay: 0.9,
    /** Missed tournament days of the board that are not penalised. */
    inactivityGrace: 2,
} as const;

export const rating: Rating = tournamentData.rating;
export const tournaments: Tournament[] = tournamentData.tournaments.map((t, i) => ({
    id: `tournament-${i}`,
    ...t,
}));

function median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Weight of a tournament by how many games it took to win it. Grows logarithmically and is
 * 1.0 for the median tournament of the board, so the reference moves with new tournaments.
 */
function tournamentCoefficient(gamesToWin: number, medianGamesToWin: number): number {
    if (medianGamesToWin <= 1 || gamesToWin <= 0) return 1;
    return Math.log(gamesToWin) / Math.log(medianGamesToWin);
}

/** One podium finish and the points it earned. */
export interface PodiumResult {
    date: string;
    place: 1 | 2 | 3;
    /** Podium points before the coefficient (`rating`). */
    basePoints: number;
    gamesToWin: number;
    coefficient: number;
    /** `basePoints × coefficient`. */
    points: number;
}

/** Intermediate values of a player's score, for explaining the calculation. */
export interface ScoreBreakdown {
    player: string;
    participations: number;
    /** `participations × scoring.participationPoints`. */
    participationPoints: number;
    podiums: PodiumResult[];
    points: number;
    /** `(points + shrinkage · averagePoints) / (participations + shrinkage)`. */
    adjustedPointsPerTournament: number;
    form: number;
    lastParticipationDate: string;
    /** Tournament days of the board after the last participation. */
    missedDays: number;
    activity: number;
    score: number;
}

/** Board-wide values the score depends on. */
export interface BoardScoring {
    standings: PlayerStanding[];
    /** Same order as `standings`. */
    breakdowns: ScoreBreakdown[];
    medianGamesToWin: number;
    /** Points per participation over all players of the board. */
    averagePoints: number;
    tournamentDays: number;
}

const PLACES = [
    ["firstPlace", 1],
    ["secondPlace", 2],
    ["thirdPlace", 3],
] as const;

function computeBoard(type: TournamentType): BoardScoring {
    const events = tournaments
        .filter((t) => t.type === type)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (events.length === 0) {
        return {
            standings: [],
            breakdowns: [],
            medianGamesToWin: 0,
            averagePoints: 0,
            tournamentDays: 0,
        };
    }

    const medianGamesToWin = median(events.map((t) => t.gamesToWin));
    // Several tournaments on one date count as a single day for the activity deduction.
    const tournamentDates = [...new Set(events.map((t) => t.date))];
    const standings = new Map<string, PlayerStanding>();
    const podiums = new Map<string, PodiumResult[]>();
    const lastParticipationDate = new Map<string, string>();

    function ensureEntry(player: string): PlayerStanding {
        let entry = standings.get(player);
        if (!entry) {
            entry = {
                player,
                participations: 0,
                firstPlace: 0,
                secondPlace: 0,
                thirdPlace: 0,
                podiumFinishes: 0,
                points: 0,
                form: 1,
                activity: 1,
                score: 0,
            };
            standings.set(player, entry);
            podiums.set(player, []);
        }
        return entry;
    }

    for (const t of events) {
        const coefficient = tournamentCoefficient(t.gamesToWin, medianGamesToWin);

        for (const player of t.participants) {
            const entry = ensureEntry(player);
            entry.participations++;
            entry.points += scoring.participationPoints;
            lastParticipationDate.set(player, t.date);
        }

        for (const [place, placeNumber] of PLACES) {
            for (const player of t[place]) {
                const entry = ensureEntry(player);
                const points = rating[place] * coefficient;
                entry[place]++;
                entry.points += points;
                podiums.get(player)?.push({
                    date: t.date,
                    place: placeNumber,
                    basePoints: rating[place],
                    gamesToWin: t.gamesToWin,
                    coefficient,
                    points,
                });
            }
        }
    }

    const entries = Array.from(standings.values());
    const totalPoints = entries.reduce((sum, e) => sum + e.points, 0);
    const totalParticipations = entries.reduce((sum, e) => sum + e.participations, 0);
    const averagePoints = totalParticipations > 0 ? totalPoints / totalParticipations : 0;
    const breakdowns = new Map<string, ScoreBreakdown>();

    for (const entry of entries) {
        entry.podiumFinishes = entry.firstPlace + entry.secondPlace + entry.thirdPlace;

        const adjustedPointsPerTournament =
            (entry.points + scoring.shrinkage * averagePoints) /
            (entry.participations + scoring.shrinkage);
        if (averagePoints > 0) {
            entry.form = (adjustedPointsPerTournament / averagePoints) ** scoring.formExponent;
        }

        const lastDate = lastParticipationDate.get(entry.player) ?? "";
        const missedDays = tournamentDates.filter((date) => date > lastDate).length;
        entry.activity =
            scoring.inactivityDecay ** Math.max(0, missedDays - scoring.inactivityGrace);
        entry.score = entry.points * entry.form * entry.activity;

        breakdowns.set(entry.player, {
            player: entry.player,
            participations: entry.participations,
            participationPoints: entry.participations * scoring.participationPoints,
            podiums: podiums.get(entry.player) ?? [],
            points: entry.points,
            adjustedPointsPerTournament,
            form: entry.form,
            lastParticipationDate: lastDate,
            missedDays,
            activity: entry.activity,
            score: entry.score,
        });
    }

    const sorted = entries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.points !== a.points) return b.points - a.points;
        return b.participations - a.participations;
    });

    return {
        standings: sorted,
        breakdowns: sorted.map((e) => breakdowns.get(e.player) as ScoreBreakdown),
        medianGamesToWin,
        averagePoints,
        tournamentDays: tournamentDates.length,
    };
}

const boardCache = new Map<TournamentType, BoardScoring>();

/** Standings plus the intermediate values of every player's score. */
export function getBoardScoring(type: TournamentType): BoardScoring {
    let board = boardCache.get(type);
    if (!board) {
        board = computeBoard(type);
        boardCache.set(type, board);
    }
    return board;
}

export function getTeamStandings(): PlayerStanding[] {
    return getBoardScoring("team").standings;
}

export function getSingleStandings(): PlayerStanding[] {
    return getBoardScoring("single").standings;
}

export function formatFlavor(flavor: string | string[]): string {
    return Array.isArray(flavor) ? flavor.join(", ") : flavor;
}

export function formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
}

export function getQualifiedStandings(standings: PlayerStanding[]): PlayerStanding[] {
    return standings.filter((p) => p.participations >= QUALIFIED_MIN_PARTICIPATIONS);
}

export function getRecentTournaments(type: TournamentType, count: number): Tournament[] {
    return tournaments
        .filter((t) => t.type === type)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count);
}

const shortMonthFormat = new Intl.DateTimeFormat("de-DE", { month: "short", timeZone: "UTC" });

export function formatDateParts(dateStr: string): { day: string; month: string } {
    const [, , day] = dateStr.split("-");
    const month = shortMonthFormat.format(new Date(`${dateStr}T00:00:00Z`)).replace(".", "");
    return { day, month };
}
