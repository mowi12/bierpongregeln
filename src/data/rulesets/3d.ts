import { Ruleset } from "@/components/types/ruleset.types";

export const dreiD: Ruleset = {
    name: "3D",
    slug: "3d",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 5,
    sections: [
        {
            id: "vorbereitung",
            title: "Vorbereitung",
            content: [
                {
                    id: "aufbau",
                    title: "Aufbau",
                    paragraphs: [
                        { content: "Alle Becher (10 pro Team) müssen vor Spielbeginn in einer 3D-Pyramidenformation aufgestellt werden (mehr dazu unter [[ref:becherformation]])." },
                        { content: "Alle Becher beider Teams müssen vor Spielbeginn gleichmäßig mit Wasser oder Bier befüllt werden." },
                        { content: "Es muss vereinbart werden, mit welchem Flavor gespielt wird." }
                    ]
                },
                {
                    id: "becherformation",
                    title: "Becherformation",
                    paragraphs: [
                        { content: "Alle Becher müssen in einer 3D-Pyramidenformation aufgestellt werden. Dabei muss die Spitze der Pyramide zur anderen Tischseite zeigen und es müssen sich alle Ränder der Becher berühren." },
                        { content: "Die erste Ebene der Pyramide besteht aus sechs Bechern. Die zweite Ebene besteht aus drei Bechern und wird in die Mitte der sechs Becher gestellt. Der letzte 10. Becher wird in die Mitte der drei Becher der zweiten Ebene gestellt." }
                    ]
                }
            ]
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
                            id: "art-2-entfernen-der-becher",
                            title: "Entfernen der Becher",
                            paragraphs: [
                                { content: "Alle getroffenen Becher, die von den ersten zwei Bällen jeder Runde getroffen wurden, werden erst entfernt, wenn beide Würfe vorbei sind." },
                                { content: "Bei jedem Spezialwurf wird der Spezialbecher immer entfernt." },
                                { content: "Bei Spezialwürfen, bei denen mehr als nur der getroffene Becher entfernt wird, werden zuerst angrenzende Becher entfernt. Erst danach dürfen Becher entfernt werden, die nicht direkt an den Spezialbecher angrenzen." },
                                { content: "Die zusätzlich zu entfernenden Becher dürfen vom Team ausgewählt werden, dem sie gehören." },
                                { content: "Wird ein Becher der obersten Ebene getroffen, so wird genau dieser Becher entfernt." },
                                { content: "Wird ein Becher einer Ebene getroffen, die nicht die oberste ist, so wird ein Becher der obersten Ebene entfernt. Das Team, dem die Becher gehören, darf sich aussuchen, welcher Becher entfernt wird." }
                            ]
                        }
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
                        { content: "1. Treffer im Spiel = oberster Becher &rarr; Oberster Becher + 2 weitere" },
                        { content: "1. Treffer im Spiel = oberster Becher + jegliche Kombination &rarr; Oberster Becher + 2 weitere + andere Kombination" }
                    ]
                }
            ]
        }
    ],
    combinations: []
};