import { Ruleset } from "@/components/types/ruleset.types";

export const doubleTable: Ruleset = {
    name: "Double Table",
    slug: "double-table",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 8,
    sections: [
        {
            id: "vorbereitung",
            title: "Vorbereitung",
            content: [
                {
                    id: "aufbau",
                    title: "Aufbau",
                    paragraphs: [
                        { content: "Alle Becher (20 pro Team) müssen vor Spielbeginn in zwei 2D-Pyramidenformationen auf den beiden Tischen aufgestellt werden (mehr dazu unter [[ref:becherformation]])." },
                        { content: "Alle Becher beider Teams müssen vor Spielbeginn gleichmäßig mit Wasser oder Bier befüllt werden." },
                        { content: "Es muss vereinbart werden, mit welchem Flavor gespielt wird." }
                    ]
                },
                {
                    id: "becherformation",
                    title: "Becherformation",
                    paragraphs: [
                        { content: "Jedes Team hat 20 Becher auf den eigenen Tischseiten stehen." },
                        { content: "Alle Becher müssen in zwei 2D-Pyramidenformationen aufgestellt werden. Dabei müssen die Spitzen der Pyramiden zur anderen Tischseite zeigen und es müssen sich alle Ränder der Becher berühren." },
                        { content: "Die Pyramidenformationen sind entweder auf die eingezeichneten Stellen auf dem Bierpongtischen zu stellen oder die hinteren vier Becher müssen jeweils an die hintere Tischkante gestellt werden." }
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
                                { content: "Es dürfen auch Becher vom eigenen, anderen Tisch entfernt werden." }
                            ]
                        },
                        {
                            id: "art-3-werfen",
                            title: "Werfen",
                            paragraphs: [
                                { content: "Jedes Team hat in jeder Runde zwei Standardwürfe." },
                                { content: "Durch Spezialwürfe kann die Anzahl der Würfe pro Runde erhöht werden." },
                                { content: "Bei einem Teamspiel muss vor Spielbeginn für jedes Team vereinbart werden, wie geworfen wird. Entscheidet sich ein Team dafür, dass in jeder Runde jede Person einen Ball wirft, so muss diese Art zu werfen das ganze Spiel eingehalten werden." },
                                { content: "Beim Wurf muss der Ellenbogen hinter der Tischkante bleiben." },
                                { content: "Im Falle eines Einzelspiels ist es nicht erlaubt, dass beide Bälle gleichzeitig geworfen werden." },
                                { content: "Im Falle eines Teamspiels ist es erlaubt, dass beide Bälle gleichzeitig geworfen werden." },
                                { content: "Sollte ein Ball während des Wurfs aus der Hand rutschen oder fallen, so darf dieser Ball noch einmal geworfen werden, solange er noch nicht über die Mittellinie gerollt oder geflogen ist." },
                                { content: "Sollte ein Ball während des Wurfs aus der Hand rutschen und in einem eigenen Becher landen, so ist dieser Ball nicht über die Mittellinie gerollt, zählt trotzdem als Treffer und muss weggestellt werden. Der Ball darf nicht erneut geworfen werden." },
                                { content: "Es darf auf Becher beider Tische geworfen werden." }
                            ]
                        },
                        {
                            id: "art-5-becher-richten",
                            title: "Becher richten / zusammenstellen",
                            paragraphs: [
                                { content: "Eine spielende Person kann das andere Team auffordern, die Becher zu richten. Mit Richten ist nur das Rejustieren des Bechers an seine ursprüngliche Position gemeint. Das gegenerische Team muss dieser Aufforderung nachkommen und die Becher richten." },
                                { content: "Das gegnerische Team darf die Becher nicht ohne Erlaubnis des anderen Teams richten." },
                                { content: "Eine spielende Person kann das andere Team auffordern, die Becher zusammenzustellen. Die Formation darf sich das eigene Team aussuchen." },
                                { content: "Jedes Team darf seine Becher nur einmal pro Tisch und unabhängig voneinander im ganzen Spiel zusammenstellen." },
                                { content: "Es dürfen nur Becher von einem Tisch zusammen gestellt werden. Es ist nicht erlaubt, die Becher der beiden Tische zusammenzustellen." }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    combinations: []
};