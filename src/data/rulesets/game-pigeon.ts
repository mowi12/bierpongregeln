import { Ruleset } from "@/components/types/ruleset.types";

export const gamePigeon: Ruleset = {
    name: "Game Pigeon",
    slug: "game-pigeon",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 4,
    sections: [
        {
            id: "allgemeine-regeln",
            title: "Allgemeine Regeln",
            content: [
                {
                    id: "allgemeines",
                    title: "Allgemeines",
                    content: [
                        {
                            id: "art-2-entfernen-der-becher",
                            title: "Entfernen der Becher",
                            paragraphs: [
                                {
                                    content:
                                        "Wurde ein Becher getroffen, so muss dieser sofort weggestellt werden und ist nicht mehr im Spiel.",
                                },
                            ],
                        },
                        {
                            id: "art-3-werfen",
                            title: "Werfen",
                            paragraphs: [
                                { content: "Jedes Team hat in jeder Runde zwei Standardwürfe." },
                                {
                                    content:
                                        "Durch Spezialwürfe kann die Anzahl der Würfe pro Runde erhöht werden.",
                                },
                                {
                                    content:
                                        "Bei einem Teamspiel muss vor Spielbeginn für jedes Team vereinbart werden, wie geworfen wird. Entscheidet sich ein Team dafür, dass in jeder Runde jede Person einen Ball wirft, so muss diese Art zu werfen das ganze Spiel eingehalten werden.",
                                },
                                {
                                    content:
                                        "Beim Wurf muss der Ellenbogen hinter der Tischkante bleiben.",
                                },
                                {
                                    content:
                                        "Im Falle eines Einzelspiels ist es nicht erlaubt, dass beide Bälle gleichzeitig geworfen werden.",
                                },
                                {
                                    content:
                                        "Im Falle eines Teamspiels ist es nicht erlaubt, dass beide Bälle gleichzeitig geworfen werden.",
                                },
                                {
                                    content:
                                        "Sollte ein Ball während des Wurfs aus der Hand rutschen oder fallen, so darf dieser Ball noch einmal geworfen werden, solange er noch nicht über die Mittellinie gerollt oder geflogen ist.",
                                },
                                {
                                    content:
                                        "Sollte ein Ball während des Wurfs aus der Hand rutschen und in einem eigenen Becher landen, so ist dieser Ball nicht über die Mittellinie gerollt, zählt trotzdem als Treffer und muss weggestellt werden. Der Ball darf nicht erneut geworfen werden.",
                                },
                            ],
                        },
                        {
                            id: "art-5-becher-richten",
                            title: "Becher richten / zusammenstellen",
                            paragraphs: [
                                {
                                    content:
                                        "Eine spielende Person kann das andere Team auffordern, die Becher zu richten. Mit Richten ist nur das Rejustieren des Bechers an seine ursprüngliche Position gemeint. Das gegnerische Team muss dieser Aufforderung nachkommen und die Becher richten.",
                                },
                                {
                                    content:
                                        "Das gegnerische Team darf die Becher nicht ohne Erlaubnis des anderen Teams richten.",
                                },
                                {
                                    content:
                                        "Die Becher beider Teams werden bei 6 und 3 Bällen sofort zusammengestellt. Die neue Formation ist eine kleinere Pyramide, welche mit der Spitze zum Gegner zeigt und von Vorne (Richtung Gegner) platziert wird.",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "spielablauf",
            title: "Spielablauf",
            content: [
                {
                    id: "art-10-konter",
                    title: "Konter",
                    paragraphs: [
                        {
                            content:
                                "Beide Teams haben die Möglichkeit, einen Konter zu vollenden.",
                        },
                        {
                            content:
                                "Es kann im gesamten Spiel von beiden Teams zusammen nur einmal gekontert werden.",
                        },
                        {
                            content:
                                "Ist ein Konter erfolgreich, so wird jedem Team eine kleine 3-Becher Pyramide aufgebaut. Diese wird wie beim Zusammenstellen Vorne platziert.",
                        },
                        {
                            content:
                                "Nachdem die 3 Becher für den Konter aufgebaut wurden, gibt es keine weiteren Konter mehr und das Team hat gewonnen, welches zuerst alle 3 Becher trifft.",
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
                    id: "art-11-balls-back",
                    title: "Balls Back",
                    paragraphs: [
                        {
                            content:
                                "Wenn in einer Wurfrunde beide Würfe getroffen werden, darf das aktuelle Team erneut werfen.",
                        },
                    ],
                },
                {
                    id: "art-12-aufsetzer",
                    title: "Aufsetzer",
                    paragraphs: [{ content: "Ein Aufsetzer darf nicht weggeschlagen werden." }],
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
                    paragraphs: [],
                },
            ],
        },
    ],
    combinations: [
        { flavorSlug: "3d", flavorName: "3D", status: "compatible" },
        { flavorSlug: "sniper", flavorName: "Sniper", status: "compatible" },
        { flavorSlug: "double-table", flavorName: "Double Table", status: "compatible" },
        { flavorSlug: "moritz", flavorName: "Moritz", status: "incompatible" },
        { flavorSlug: "felix", flavorName: "Felix", status: "incompatible" },
        { flavorSlug: "marcel", flavorName: "Marcel", status: "incompatible" },
        { flavorSlug: "mehr-baelle", flavorName: "Mehr Bälle", status: "incompatible" },
    ],
};
