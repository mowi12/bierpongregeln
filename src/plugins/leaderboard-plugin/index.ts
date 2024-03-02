import {
    LeadboardData,
    LeaderboardEntry,
    Rating,
    Tournament,
} from "@site/src/types/leaderboard";
import fs from "fs";

type TurnamentType = "single" | "team";

const minimumParticipationThreshold = 3;

interface GameData {
    rating: Rating;
    tournaments: Tournament[];
}

interface ContentWrapper {
    content: GameData;
    actions: {
        setGlobalData(data: LeadboardData): void;
    };
}

function sortLeaderBoard(a: LeaderboardEntry, b: LeaderboardEntry): number {
    // People who have only played a few games are ranked at the bottom of the list
    let minimumParticipationComparison =
        a.participations < minimumParticipationThreshold ? 1 : 0;
    minimumParticipationComparison -=
        b.participations < minimumParticipationThreshold ? 1 : 0;
    if (minimumParticipationComparison !== 0) {
        return minimumParticipationComparison;
    }

    // High Winrate, high points per game, high points, high wins, low participations

    const winrateComparison = b.winrate - a.winrate;
    if (winrateComparison !== 0) {
        return winrateComparison;
    }

    const pointsPerGameComparison = b.pointsPerGame - a.pointsPerGame;
    if (pointsPerGameComparison !== 0) {
        return pointsPerGameComparison;
    }

    const pointsComparison = b.points - a.points;
    if (pointsComparison !== 0) {
        return pointsComparison;
    }

    const winsComparison = b.wins - a.wins;
    if (winsComparison !== 0) {
        return winsComparison;
    }

    const participationsComparison = a.participations - b.participations;
    if (participationsComparison !== 0) {
        return participationsComparison;
    }

    return 0;
}

function addPointsToPlaces(
    leaderboard: LeaderboardEntry[],
    placePlayers: string[],
    rating: number,
    isWin = false
) {
    for (const firstPlacePlayer of placePlayers) {
        const match = leaderboard.find(
            (player) => player.name === firstPlacePlayer
        );
        if (match === undefined) {
            console.error(`Couldn't find player '${firstPlacePlayer}'`);
            continue;
        }

        match.points += rating;
        match.wins += isWin ? 1 : 0;
    }
}

function initializeParticipants(
    leaderboard: LeaderboardEntry[],
    tournament: Tournament
) {
    for (const participant of tournament.participants) {
        let match = leaderboard.find((player) => player.name === participant);
        if (match === undefined) {
            // If there's no match, create a new entry with default values
            match = {
                name: participant,
                pointsPerGame: 0,
                points: 0,
                wins: 0,
                winrate: 0,
                participations: 0,
                place: 0,
            };
            leaderboard.push(match);
        }
        match.participations++;
    }
}

function calculateMetrics(
    leaderboard: LeaderboardEntry[],
    tournament: Tournament
) {
    for (const participant of tournament.participants) {
        const match = leaderboard.find((player) => player.name === participant);
        if (match === undefined) {
            console.error(`Couldn't find player '${participant}'`);
            continue;
        }
        match.pointsPerGame = match.points / match.participations;
        match.winrate = match.wins / match.participations;
    }
}

function fillLeaderboardData(
    data: GameData,
    type: TurnamentType
): LeaderboardEntry[] {
    const leaderboard: LeaderboardEntry[] = [];

    // Add points to players
    for (const tournament of data.tournaments) {
        if (tournament.type !== type) {
            continue;
        }

        initializeParticipants(leaderboard, tournament);

        addPointsToPlaces(
            leaderboard,
            tournament.firstPlace,
            data.rating.firstPlace,
            true
        );
        addPointsToPlaces(
            leaderboard,
            tournament.secondPlace,
            data.rating.secondPlace
        );
        addPointsToPlaces(
            leaderboard,
            tournament.thirdPlace,
            data.rating.thirdPlace
        );

        calculateMetrics(leaderboard, tournament);
    }

    leaderboard.sort(sortLeaderBoard);

    for (let i = 0; i < leaderboard.length; i++) {
        const entry = leaderboard[i];
        entry.place = i + 1;
    }

    return leaderboard;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function leaderboardPlugin(_context: unknown, _options: unknown) {
    return {
        name: "leaderboard-plugin",
        async loadContent() {
            const data = fs.readFileSync("./tournaments.json", "utf8");
            return JSON.parse(data);
        },
        async contentLoaded(wrapper: ContentWrapper) {
            const { content, actions } = wrapper;
            const { setGlobalData } = actions;

            // Calculate points and metrics
            const teamLeaderboard = fillLeaderboardData(content, "team");
            const singleLeaderboard = fillLeaderboardData(content, "single");

            for (let i = 0; i < content.tournaments.length; i++) {
                const tournament = content.tournaments[i];
                tournament.date = new Date(
                    Date.parse(tournament.date)
                ).toLocaleDateString("de-DE", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                });
                tournament.id = i;
            }

            setGlobalData({
                minimumParticipationThreshold,
                rating: content.rating,
                teamLeaderboard,
                singleLeaderboard,
                tournaments: content.tournaments,
            });
        },
    };
}

export default leaderboardPlugin;
