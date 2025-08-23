import { Ruleset } from "@/components/types/ruleset.types";

export const regelwerk: Ruleset = {
    name: "Regelwerk",
    slug: "regelwerk",
    baseRulesetSlug: null, // This is the base ruleset
    sidebarPosition: 1,
    sections: [
        {
            id: "vorbereitung",
            title: "Vorbereitung",
            content: [
                {
                    id: "aufbau",
                    title: "Aufbau",
                    paragraphs: [
                        { content: "Alle Becher (10 pro Team) müssen vor Spielbeginn in einer 2D-Pyramidenformation aufgestellt werden (mehr dazu unter [[ref:becherformation]])." },
                        { content: "Alle Becher beider Teams müssen vor Spielbeginn gleichmäßig mit Wasser oder Bier befüllt werden." },
                        { content: "Es muss vereinbart werden, mit welchem Flavor gespielt wird." }
                    ]
                },
                {
                    id: "becherformation",
                    title: "Becherformation",
                    paragraphs: [
                        { content: "Jedes Team hat 10 Becher auf der eigenen Tischseite stehen." },
                        { content: "Alle Becher müssen in einer 2D-Pyramidenformation aufgestellt werden. Dabei muss die Spitze der Pyramide zur anderen Tischseite zeigen und es müssen sich alle Ränder der Becher berühren." },
                        { content: "Die Pyramidenformation ist entweder auf die eingezeichnete Stelle auf dem Bierpongtisch zu stellen oder die hinteren vier Becher müssen an die hintere Tischkante gestellt werden." }
                    ]
                }
            ]
        },
        {
            id: "turnierablauf",
            title: "Turnierablauf",
            content: [
                {
                    id: "turnierablauf-allgemein",
                    title: "Allgemeines",
                    paragraphs: [
                        { content: "Es gibt keine allgemeinen Turnierabläufe. Wie genau sich ein Turnier abspielt, hängt ganz davon ab, wie viele Personen da sind und ob ein Einzel- oder ein Teamturnier gespielt wird. Weitere Einzelheiten werden vor Ort geklärt." }
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
                            id: "art-1-trinken",
                            title: "Trinken",
                            paragraphs: [
                                { content: "Wenn ein Becher getroffen wird, müssen alle Teammitglieder die vor Spielbeginn festgelegte Menge trinken." },
                                { content: "Es darf erst getrunken werden, wenn alle Würfe des gegnerischen Teams abgeschlossen sind." },
                                { content: "Wenn das gegnerische Team trotzdem trinkt, obwohl es nicht trinken muss, oder sich selbst durch andere Aktivitäten ablenkt, darf geworfen werden." },
                                { content: "Wenn ein Teammitglied vergisst, vor der nächsten Runde zu trinken, darf das gegnerische Team eine angemessene Strafe für das gesamte Team festlegen. Eine Shotrunde wird empfohlen." }
                            ]
                        },
                        {
                            id: "art-2-entfernen-der-becher",
                            title: "Entfernen der Becher",
                            paragraphs: [
                                { content: "Alle getroffenen Becher, die von den ersten zwei Bällen jeder Runde getroffen wurden, werden erst entfernt, wenn beide Würfe vorbei sind." },
                                { content: "Bei jedem Spezialwurf wird der Spezialbecher immer entfernt." },
                                { content: "Bei Spezialwürfen, bei denen mehr als nur der getroffene Becher entfernt wird, werden zuerst angrenzende Becher entfernt. Erst danach dürfen Becher entfernt werden, die nicht direkt an den Spezialbecher angrenzen." },
                                { content: "Die zusätzlich zu entfernenden Becher dürfen vom Team ausgewählt werden, dem sie gehören." }
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
                                { content: "Sollte ein Ball während des Wurfs aus der Hand rutschen und in einem eigenen Becher landen, so ist dieser Ball nicht über die Mittellinie gerollt, zählt trotzdem als Treffer und muss weggestellt werden. Der Ball darf nicht erneut geworfen werden." }
                            ]
                        },
                        {
                            id: "art-4-millane-technik",
                            title: "Millane Technik",
                            paragraphs: [
                                { content: "Bei der Millane-Technik, wenn eine Person seitlich vom Tisch steht, muss der Ellenbogen immer noch hinter der verlängerten Tischkante bleiben." },
                                { content: "Die Millane-Technik darf nur angewendet werden, wenn dadurch keine andere Person behindert wird." }
                            ]
                        },
                        {
                            id: "art-5-becher-richten",
                            title: "Becher richten / zusammenstellen",
                            paragraphs: [
                                { content: "Eine spielende Person kann das andere Team auffordern, die Becher zu richten. Mit Richten ist nur das Rejustieren des Bechers an seine ursprüngliche Position gemeint. Das gegnerische Team muss dieser Aufforderung nachkommen und die Becher richten." },
                                { content: "Das gegnerische Team darf die Becher nicht ohne Erlaubnis des anderen Teams richten." },
                                { content: "Eine spielende Person kann das andere Team auffordern, die Becher zusammenzustellen. Die Formation darf sich das eigene Team aussuchen." },
                                { content: "Jedes Team darf seine Becher nur einmal im ganzen Spiel zusammenstellen." }
                            ]
                        },
                        {
                            id: "art-6-ball-entfernen",
                            title: "Ball entfernen",
                            paragraphs: [
                                { content: "Eine spielende Person kann das andere Team auffordern, den Ball aus einem Becher zu entfernen, wenn er darin ist. Das gegnerische Team darf dies auch ohne Aufforderung tun." }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "spielablauf",
            title: "Spielablauf",
            content: [
                {
                    id: "art-7-auswerfen",
                    title: "Auswerfen",
                    paragraphs: [
                        { content: "Um die Spielreihenfolge und -seite festzulegen, erhält jeweils eine Person pro Seite einen Ball. Beide Personen müssen nun gleichzeitig versuchen, einen Becher des gegnerischen Teams zu treffen." },
                        { content: "Beim Werfen müssen sich beide Personen in die Augen schauen." },
                        { content: "Das Team, das zuerst trifft, darf entscheiden, welches Team beginnt. Das Team, das nicht trifft, darf entscheiden auf welcher Tischseite sie spielt." },
                        { content: "Wenn beide Werfende treffen, muss der Wurf von denselben Werfenden wiederholt werden." }
                    ]
                },
                {
                    id: "art-8-spielablauf-ablauf",
                    title: "Spielablauf",
                    paragraphs: [
                        { content: "Die Gewinner des [[ref:art-7-auswerfen]] fangen nun mit den zwei regulären Würfen an." },
                        { content: "Nachdem alle Würfe fertig sind, ist das andere Team an der Reihe. Dies wiederholt sich so lange, bis nur noch ein Team Becher auf ihrer Seite stehen hat." }
                    ]
                },
                {
                    id: "art-9-spielende",
                    title: "Spielende",
                    paragraphs: [
                        { content: "Das Spiel endet, sobald ein Team keine Becher mehr hat und der Punkt [[ref:art-10-konter]] abgehandelt wurde." },
                        { content: "Wenn das Spiel mit einem Timer gespielt wird, ist es ebenfalls beendet, sobald der Timer abgelaufen ist. Wenn das Spiel zu diesem Zeitpunkt unentschieden steht, gewinnt das Team, das als Nächstes einen gegnerischen Becher trifft. Es gibt keinen Konter." },
                        { content: "Das Team, das weniger Becher auf der eigenen Seite stehen hat, hat gewonnen." }
                    ]
                },
                {
                    id: "art-10-konter",
                    title: "Konter",
                    paragraphs: [
                        { content: "Nur das Team, welches das Spiel nicht angefangen hat, hat die Möglichkeit einen Konter zu vollenden." },
                        { content: "Es gibt keine Begrenzung, wie oft gekontert werden kann." },
                        { content: "Ein Konterversuch ist erfolgreich, wenn das zweite Team das Spiel in dieser letzten Runde beenden kann." },
                        { content: "Nach einem erfolgreichen Konter bleiben alle Becher der letzten beiden Runden stehen und werden nicht weggestellt. Das Team, welches das Spiel fast gewonnen hätte, ist nun wieder an der Reihe." }
                    ]
                }
            ]
        },
        {
            id: "standardspiel",
            title: "Standardspiel",
            content: [
                {
                    id: "art-11-balls-back",
                    title: "Balls Back",
                    paragraphs: [
                        { content: "Wenn in einer Wurfrunde beide Würfe getroffen werden, darf das aktuelle Team erneut werfen." },
                        { content: "Bevor erneut geworfen wird, müssen die beiden getroffenen Becher entfernt werden." }
                    ]
                },
                {
                    id: "art-12-aufsetzer",
                    title: "Aufsetzer",
                    paragraphs: [
                        { content: "Ein Ball, welcher mindestens einmal auf dem Tisch aufgesetzt hat und in einem Becher landet, zählt als Aufsetzer und somit als zwei Treffer." },
                        { content: "Sobald ein Ball mindestens einmal auf dem Tisch oder einem Gegenstand auf dem Tisch aufgesetzt hat, darf er abgewehrt werden." }
                    ]
                },
                {
                    id: "art-13-becher-umschmeissen",
                    title: "Becher umschmeißen",
                    paragraphs: [
                        { content: "Wenn ein Team während des Spiels einen oder mehrere eigene Becher umwirft, muss ein eigener Becher entfernt werden." },
                        { content: "Der letzte Becher darf nicht durch Umschmeißen entfernt werden. Hier wird an die Fairness der Mitspieler appelliert." }
                    ]
                },
                {
                    id: "art-14-blasen-fingern",
                    title: "Blasen/Fingern",
                    paragraphs: [
                        { content: "Es ist nicht erlaubt, einen Ball, der noch nicht komplett im Becher ist, mit Blasen oder Fingern zu retten." }
                    ]
                },
                {
                    id: "art-15-trickshot",
                    title: "Trickshot",
                    paragraphs: [
                        { content: "Wenn ein Ball nach einem Wurf zurück auf die eigene Tischseite rollt, also über die Mitte des Tisches, darf das aktuelle Werferteam den Ball holen. Der Spieler, der den Ball geholt hat, darf einen Trickshot machen. Dieser muss nach den regulären Würfen geworfen werden. Außerdem werden zuerst von regulären Bällen getroffene Becher entfernt." },
                        { content: "Ein Ball gilt nur als zurückgerollt, wenn er auf der eigenen Tischhälfte liegt. Wenn er wieder in die gegnerische Hälfte zurückrollt, darf der Ball nicht mehr geholt werden." },
                        { content: "Becher, die von einem Trickshot getroffen wurden, müssen sofort entfernt werden." },
                        { content: "Wenn ein Trickshot-Ball auf die eigene Tischhälfte zurückrollt, kann dieser ebenfalls geholt werden, und ein weiterer Trickshot kann gemacht werden." },
                        { content: "Ein Trickshot zählt nicht als Air Ball, wenn er hinter der Tischkante gefangen wird." }
                    ]
                },
                {
                    id: "art-16-bombe",
                    title: "Bombe",
                    paragraphs: [
                        { content: "Wenn in einer Wurfrunde beide Würfe eines Teams den gleichen Becher treffen, müssen dieser Becher und zwei weitere Becher entfernt werden." },
                        { content: "Eine Bombe führt sofort zur Ausführung der Balls-Back Regel." }
                    ]
                }
            ]
        },
        {
            id: "spezialregeln",
            title: "Spezialregeln",
            content: []
        },
        {
            id: "sonstiges",
            title: "Sonstiges",
            content: [
                {
                    id: "spezialwurfkombinationen",
                    title: "Spezialwurfkombinationen",
                    paragraphs: [
                        { content: "Bombe mit Aufsetzer &rarr; Bombenbecher + 2 weitere (Bombe) + 1 Becher je Aufsetzer" }
                    ]
                }
            ]
        }
    ],
    combinations: []
};