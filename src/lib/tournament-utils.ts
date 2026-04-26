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
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    totalScore: number;
}

export const rating: Rating = tournamentData.rating;
export const tournaments: Tournament[] = tournamentData.tournaments as Tournament[];

function computeStandings(type: TournamentType): PlayerStanding[] {
    const scores = new Map<string, PlayerStanding>();

    for (const t of tournaments) {
        if (t.type !== type) continue;

        const addPoints = (
            players: string[],
            place: keyof Omit<PlayerStanding, "player" | "totalScore">,
        ) => {
            for (const player of players) {
                if (!scores.has(player)) {
                    scores.set(player, {
                        player,
                        firstPlace: 0,
                        secondPlace: 0,
                        thirdPlace: 0,
                        totalScore: 0,
                    });
                }
                const entry = scores.get(player)!;
                entry[place]++;
                entry.totalScore += rating[place];
            }
        };

        addPoints(t.firstPlace, "firstPlace");
        addPoints(t.secondPlace, "secondPlace");
        addPoints(t.thirdPlace, "thirdPlace");
    }

    return Array.from(scores.values()).sort((a, b) => b.totalScore - a.totalScore);
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
