#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const filePath = path.join(__dirname, "..", "tournaments.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

let hasErrors = false;

for (const [index, tournament] of data.tournaments.entries()) {
    const participants = new Set(tournament.participants ?? []);
    const label = tournament.date ?? `index ${index}`;

    for (const place of ["firstPlace", "secondPlace", "thirdPlace"]) {
        for (const name of tournament[place] ?? []) {
            if (!participants.has(name)) {
                hasErrors = true;
                console.error(
                    `Tournament ${label}: "${name}" is listed in ${place} but missing from participants`,
                );
            }
        }
    }
}

if (hasErrors) {
    process.exitCode = 1;
} else {
    console.log("OK: every placed name is listed as a participant.");
}
