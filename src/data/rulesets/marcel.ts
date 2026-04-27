import { Ruleset } from "@/components/types/ruleset.types";

export const marcel: Ruleset = {
    name: "Marcel",
    slug: "marcel",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 3,
    sections: [
        {
            id: "turnierablauf",
            title: "Turnierablauf",
            content: [
                {
                    id: "turnierablauf-allgemein",
                    title: "Allgemeines",
                    paragraphs: [
                        {
                            content:
                                "Sollte ein Turnier gespielt werden, in dem Halbfinale und Finale existieren, so wird in diesen Runden das Trinkspiel Pferderennen gespielt. Das heißt, jede Person, die am Turnier teilgenommen hat, muss sich eine Person der aktuellen Runde aussuchen und Anzahl an Schlücken auf diese Person setzen. Steht die Person fest, welche die aktuelle Runde gewonnen hat, so darf jeder der richtig gesetzt hat seine gesetzte Anzahl an Schlücken an andere verteilen. Die Personen, welche auf die falsche Person gesetzt hat muss die gesetzten Schlücke selbst trinken.",
                        },
                    ],
                },
            ],
        },
        {
            id: "allgemeine-regeln",
            title: "Allgemeine Regeln",
            content: [
                {
                    id: "allgemeines",
                    title: "Allgemeines",
                    content: [
                        {
                            id: "art-1-trinken",
                            title: "Trinken",
                            paragraphs: [
                                {
                                    content:
                                        "Wenn ein Becher getroffen wird, muss die Person, die den Becher getroffen hat, die vor dem Spiel vereinbarte Menge, trinken.",
                                },
                                {
                                    content:
                                        "Wenn das gegnerische Team trotzdem trinkt, obwohl es nicht trinken muss, oder sich selbst durch andere Aktivitäten ablenkt, darf geworfen werden.",
                                },
                                {
                                    content:
                                        "Wenn ein Teammitglied vergisst vor der nächsten Runde zu trinken, so zählt der Becher nicht als getroffen und wird wieder an seinen alten Platz gestellt. Sollte durch das Wegstellen des Bechers die Anordnung aller Becher verändert worden sein, so muss die alte Aufstellung wieder hergestellt werden.",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "standardspiel",
            title: "Standardspiel",
            content: [
                {
                    id: "art-12-aufsetzer",
                    title: "Aufsetzer",
                    paragraphs: [
                        {
                            content:
                                "Ein Ball, welcher mindestens einmal auf dem Tisch aufgesetzt hat und in einem Becher landet, zählt als Aufsetzer und somit als zwei Treffer.",
                        },
                        {
                            content:
                                "Sobald ein Ball mindestens einmal auf dem Tisch oder einem Gegenstand auf dem Tisch aufgesetzt hat, darf er abgewehrt werden.",
                        },
                        {
                            content:
                                "Ein Ball, welcher mindestens einmal auf einem Becher aufgesetzt hat oder rollt und in einem Becher landet, zählt nicht als Aufsetzer, bekommt dafür aber einen weiteren Wurf.",
                        },
                    ],
                },
                {
                    id: "art-16-bombe",
                    title: "Bombe",
                    paragraphs: [
                        {
                            content:
                                "Wenn in einer Wurfrunde beide Würfe eines Teams den gleichen Becher treffen, müssen dieser Becher und zwei weitere Becher entfernt werden.",
                        },
                        { content: "Eine Bombe führt sofort zur Ausführung der Balls-Back Regel." },
                        {
                            content:
                                "Mit einer Bombe darf das Spiel nicht beendet werden. Das heißt, sobald in einer Wurfrunde die Möglichkeit besteht mit einer Bombe (eine Kombination von Bombe mit Aufsetzer zählt hier nicht) das Spiel zu beenden, so bleibt ein Becher bei erfolgreichem Treffer stehen. Das gegnerische Team darf sich aussuchen, welche Becher weggestellt werden.",
                        },
                    ],
                },
            ],
        },
        {
            id: "spezialregeln",
            title: "Spezialregeln",
            content: [
                {
                    id: "art-dead-cup",
                    title: "Dead Cup",
                    paragraphs: [
                        {
                            content:
                                "Wenn am Ende einer Runde ein getroffener Becher stehen bleibt, zählt dieser Becher als Dead Cup. Wenn das gegnerische Team in einer der nachfolgenden Runden diesen Becher trifft, hat das Team, das den Dead Cup getroffen hat, sofort gewonnen.",
                        },
                        {
                            content:
                                "Wenn eine Person des Teams mit dem Dead Cup bemerkt, dass sie einen Dead Cup haben, dürfen sie diesen Becher entfernen. Dies darf jedoch nicht innerhalb einer gegnerischen Wurfrunde geschehen.",
                        },
                    ],
                },
                {
                    id: "art-island",
                    title: "Island",
                    paragraphs: [
                        {
                            content:
                                "Wenn ein Becher allein steht, also keine Nachbarn hat, kann ein Spieler Island auf diesen Becher rufen. Wird dieser getroffen, müssen der getroffene Becher und ein weiterer Becher entfernt werden. Wird anstelle des Island-Bechers ein anderer Becher getroffen, zählt der Treffer nicht.",
                        },
                        { content: "Jeder Spieler darf im gesamten Spiel einmal Island rufen." },
                    ],
                },
            ],
        },
        {
            id: "sonstiges",
            title: "Sonstiges",
            content: [
                {
                    id: "spezialwurfkombinationen",
                    title: "Spezialwurfkombinationen",
                    paragraphs: [
                        {
                            content:
                                "Bombe mit Aufsetzer &rarr; Bombenbecher + 2 weitere (Bombe) + 1 Becher je Aufsetzer",
                        },
                        {
                            content:
                                "Island mit Aufsetzer &rarr; Islandbecher + 1 weiterer (Island) + 1 Becher je Aufsetzer",
                        },
                        {
                            content:
                                "Bombe mit Island &rarr; Bomben-/ Islandbecher + 2 weitere (Bombe) + 1 weiterer (Island)",
                        },
                    ],
                },
            ],
        },
    ],
    combinations: [
        { flavorSlug: "3d", flavorName: "3D", status: "compatible" },
        { flavorSlug: "mehr-baelle", flavorName: "Mehr Bälle", status: "compatible" },
        { flavorSlug: "sniper", flavorName: "Sniper", status: "compatible" },
        { flavorSlug: "double-table", flavorName: "Double Table", status: "compatible" },
        { flavorSlug: "moritz", flavorName: "Moritz", status: "incompatible" },
        { flavorSlug: "felix", flavorName: "Felix", status: "incompatible" },
        { flavorSlug: "game-pigeon", flavorName: "Game Pigeon", status: "incompatible" },
    ],
};
