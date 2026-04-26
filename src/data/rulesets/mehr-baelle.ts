import { Ruleset } from "@/components/types/ruleset.types";

export const mehrBaelle: Ruleset = {
    name: "Mehr Bälle",
    slug: "mehr-baelle",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 6,
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
                            id: "art-3-werfen",
                            title: "Werfen",
                            paragraphs: [
                                {
                                    content:
                                        "Jedes Team hat in jeder Runde x Standardwürfe. Hierbei steht x für die Anzahl an Bällen, mit denen gespielt wird.",
                                },
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
                                        "Im Falle eines Teamspiels ist es erlaubt, dass alle Bälle gleichzeitig geworfen werden.",
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
                    ],
                },
            ],
        },
        {
            id: "spielablauf",
            title: "Spielablauf",
            content: [
                {
                    id: "art-8-spielablauf-ablauf",
                    title: "Spielablauf",
                    paragraphs: [
                        {
                            content:
                                "Die Gewinner des [[ref:art-7-auswerfen]] fangen nun mit den regulären x Würfen an.",
                        },
                        {
                            content:
                                "Nachdem alle Würfe fertig sind, ist das andere Team an der Reihe. Dies wiederholt sich so lange, bis nur noch ein Team Becher auf ihrer Seite stehen hat.",
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
                                "Wenn in einer Wurfrunde alle Würfe getroffen werden, darf das aktuelle Team erneut werfen.",
                        },
                        {
                            content:
                                "Bevor erneut geworfen wird, müssen alle getroffenen Becher entfernt werden.",
                        },
                    ],
                },
                {
                    id: "art-16-bombe",
                    title: "Bombe",
                    paragraphs: [
                        {
                            content:
                                "Wenn in einer Wurfrunde alle Würfe eines Teams den gleichen Becher treffen, müssen dieser Becher und zwei weitere Becher entfernt werden.",
                        },
                        { content: "Eine Bombe führt sofort zur Ausführung der Balls-Back Regel." },
                    ],
                },
            ],
        },
    ],
    combinations: [
        { flavorSlug: "moritz", flavorName: "Moritz", status: "compatible" },
        { flavorSlug: "marcel", flavorName: "Marcel", status: "compatible" },
        { flavorSlug: "3d", flavorName: "3D", status: "compatible" },
        { flavorSlug: "sniper", flavorName: "Sniper", status: "compatible" },
        { flavorSlug: "double-table", flavorName: "Double Table", status: "compatible" },
        {
            flavorSlug: "felix",
            flavorName: "Felix",
            status: "restricted",
            notes: [{ content: "Art 11: Spielweise nach Flavor Felix" }],
        },
        { flavorSlug: "game-pigeon", flavorName: "Game Pigeon", status: "incompatible" },
    ],
};
