import { Ruleset } from "@/components/types/ruleset.types";

export const sniper: Ruleset = {
    name: "Sniper",
    slug: "sniper",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 7,
    sections: [
        {
            id: "spezialregeln",
            title: "Spezialregeln",
            content: [
                {
                    id: "art-sniper",
                    title: "Sniper",
                    paragraphs: [
                        {
                            content:
                                "Wenn ein Ball auf einem Becher aufspringt, so darf dieser Ball gefangen werden. Wird der Ball gefangen, so darf die Person, die den Ball gefangen hat, die Person abwerfen, die den Ball zuvor geworfen hat. Trifft der Ball, so muss das Team, welches den Ball zu Beginn geworfen hat, einen Becher ihrer Wahl entfernen.",
                        },
                        {
                            content:
                                "Es muss nur ein Ball entfernt werden, solange noch mehr als 2 Becher vorhanden sind. Sobald nur noch 2 Becher vorhanden sind, kann kein weiterer Becher durch Sniper entfernt werden.",
                        },
                        {
                            content:
                                "Die Person, die zu Beginn den Ball geworfen hat und abgeworfen wird, kann versuchen den Ball zu fangen. Fängt sie Person den Ball erfolgreich, so muss ebenfalls kein Becher entfernt werden.",
                        },
                    ],
                },
            ],
        },
    ],
    combinations: [],
};
