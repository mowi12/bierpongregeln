#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const filePath = path.join(__dirname, "..", "tournaments.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const PLACES = ["firstPlace", "secondPlace", "thirdPlace"];
/** Allowed number of names per podium place, by tournament type. */
const PLACE_SIZE = { single: { min: 1, max: 1 }, team: { min: 1, max: 2 } };

let hasErrors = false;

function fail(label, message) {
    hasErrors = true;
    console.error(`Tournament ${label}: ${message}`);
}

/** `YYYY-MM-DD` that is also a real calendar date. */
function isValidDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// One day of slack, so a result entered right after midnight in Germany (still the previous
// day in UTC) is not reported as lying in the future.
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

let previousDate = null;

for (const [index, tournament] of data.tournaments.entries()) {
    const label = `#${index} (${tournament.date ?? "no date"})`;
    const participants = new Set(tournament.participants ?? []);

    // Every placed name is a participant.
    for (const place of PLACES) {
        for (const name of tournament[place] ?? []) {
            if (!participants.has(name)) {
                fail(label, `"${name}" is listed in ${place} but missing from participants`);
            }
        }
    }

    // gamesToWin is a whole number of at least 1.
    const { gamesToWin } = tournament;
    if (!Number.isInteger(gamesToWin) || gamesToWin < 1) {
        fail(label, `gamesToWin must be a whole number of at least 1, got ${gamesToWin}`);
    }

    // Nobody holds two podium places in the same tournament.
    const placeOf = new Map();
    for (const place of PLACES) {
        for (const name of tournament[place] ?? []) {
            if (placeOf.has(name)) {
                fail(label, `"${name}" is listed in both ${placeOf.get(name)} and ${place}`);
            } else {
                placeOf.set(name, place);
            }
        }
    }

    // Podium places have the right number of names for the tournament type.
    const size = PLACE_SIZE[tournament.type];
    if (!size) {
        fail(label, `unknown type "${tournament.type}"`);
    } else {
        for (const place of PLACES) {
            const count = (tournament[place] ?? []).length;
            if (count < size.min || count > size.max) {
                const expected = size.min === size.max ? `${size.min}` : `${size.min}–${size.max}`;
                fail(
                    label,
                    `${place} has ${count} names, expected ${expected} for a ${tournament.type} tournament`,
                );
            }
        }
    }

    // Dates are valid, not in the future, and the list is in chronological order.
    if (!isValidDate(tournament.date)) {
        fail(label, `date "${tournament.date}" is not a valid YYYY-MM-DD date`);
        continue;
    }
    if (tournament.date > tomorrow) {
        fail(label, `date ${tournament.date} lies in the future`);
    }
    if (previousDate && tournament.date < previousDate) {
        fail(
            label,
            `date ${tournament.date} is earlier than the tournament before it (${previousDate}); keep tournaments sorted by date`,
        );
    }
    previousDate = tournament.date;
}

if (hasErrors) {
    process.exitCode = 1;
} else {
    console.log("OK: tournaments.json passed all consistency checks.");
}
