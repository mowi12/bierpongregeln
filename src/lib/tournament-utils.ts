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
    /** Deduction for tournaments missed since the last participation (1 = none). */
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
 * activity    = inactivityDecay ^ max(0, missed tournaments − inactivityGrace)
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
    /** Factor per missed tournament once the grace is used up. */
    inactivityDecay: 0.9,
    /** Missed tournaments of the board that are not penalised. */
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

function computeStandings(type: TournamentType): PlayerStanding[] {
    const events = tournaments
        .filter((t) => t.type === type)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (events.length === 0) return [];

    const medianGamesToWin = median(events.map((t) => t.gamesToWin));
    const standings = new Map<string, PlayerStanding>();
    const lastEventIndex = new Map<string, number>();

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
        }
        return entry;
    }

    events.forEach((t, index) => {
        const coefficient = tournamentCoefficient(t.gamesToWin, medianGamesToWin);

        for (const player of t.participants) {
            const entry = ensureEntry(player);
            entry.participations++;
            entry.points += scoring.participationPoints;
            lastEventIndex.set(player, index);
        }

        for (const place of ["firstPlace", "secondPlace", "thirdPlace"] as const) {
            for (const player of t[place]) {
                const entry = ensureEntry(player);
                entry[place]++;
                entry.points += rating[place] * coefficient;
            }
        }
    });

    const entries = Array.from(standings.values());
    const totalPoints = entries.reduce((sum, e) => sum + e.points, 0);
    const totalParticipations = entries.reduce((sum, e) => sum + e.participations, 0);
    const averagePoints = totalParticipations > 0 ? totalPoints / totalParticipations : 0;

    for (const entry of entries) {
        entry.podiumFinishes = entry.firstPlace + entry.secondPlace + entry.thirdPlace;

        if (averagePoints > 0) {
            const shrunkPoints =
                (entry.points + scoring.shrinkage * averagePoints) /
                (entry.participations + scoring.shrinkage);
            entry.form = (shrunkPoints / averagePoints) ** scoring.formExponent;
        }

        const missed = events.length - 1 - (lastEventIndex.get(entry.player) ?? -1);
        entry.activity = scoring.inactivityDecay ** Math.max(0, missed - scoring.inactivityGrace);
        entry.score = entry.points * entry.form * entry.activity;
    }

    return entries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.points !== a.points) return b.points - a.points;
        return b.participations - a.participations;
    });
}

export function getTeamStandings(): PlayerStanding[] {
    return computeStandings("team");
}

export function getSingleStandings(): PlayerStanding[] {
    return computeStandings("single");
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
