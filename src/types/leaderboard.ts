export interface LeaderboardEntry {
    name: string;
    pointsPerGame: number;
    points: number;
    wins: number;
    winrate: number;
    participations: number;
    place: number;
}

export interface Rating {
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
}

export interface Tournament {
    id: number;
    date: string;
    flavor: string | string [];
    type: string;
    firstPlace: string[];
    secondPlace: string[];
    thirdPlace: string[];
    participants: string[];
}

export interface LeadboardData {
    minimumParticipationThreshold: number;
    rating: Rating;
    teamLeaderboard: LeaderboardEntry[];
    singleLeaderboard: LeaderboardEntry[];
    tournaments: Tournament[];
}
