import {
    formatDate,
    rating,
    type Tournament,
    type TournamentType,
    tournaments,
} from "@/lib/tournament-utils";

type Place = "firstPlace" | "secondPlace" | "thirdPlace";

const places: Place[] = ["firstPlace", "secondPlace", "thirdPlace"];

const shortDateFormat = new Intl.DateTimeFormat("de-DE", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
});

/** "Sep 24" style label for chart axes. */
export function formatShortDate(dateStr: string): string {
    return shortDateFormat.format(new Date(`${dateStr}T00:00:00Z`)).replace(".", "");
}

/** All tournaments in chronological order. Tournaments on the same day keep their file order. */
function chronological(): Tournament[] {
    return tournaments
        .map((t, index) => ({ t, index }))
        .sort((a, b) => a.t.date.localeCompare(b.t.date) || a.index - b.index)
        .map(({ t }) => t);
}

function ofType(type: TournamentType): Tournament[] {
    return chronological().filter((t) => t.type === type);
}

function podiumPlayers(t: Tournament): string[] {
    return places.flatMap((place) => t[place]);
}

// --- Key figures ---

export interface Overview {
    tournaments: number;
    players: number;
    largestTournament: number;
    averageSize: number;
    oneTimers: number;
    since: string;
}

export function getOverview(type: TournamentType): Overview {
    const list = ofType(type);
    const appearances = new Map<string, number>();
    for (const t of list) {
        for (const player of t.participants) {
            appearances.set(player, (appearances.get(player) ?? 0) + 1);
        }
    }
    const sizes = list.map((t) => t.participants.length);

    return {
        tournaments: list.length,
        players: appearances.size,
        largestTournament: Math.max(0, ...sizes),
        averageSize: sizes.length > 0 ? sizes.reduce((a, b) => a + b, 0) / sizes.length : 0,
        oneTimers: [...appearances.values()].filter((count) => count === 1).length,
        since: list.length > 0 ? list[0].date : "",
    };
}

// --- Participants per tournament ---

export interface ParticipationPoint {
    id: string;
    label: string;
    date: string;
    returning: number;
    newcomers: number;
}

/**
 * Participants per tournament, split into players who already played any earlier tournament
 * (of either type) and players who appear for the first time.
 */
export function getParticipation(type: TournamentType): ParticipationPoint[] {
    const seen = new Set<string>();
    const points: ParticipationPoint[] = [];

    for (const t of chronological()) {
        const newcomers = t.participants.filter((player) => !seen.has(player)).length;
        for (const player of t.participants) seen.add(player);
        if (t.type !== type) continue;

        points.push({
            id: t.id,
            label: formatShortDate(t.date),
            date: formatDate(t.date),
            returning: t.participants.length - newcomers,
            newcomers,
        });
    }

    return points;
}

// --- Race of the total points ---

export interface RaceStep {
    id: string;
    label: string;
    date: string;
    flavor: string;
    /** Players leading after this tournament (several on a tie). */
    leaders: string[];
    /** Whether the lead changed hands, i.e. none of the previous leaders is still on top. */
    leadChange: boolean;
}

export interface RacePlayer {
    player: string;
    /** Total points after each step, `null` before the player's first podium. */
    points: (number | null)[];
    /** Rank by total points after each step (ties share a rank), `null` before the first podium. */
    ranks: (number | null)[];
    /** Points behind the leader after each step, `null` before the first podium. */
    gaps: (number | null)[];
    finalRank: number;
}

export interface Race {
    steps: RaceStep[];
    /** Sorted by final total points. */
    players: RacePlayer[];
}

/**
 * Total points of every player after each tournament of the given type. Players enter the race
 * with their first podium finish.
 */
export function getRace(type: TournamentType): Race {
    const totals = new Map<string, number>();
    const history = new Map<string, RacePlayer>();
    const steps: RaceStep[] = [];
    const list = ofType(type);

    list.forEach((t, step) => {
        for (const place of places) {
            for (const player of t[place]) {
                totals.set(player, (totals.get(player) ?? 0) + rating[place]);
                if (!history.has(player)) {
                    history.set(player, {
                        player,
                        points: Array(list.length).fill(null),
                        ranks: Array(list.length).fill(null),
                        gaps: Array(list.length).fill(null),
                        finalRank: 0,
                    });
                }
            }
        }

        const lead = Math.max(...totals.values());
        for (const [player, points] of totals) {
            const entry = history.get(player);
            if (!entry) continue;
            entry.points[step] = points;
            entry.ranks[step] = 1 + [...totals.values()].filter((p) => p > points).length;
            entry.gaps[step] = points - lead;
        }

        const leaders = [...totals].filter(([, p]) => p === lead).map(([player]) => player);
        const previous = steps.at(-1)?.leaders ?? [];
        steps.push({
            id: t.id,
            label: formatShortDate(t.date),
            date: formatDate(t.date),
            flavor: Array.isArray(t.flavor) ? t.flavor.join(", ") : t.flavor,
            leaders,
            leadChange: step > 0 && !leaders.some((player) => previous.includes(player)),
        });
    });

    const players = [...history.values()].sort(
        (a, b) => (b.points.at(-1) ?? 0) - (a.points.at(-1) ?? 0),
    );
    for (const entry of players) entry.finalRank = entry.ranks.at(-1) ?? players.length;

    return { steps, players };
}

