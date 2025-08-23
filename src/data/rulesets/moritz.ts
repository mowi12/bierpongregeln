import { Ruleset } from "@/components/types/ruleset.types";

export const moritz: Ruleset = {
    name: "Moritz",
    slug: "moritz",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 1,
    sections: [
        {
            id: "spezialregeln",
            title: "Spezialregeln",
            content: [
                {
                    id: "art-dead-cup",
                    title: "Dead Cup",
                    paragraphs: [
                        { content: "Wenn am Ende einer Runde ein getroffener Becher stehen bleibt, zählt dieser Becher als Dead Cup. Wenn das gegnerische Team in einer der nachfolgenden Runden diesen Becher trifft, hat das Team, das den Dead Cup getroffen hat, sofort gewonnen." },
                        { content: "Wenn eine Person des Teams mit dem Dead Cup bemerkt, dass sie einen Dead Cup haben, dürfen sie diesen Becher entfernen. Dies darf jedoch nicht innerhalb einer gegnerischen Wurfrunde geschehen." }
                    ]
                },
                {
                    id: "art-on-fire",
                    title: "On Fire",
                    paragraphs: [
                        { content: "Wenn ein Spieler zwei Bälle hintereinander trifft, darf er Heating Up rufen. Wenn derselbe Spieler einen weiteren dritten Becher hintereinander trifft und On Fire ruft, ist er On Fire. Er darf so lange werfen, bis er nicht mehr trifft." },
                        { content: "Heating Up und On Fire müssen nicht in der gleichen Wurfrunde gerufen werden." },
                        { content: "Wenn Heating Up oder On Fire nicht gerufen wurde, kann der Spieler beim nächsten Treffer in Folge Heating Up oder On Fire rufen." },
                        { content: "Die On Fire-Würfe werden sofort nach dem Ausruf ausgeführt." },
                        { content: "Aufsetzer und andere Spezialwürfe zählen nur als ein Treffer." }
                    ]
                },
                {
                    id: "art-island",
                    title: "Island",
                    paragraphs: [
                        { content: "Wenn ein Becher allein steht, also keine Nachbarn hat, kann ein Spieler Island auf diesen Becher rufen. Wird dieser getroffen, müssen der getroffene Becher und ein weiterer Becher entfernt werden. Wird anstelle des Island-Bechers ein anderer Becher getroffen, zählt der Treffer nicht." },
                        { content: "Jeder Spieler darf im gesamten Spiel einmal Island rufen." }
                    ]
                },
                {
                    id: "art-air-ball",
                    title: "Air Ball",
                    paragraphs: [
                        { content: "Wenn ein Air Ball hinter der Tischkante gefangen wird, darf der Fänger des Balls (solange er im gegnerischen Team ist) in der nächsten Wurfrunde einen Ball doppelt werfen." },
                        { content: "Ein Ball zählt als Air Ball, wenn er keinen Gegenstand oder ähnliches berührt und hinter der Tischplatte gefangen wird." },
                        { content: "Bälle, die seitlich neben den Tisch geworfen werden oder dort gefangen werden, zählen nicht als Air Ball." }
                    ]
                }
            ]
        },
        {
            id: "sonstiges",
            title: "Sonstiges",
            content: [
                {
                    id: "spezialwurfkombinationen",
                    title: "Spezialwurfkombinationen",
                    paragraphs: [
                        { content: "Bombe mit Aufsetzer &rarr; Bombenbecher + 2 weitere (Bombe) + 1 Becher je Aufsetzer" },
                        { content: "Island mit Aufsetzer &rarr; Islandbecher + 1 weiterer (Island) + 1 Becher je Aufsetzer" },
                        { content: "Bombe mit Island &rarr; Bomben-/ Islandbecher + 2 weitere (Bombe) + 1 weiterer (Island)" }
                    ]
                }
            ]
        }
    ],
    combinations: [
        { flavorSlug: "3d", flavorName: "3D", status: "compatible" },
        { flavorSlug: "mehr-baelle", flavorName: "Mehr Bälle", status: "compatible" },
        { flavorSlug: "sniper", flavorName: "Sniper", status: "compatible" },
        { flavorSlug: "double-table", flavorName: "Double Table", status: "compatible" },
        { flavorSlug: "felix", flavorName: "Felix", status: "incompatible" },
        { flavorSlug: "marcel", flavorName: "Marcel", status: "incompatible" },
        { flavorSlug: "game-pigeon", flavorName: "Game Pigeon", status: "incompatible" }
    ]
};