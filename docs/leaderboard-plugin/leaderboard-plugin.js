(function () {
    var leaderboardPlugin = function (hook, vm) {
        hook.beforeEach(
            /** @param {string} markdown */
            function (markdown) {
                if (!markdown.includes("{{leaderboard}}")) {
                    return markdown;
                }

                /**
                 * @type {{rating: {firstPlace: number, secondPlace: number, thirdPlace: number}, players: {name: string, singleParticipations: number, teamParticipations: number}[], turnaments: {date: string, flavor: string, type: string, firstPlace: string[], secondPlace: string[], thirdPlace: string[]}[]}}
                 */
                const data = turnamentData;

                // Calculate points and metrics
                const team_leaderboard = fillLeaderboardData(data, TurnamentType.Team);
                const single_leaderboard = fillLeaderboardData(data, TurnamentType.Single);

                let leaderboard = "";

                // Rating
                leaderboard += "## Bewertung (Einzel- und Teamturniere)\n\n";
                leaderboard += `1. Platz: ${formatRating(data.rating.firstPlace)}\n`;
                leaderboard += `2. Platz: ${formatRating(data.rating.secondPlace)}\n`;
                leaderboard += `3. Platz: ${formatRating(data.rating.thirdPlace)}\n`;

                leaderboard += "\n## Bestenliste (Team)\n";
                leaderboard += getLeaderboardMarkdown(team_leaderboard);

                leaderboard += "\n## Bestenliste (Einzel)\n";
                leaderboard += getLeaderboardMarkdown(single_leaderboard);

                leaderboard += "\n## Turniere und Platzierungen (Team und Einzel)\n";
                leaderboard += getTurnamentMarkdown(data.turnaments);

                return markdown.replace("{{leaderboard}}", leaderboard);
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

/**
 * @param {number} rating 
 */
function formatRating(rating) {
    return `${rating} Punkt${rating > 1 ? "e" : ""}`;
}

/**
 * @param {{rating: {firstPlace: number, secondPlace: number, thirdPlace: number}, players: {name: string, singleParticipations: number, teamParticipations: number}[], turnaments: {type: string, firstPlace: string[], secondPlace: string[], thirdPlace: string[]}[]}} data 
 * @param {TurnamentType} type
 */
function fillLeaderboardData(data, type) {
    /**
     * @type {{name: string, ppg: number, points: number, wins: number, participations: number}[]}
     */
    let leaderboard = [];

    // Fill leaderboard with default values
    for (const player of data.players) {
        leaderboard.push({
            name: player.name,
            ppg: 0,
            points: 0,
            wins: 0,
            participations: type === TurnamentType.Team ? player.teamParticipations : player.singleParticipations,
        });
    }

    // Add points to players
    for (const turnament of data.turnaments) {
        if (turnament.type !== type) {
            continue;
        }

        addPointsToPlaces(leaderboard, turnament.firstPlace, data.rating.firstPlace, true);
        addPointsToPlaces(leaderboard, turnament.secondPlace, data.rating.secondPlace);
        addPointsToPlaces(leaderboard, turnament.thirdPlace, data.rating.thirdPlace);
    }

    return leaderboard;
}

/**
 * @param {{name: string, ppg: number, points: number, wins: number, participations: number}[]} leaderboard 
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
        match.ppg = match.points / match.participations;
    }
}

/**
 * @param {{name: string, ppg: number, points: number, wins: number, participations: number}[]} leaderboard 
 */
function getLeaderboardMarkdown(leaderboard) {
    const headers = [
        "Platz",
        "Name",
        "PPG",
        "Punkte",
        "Siege",
        "Teilnahmen"
    ];

    let markdown = `\n${headers.join(" | ")}\n`;
    markdown += Array(headers.length).fill("--").join(" | ") + "\n";

    leaderboard = leaderboard.filter((entry) => entry.participations > 0);
    leaderboard.sort(function (a, b) {
        // High PPG, high wins, high points, low participations

        const ppgComparision = b.ppg - a.ppg;
        if (ppgComparision != 0) {
            return ppgComparision;
        }

        const winsComparision = b.wins - a.wins;
        if (winsComparision != 0) {
            return winsComparision;
        }

        const pointsComparision = b.points - a.points;
        if (pointsComparision != 0) {
            return pointsComparision;
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
            entry.ppg.toLocaleString("de-DE", { maximumFractionDigits: 2 }),
            entry.points,
            entry.wins,
            entry.participations
        ].join(" | ") + "\n";
    }

    return markdown;
}

/**
 * @param {{date: string, flavor: string, firstPlace: string[], secondPlace: string[], thirdPlace: string[]}[]} turnaments 
 */
function getTurnamentMarkdown(turnaments) {
    const headers = [
        "Datum",
        "1.",
        "2.",
        "3.",
        "Flavor"
    ];

    let markdown = `\n${headers.join(" | ")}\n`;
    markdown += Array(headers.length).fill("--").join(" | ") + "\n";

    turnaments.sort(function (a, b) {
        return Date.parse(a.date) - Date.parse(b.date);
    });

    for (const entry of turnaments) {
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