// --- Records ---

export interface RecordEntry {
    title: string;
    /** Record holders, each a single player or the players of one team. */
    holders: string[][];
    value: string;
    detail?: string;
}

/** Players with the highest count, or none if nobody reached at least one. */
function leadersOf(counts: Map<string, number>): { holders: string[][]; count: number } {
    const count = Math.max(0, ...counts.values());
    if (count === 0) return { holders: [], count };
    return { holders: [...counts].filter(([, c]) => c === count).map(([p]) => [p]), count };
}

function countBy(list: Tournament[], pick: (t: Tournament) => string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const t of list) {
        for (const player of pick(t)) counts.set(player, (counts.get(player) ?? 0) + 1);
    }
    return counts;
}

/**
 * Fun records for the given type. Rates only count players with at least `minParticipations`
 * tournaments, since a single result would dominate them otherwise.
 */
export function getRecords(type: TournamentType, minParticipations: number): RecordEntry[] {
    const list = ofType(type);
    const records: RecordEntry[] = [];
    const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

    const titles = leadersOf(countBy(list, (t) => t.firstPlace));
    if (titles.count > 0) {
        records.push({
            title: "Meiste Titel",
            holders: titles.holders,
            value: plural(titles.count, "Titel", "Titel"),
        });
    }

    const seconds = leadersOf(countBy(list, (t) => t.secondPlace));
    if (seconds.count > 0) {
        records.push({
            title: "Ewiger Zweiter",
            holders: seconds.holders,
            value: plural(seconds.count, "zweiter Platz", "zweite Plätze"),
        });
    }

    const participations = countBy(list, (t) => t.participants);
    const podiums = countBy(list, podiumPlayers);
    let bestRate = 0;
    let rateHolders: string[] = [];
    for (const [player, played] of participations) {
        if (played < minParticipations) continue;
        const rate = (podiums.get(player) ?? 0) / played;
        if (rate > bestRate) {
            bestRate = rate;
            rateHolders = [player];
        } else if (rate === bestRate && rate > 0) {
            rateHolders.push(player);
        }
    }
    if (rateHolders.length > 0) {
        const played = participations.get(rateHolders[0]) ?? 0;
        records.push({
            title: "Beste Podestquote",
            holders: rateHolders.map((player) => [player]),
            value: `${podiums.get(rateHolders[0])} von ${played}`,
            detail: `mindestens ${minParticipations} Turniere`,
        });
    }

    const longestRun = (pick: (t: Tournament) => string[]) => {
        const runs = new Map<string, number>();
        for (const player of participations.keys()) {
            let current = 0;
            let best = 0;
            for (const t of list) {
                current = pick(t).includes(player) ? current + 1 : 0;
                best = Math.max(best, current);
            }
            runs.set(player, best);
        }
        return leadersOf(runs);
    };

    const winRun = longestRun((t) => t.firstPlace);
    if (winRun.count > 1) {
        records.push({
            title: "Titelverteidigung",
            holders: winRun.holders,
            value: plural(winRun.count, "Sieg", "Siege in Folge"),
        });
    }

    const streak = longestRun((t) => t.participants);
    if (streak.count > 1) {
        records.push({
            title: "Längste Serie",
            holders: streak.holders,
            value: plural(streak.count, "Turnier", "Turniere in Folge"),
            detail: "dabei gewesen",
        });
    }

    const latest = list.at(-1);
    if (latest) {
        const earlierWinners = new Set(list.slice(0, -1).flatMap((t) => t.firstPlace));
        const firstTimers = latest.firstPlace.filter((player) => !earlierWinners.has(player));
        if (firstTimers.length > 0) {
            records.push({
                title: "Neuster Champion",
                holders: [firstTimers],
                value: "erster Titel",
                detail: formatDate(latest.date),
            });
        }
    }

    return records;
}
