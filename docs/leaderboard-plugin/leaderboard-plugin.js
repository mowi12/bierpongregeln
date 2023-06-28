/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
/* global $docsify:writeable */

const tags = [
    "{{rating}}",
    "{{teamLeaderboard}}",
    "{{singleLeaderboard}}",
    "{{tournaments}}",
];

(function () {
    var leaderboardPlugin = function (hook, _) {
        hook.beforeEach(
            /** @param {string} markdown */
            function (markdown, next) {
                // Only run plugin if markdown contains tags
                if (!tags.some((tag) => markdown.includes(tag))) {
                    next(markdown);
                    return;
                }

                try {
                    fetch("./leaderboard-plugin/tournaments.json")
                        .then((response) => response.json())
                        .then((data) => next(createLeaderboard(markdown, data)));
                } catch (error) {
                    console.error(error);
                } finally {
                    next(markdown);
                }
            }
        );
    };

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], leaderboardPlugin);
})();

const TurnamentType = {
    Single: "single",
    Team: "team"
};

function createLeaderboard(markdown, jsonData) {
    /**
     * @type {{rating: {firstPlace: number, secondPlace: number, thirdPlace: number}, tournaments: {date: string, flavor: string, type: string, firstPlace: string[], secondPlace: string[], thirdPlace: string[], participants: string[]}[]}}
     */
    const data = jsonData;

    // Calculate points and metrics
    const teamLeaderboard = fillLeaderboardData(data, TurnamentType.Team);
    const singleLeaderboard = fillLeaderboardData(data, TurnamentType.Single);

    // Rating
    let ratingMarkdown = `1. Platz: ${formatRating(data.rating.firstPlace)}\n`;
    ratingMarkdown += `2. Platz: ${formatRating(data.rating.secondPlace)}\n`;
    ratingMarkdown += `3. Platz: ${formatRating(data.rating.thirdPlace)}\n`;
    markdown = markdown.replace("{{rating}}", ratingMarkdown);

    const teamLeaderboardMarkdown = getLeaderboardMarkdown(teamLeaderboard);
    markdown = markdown.replace("{{teamLeaderboard}}", teamLeaderboardMarkdown);

    const singleLeaderboardMarkdown = getLeaderboardMarkdown(singleLeaderboard);
    markdown = markdown.replace("{{singleLeaderboard}}", singleLeaderboardMarkdown);

    const tournamentMarkdown = getTournamentMarkdown(data.tournaments);
    markdown = markdown.replace("{{tournaments}}", tournamentMarkdown);

    return markdown;
}

/**
 * @param {number} rating 
 */
function formatRating(rating) {
    return `${rating} Punkt${rating > 1 ? "e" : ""}`;
}

/**
 * @param {{rating: {firstPlace: number, secondPlace: number, thirdPlace: number}, tournaments: {type: string, firstPlace: string[], secondPlace: string[], thirdPlace: string[], participants: string[]}[]}} data 
 * @param {TurnamentType} type
 */
function fillLeaderboardData(data, type) {
    /**
     * @type {{name: string, pointsPerGame: number, points: number, wins: number, winrate: number, participations: number}[]}
     */
    let leaderboard = [];

    // Add points to players
    for (const tournament of data.tournaments) {
        if (tournament.type !== type) {
            continue;
        }

        for (const participant of tournament.participants) {
            let match = leaderboard.find((player) => player.name == participant);
            if (match == undefined) {
                // If there's no match, create a new entry with default values
                match = {
                    name: participant,
                    pointsPerGame: 0,
                    points: 0,
                    wins: 0,
                    winrate: 0,
                    participations: 0,
                };
                leaderboard.push(match);
            }
            match.participations++;
        }

        addPointsToPlaces(leaderboard, tournament.firstPlace, data.rating.firstPlace, true);
        addPointsToPlaces(leaderboard, tournament.secondPlace, data.rating.secondPlace);
        addPointsToPlaces(leaderboard, tournament.thirdPlace, data.rating.thirdPlace);

        for (const participant of tournament.participants) {
            const match = leaderboard.find((player) => player.name == participant);
            if (match == undefined) {
                console.error(`Couldn't find player '${participant}'`);
                continue;
            }
            match.pointsPerGame = match.points / match.participations;
            match.winrate = match.wins / match.participations;
        }
    }

    return leaderboard;
}

/**
 * @param {{name: string, points: number, wins: number}[]} leaderboard 
 * @param {string[]} placePlayers 
 * @param {number} rating 
 * @param {boolean} isWin
 */
function addPointsToPlaces(leaderboard, placePlayers, rating, isWin = false) {
    for (const firstPlacePlayer of placePlayers) {
        const match = leaderboard.find((player) => player.name == firstPlacePlayer);
        if (match == undefined) {
            console.error(`Couldn't find player '${firstPlacePlayer}'`);
            continue;
        }

        match.points += rating;
        match.wins += isWin ? 1 : 0;
    }
}

/**
 * @param {{name: string, pointsPerGame: number, points: number, wins: number, winrate: number, participations: number}[]} leaderboard 
 */
function getLeaderboardMarkdown(leaderboard) {
    const headers = [
        "Platz",
        "Name",
        "Winrate",
        "PPG",
        "Punkte",
        "Siege",
        "Teilnahmen",
    ];

    let markdown = "_PPG: Points per Game_\n";
    markdown += `\n${headers.join(" | ")}\n`;
    markdown += Array(headers.length).fill("--").join(" | ") + "\n";

    leaderboard.sort(function (a, b) {
        // High Winrate, high points per game, high points, high wins, low participations

        const winrateComparision = b.winrate - a.winrate;
        if (winrateComparision != 0) {
            return winrateComparision;
        }

        const pointsPerGameComparision = b.pointsPerGame - a.pointsPerGame;
        if (pointsPerGameComparision != 0) {
            return pointsPerGameComparision;
        }

        const pointsComparision = b.points - a.points;
        if (pointsComparision != 0) {
            return pointsComparision;
        }

        const winsComparision = b.wins - a.wins;
        if (winsComparision != 0) {
            return winsComparision;
        }

        const participationsComparision = a.participations - b.participations;
        if (participationsComparision != 0) {
            return participationsComparision;
        }

        return 0;
    });

    for (let i = 0; i < leaderboard.length; i++) {
        const entry = leaderboard[i];
        markdown += [
            `${i + 1}`,
            entry.name,
            entry.winrate,
            entry.pointsPerGame.toLocaleString("de-DE", { maximumFractionDigits: 2 }),
            entry.points,
            entry.wins,
            entry.participations,
        ].join(" | ") + "\n";
    }

    return markdown;
}

/**
 * @param {{date: string, flavor: string, firstPlace: string[], secondPlace: string[], thirdPlace: string[]}[]} tournaments 
 */
function getTournamentMarkdown(tournaments) {
    const headers = [
        "Datum",
        "1.",
        "2.",
        "3.",
        "Flavor"
    ];

    let markdown = `\n${headers.join(" | ")}\n`;
    markdown += Array(headers.length).fill("--").join(" | ") + "\n";

    tournaments.sort(function (a, b) {
        return Date.parse(a.date) - Date.parse(b.date);
    });

    for (const entry of tournaments) {
        const date = new Date(Date.parse(entry.date));
        markdown += [
            date.toLocaleDateString("de-DE", { year: "2-digit", month: "2-digit", day: "2-digit" }),
            entry.firstPlace.join(" & "),
            entry.secondPlace.join(" & "),
            entry.thirdPlace.join(" & "),
            entry.flavor
        ].join(" | ") + "\n";
    }

    return markdown;
}
