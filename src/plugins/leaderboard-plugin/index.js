/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');

const TurnamentType = {
    Single: 'single',
    Team: 'team',
};

const minimumParticipationThreshold = 3;

/**
 * @param {{
 *   name: string,
 *   pointsPerGame: number,
 *   points: number,
 *   wins: number,
 *   winrate: number,
 *   participations: number,
 *   place: number,
 * }} a
 * @param {{
 *   name: string,
 *   pointsPerGame: number,
 *   points: number,
 *   wins: number,
 *   winrate: number,
 *   participations: number,
 *   place: number,
 * }} b
 * @returns {number}
 */
function sortLeaderBoard(a, b) {
    // People who have only played a few games are ranked at the bottom of the list
    let minimumParticipationComparision = a.participations < minimumParticipationThreshold ? 1 : 0;
    minimumParticipationComparision -= b.participations < minimumParticipationThreshold ? 1 : 0;
    if (minimumParticipationComparision !== 0) {
        return minimumParticipationComparision;
    }

    // High Winrate, high points per game, high points, high wins, low participations

    const winrateComparision = b.winrate - a.winrate;
    if (winrateComparision !== 0) {
        return winrateComparision;
    }

    const pointsPerGameComparision = b.pointsPerGame - a.pointsPerGame;
    if (pointsPerGameComparision !== 0) {
        return pointsPerGameComparision;
    }

    const pointsComparision = b.points - a.points;
    if (pointsComparision !== 0) {
        return pointsComparision;
    }

    const winsComparision = b.wins - a.wins;
    if (winsComparision !== 0) {
        return winsComparision;
    }

    const participationsComparision = a.participations - b.participations;
    if (participationsComparision !== 0) {
        return participationsComparision;
    }

    return 0;
}

/**
 * @param {{name: string, points: number, wins: number}[]} leaderboard
 * @param {string[]} placePlayers
 * @param {number} rating
 * @param {boolean} isWin
 */
function addPointsToPlaces(leaderboard, placePlayers, rating, isWin = false) {
    for (const firstPlacePlayer of placePlayers) {
        const match = leaderboard.find((player) => player.name === firstPlacePlayer);
        if (match === undefined) {
            console.error(`Couldn't find player '${firstPlacePlayer}'`);
            continue;
        }

        match.points += rating;
        match.wins += isWin ? 1 : 0;
    }
}

/**
 * @param {{
 *   name: string,
 *   pointsPerGame: number,
 *   points: number,
 *   wins: number,
 *   winrate: number,
 *   participations: number,
 *   place: number
 * }[]} leaderboard
 * @param {{
 *   type: string,
 *   firstPlace: string[],
 *   secondPlace: string[],
 *   thirdPlace: string[],
 *   participants: string[]
 * }} tournament
 */
function initializeParticipants(leaderboard, tournament) {
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

/**
 * @param {{
 *   name: string,
 *   pointsPerGame: number,
 *   points: number,
 *   wins: number,
 *   winrate: number,
 *   participations: number,
 *   place: number
 * }[]} leaderboard
 * @param {{
 *   type: string,
 *   firstPlace: string[],
 *   secondPlace: string[],
 *   thirdPlace: string[],
 *   participants: string[]
 * }} tournament
 */
function calculateMetrics(leaderboard, tournament) {
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

/**
 * @param {{
 *   rating: {firstPlace: number, secondPlace: number, thirdPlace: number},
 *   tournaments: {
 *     type: string,
 *     firstPlace: string[],
 *     secondPlace: string[],
 *     thirdPlace: string[],
 *     participants: string[]
 *   }[]
 * }} data
 * @param {TurnamentType} type
 */
function fillLeaderboardData(data, type) {
    /**
     * @type {{
     *   name: string,
     *   pointsPerGame: number,
     *   points: number,
     *   wins: number,
     *   winrate: number,
     *   participations: number,
     *   place: number
     * }[]}
     */
    const leaderboard = [];

    // Add points to players
    for (const tournament of data.tournaments) {
        if (tournament.type !== type) {
            continue;
        }

        initializeParticipants(leaderboard, tournament);

        addPointsToPlaces(leaderboard, tournament.firstPlace, data.rating.firstPlace, true);
        addPointsToPlaces(leaderboard, tournament.secondPlace, data.rating.secondPlace);
        addPointsToPlaces(leaderboard, tournament.thirdPlace, data.rating.thirdPlace);

        calculateMetrics(leaderboard, tournament);
    }

    leaderboard.sort(sortLeaderBoard);

    for (let i = 0; i < leaderboard.length; i++) {
        const entry = leaderboard[i];
        entry.place = i + 1;
    }

    return leaderboard;
}

module.exports = async function leaderboardPlugin(_context, _options) {
    return {
        name: 'leaderboard-plugin',
        async loadContent() {
            const data = fs.readFileSync('./tournaments.json', 'utf8');
            return JSON.parse(data);
        },
        /**
         * @param {{
         *   content: {
         *     rating: {firstPlace: number, secondPlace: number, thirdPlace: number},
         *     tournaments: {
         *       date: string,
         *       flavor: string,
         *       type: string,
         *       firstPlace: string[],
         *       secondPlace: string[],
         *       thirdPlace: string[],
         *       participants: string[]
         *     }[]
         *   },
         *   actions: {setGlobalData(data: any): void}
         * }} param0
         */
        async contentLoaded({ content, actions }) {
            const { setGlobalData } = actions;

            // Calculate points and metrics
            const teamLeaderboard = fillLeaderboardData(content, TurnamentType.Team);
            const singleLeaderboard = fillLeaderboardData(content, TurnamentType.Single);

            for (let i = 0; i < content.tournaments.length; i++) {
                const tournament = content.tournaments[i];
                tournament.date = (new Date(Date.parse(tournament.date)))
                    .toLocaleDateString('de-DE', { year: '2-digit', month: '2-digit', day: '2-digit' });
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
};
