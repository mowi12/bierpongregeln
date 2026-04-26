import tournamentData from "../../tournaments.json";

export type TournamentType = "single" | "team";

export interface Tournament {
    date: string;
    flavor: string | string[];
    type: TournamentType;
    firstPlace: string[];
    secondPlace: string[];
    thirdPlace: string[];
    participants: string[];
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
    totalScore: number;
    winRate: number;
    pointsPerGame: number;
}

export const QUALIFIED_MIN_PARTICIPATIONS = 3;

export const rating: Rating = tournamentData.rating;
export const tournaments: Tournament[] = tournamentData.tournaments as Tournament[];

function computeStandings(type: TournamentType): PlayerStanding[] {
    const scores = new Map<string, PlayerStanding>();

    function ensureEntry(player: string): PlayerStanding {
        if (!scores.has(player)) {
            scores.set(player, {
                player,
                participations: 0,
                firstPlace: 0,
                secondPlace: 0,
                thirdPlace: 0,
                totalScore: 0,
                winRate: 0,
                pointsPerGame: 0,
            });
        }
        return scores.get(player)!;
    }

    for (const t of tournaments) {
        if (t.type !== type) continue;

        for (const player of t.participants) {
            ensureEntry(player).participations++;
        }

        const addPoints = (
            players: string[],
            place: "firstPlace" | "secondPlace" | "thirdPlace",
        ) => {
            for (const player of players) {
                const entry = ensureEntry(player);
                entry[place]++;
                entry.totalScore += rating[place];
            }
        };

        addPoints(t.firstPlace, "firstPlace");
        addPoints(t.secondPlace, "secondPlace");
        addPoints(t.thirdPlace, "thirdPlace");
    }

    for (const entry of scores.values()) {
        entry.winRate = entry.participations > 0 ? entry.firstPlace / entry.participations : 0;
        entry.pointsPerGame =
            entry.participations > 0 ? entry.totalScore / entry.participations : 0;
    }

    return Array.from(scores.values()).sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        if (b.pointsPerGame !== a.pointsPerGame) return b.pointsPerGame - a.pointsPerGame;
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.firstPlace !== a.firstPlace) return b.firstPlace - a.firstPlace;
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
