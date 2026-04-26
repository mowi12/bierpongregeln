import { Ruleset } from "@/components/types/ruleset.types";

export const felix: Ruleset = {
    name: "Felix",
    slug: "felix",
    baseRulesetSlug: "regelwerk",
    sidebarPosition: 2,
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
                            id: "art-1-trinken",
                            title: "Trinken",
                            paragraphs: [
                                {
                                    content:
                                        "Wenn ein Becher getroffen wird, müssen alle Teammitglieder die vor Spielbeginn festgelegte Menge trinken.",
                                },
                                {
                                    content:
                                        "Wenn das gegnerische Team trotzdem trinkt, obwohl es nicht trinken muss, oder sich selbst durch andere Aktivitäten ablenkt, darf geworfen werden.",
                                },
                                {
                                    content:
                                        "Wenn ein Teammitglied vergisst, vor der nächsten Runde zu trinken, darf das gegnerische Team eine angemessene Strafe für das gesamte Team festlegen. Eine Shotrunde wird empfohlen.",
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
                                        "Im Falle eines Einzelspiels ist es erlaubt, dass beide Bälle gleichzeitig geworfen werden.",
                                },
                                {
                                    content:
                                        "Im Falle eines Teamspiels ist es erlaubt, dass beide Bälle gleichzeitig geworfen werden.",
                                },
                                {
                                    content:
                                        "Sollte ein Ball während des Wurfs aus der Hand rutschen oder fallen, zählt dieser als geworfen und kann nicht erneut geworfen werden.",
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
                    id: "art-7-auswerfen",
                    title: "Auswerfen",
                    paragraphs: [
                        {
                            content:
                                "Um die Spielreihenfolge und -seite festzulegen, erhält jeweils eine Person pro Seite einen Ball. Beide Personen müssen nun gleichzeitig versuchen, einen Becher des gegnerischen Teams zu treffen.",
                        },
                        { content: "Beim Werfen müssen sich beide Personen in die Augen schauen." },
                        {
                            content:
                                "Das Team, das zuerst trifft, darf entscheiden, welches Team beginnt. Das Team, das nicht trifft, darf entscheiden auf welcher Tischseite sie spielt.",
                        },
                        {
                            content:
                                "Wenn beide Werfende treffen, muss der Wurf von denselben Werfenden wiederholt werden.",
                        },
                        {
                            content:
                                "Nach fünf Wiederholungen darf das Auswerfen durch Schere-Stein-Papier ersetzt werden, um eine längere Spielverzögerung zu verhindern.",
                        },
                    ],
                },
                {
                    id: "art-10-konter",
                    title: "Nachspiel",
                    paragraphs: [
                        {
                            content:
                                "Nur das Team, welches das Spiel nicht angefangen hat, hat ein Recht auf Nachspiel.",
                        },
                        { content: "Es darf nur einmal nachgespielt werden." },
                        {
                            content:
                                "Das Nachspiel ist erfolgreich, wenn das zweite Team das Spiel in dieser letzten Runde beenden kann.",
                        },
                        {
                            content:
                                "Bei einem erfolgreichen Nachspiel wird das Spiel als unentschieden gewertet.",
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
                                "Wenn in einer Wurfrunde ein Wurf getroffen wurde, darf der Spieler erneut werfen.",
                        },
                        {
                            content:
                                "Bevor erneut geworfen wird, müssen die getroffenen Becher entfernt werden.",
                        },
                    ],
                },
                {
                    id: "art-13-becher-umschmeissen",
                    title: "Becher umschmeißen",
                    paragraphs: [
                        {
                            content:
                                "Wenn ein Team während des Spiels einen oder mehrere eigene Becher umwirft, müssen die umgeworfenen Becher entfernt werden.",
                        },
                        {
                            content:
                                "Der letzte Becher darf nicht durch Umschmeißen entfernt werden. Hier wird an die Fairness der Mitspieler appelliert.",
                        },
                    ],
                },
                {
                    id: "art-14-blasen-fingern",
                    title: "Blasen/Fingern",
                    paragraphs: [
                        {
                            content:
                                "Es ist nicht erlaubt, einen Ball, der noch nicht komplett im Becher ist, mit Fingern zu retten.",
                        },
                        {
                            content:
                                "Es ist erlaubt einen Ball, welcher noch nicht komplett im Becher ist, durch Blasen zu retten.",
                        },
                        {
                            content:
                                "Ein Ball ist noch nicht komplett im Becher, wenn er die Flüssigkeit im Becher noch nicht berührt hat.",
                        },
                        {
                            content:
                                "Wenn der Ball aus einem Becher in einen anderen geblasen wird, zählen beide Becher als getroffen und müssen entfernt werden.",
                        },
                    ],
                },
                {
                    id: "art-15-trickshot",
                    title: "Trickshot",
                    paragraphs: [
                        {
                            content:
                                "Wenn ein Ball nach einem Wurf zurückrollt, darf das aktuelle Werferteam den Ball holen. Das gegnerische Team darf dies verhindern, indem es selber den Ball holt. Wenn es einem Spieler des aktuellen Werferteams gelingt, den Ball zu holen, darf dieser einen Trickshot machen. Dieser muss nach den regulären Würfen geworfen werden. Außerdem werden zuerst von regulären Bällen getroffene Becher entfernt.",
                        },
                        {
                            content:
                                "Becher, die von einem Trickshot getroffen wurden, müssen sofort entfernt werden.",
                        },
                        {
                            content:
                                "Wenn ein Trickshot-Ball zurückrollt, kann dieser ebenfalls geholt werden, und ein weiterer Trickshot kann gemacht werden.",
                        },
                        {
                            content:
                                "Ein Trickshot zählt nicht als Air Ball, wenn er hinter der Tischkante gefangen wird.",
                        },
                        {
                            content:
                                "Der Trickshot ist nicht auf andere Spieler des Teams übertragbar.",
                        },
                        {
                            content:
                                "Der Trickshot zählt, aufgrund seiner Komplexität, als zwei Treffer.",
                        },
                        {
                            content:
                                "Der Spieler der den Ball holt, muss zum Zeitpunkt des Wurfs auf der zugehörigen Seite des Tischs stehen, um somit gleiche Chancen zu ermöglichen. Das Eingreifen einer Person, welche dieser Vorraussetzung nicht entspricht ist untersagt und wird damit bestraft, dass das jeweilige andere Team den Ball erhält.",
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
                    id: "art-todesbecher",
                    title: "Todesbecher",
                    paragraphs: [
                        {
                            content:
                                "Wenn am Ende einer Runde ein getroffener Becher stehen bleibt, zählt dieser Becher als Todesbecher. Wenn das gegnerische Team in einer der nachfolgenden Runden diesen Becher trifft, hat das Team, das den Todesbecher getroffen hat, sofort gewonnen.",
                        },
                        {
                            content:
                                "Wenn eine Person des Teams mit dem Todesbecher bemerkt, dass sie einen Todesbecher haben, dürfen sie diesen Becher umgehend entfernen.",
                        },
                    ],
                },
                {
                    id: "art-insel",
                    title: "Insel",
                    paragraphs: [
                        {
                            content:
                                "Wenn ein Becher allein steht, also keine Nachbarn hat, kann ein Spieler Insel auf diesen Becher rufen. Wird dieser getroffen, müssen der getroffene Becher und ein weiterer Becher entfernt werden. Wird anstelle des Insel-Bechers ein anderer Becher getroffen, zählt der Treffer nicht.",
                        },
                        { content: "Jeder Spieler darf im gesamten Spiel einmal Insel rufen." },
                        {
                            content:
                                "Die Anzahl an Insel-Rufen begrenzt sich pro Team auf zwei, selbst wenn ein Team aus mehr als zwei Spielern besteht.",
                        },
                    ],
                },
                {
                    id: "art-air-ball",
                    title: "Air Ball",
                    paragraphs: [
                        {
                            content:
                                "Ein Ball zählt als Air Ball, wenn er keinen Gegenstand oder ähnliches berührt und hinter der Tischplatte gefangen wird.",
                        },
                        {
                            content:
                                "Wenn ein Air Ball hinter der Tischkante gefangen wird, darf der Fänger des Balls (solange er im gegnerischen Team ist) in der nächsten Wurfrunde einen Ball doppelt werfen.",
                        },
                        {
                            content:
                                "Bälle, die seitlich neben den Tisch geworfen werden oder dort gefangen werden, zählen nicht als Air Ball.",
                        },
                    ],
                },
                {
                    id: "art-gentlewomen",
                    title: "Gentle(wo-)men",
                    paragraphs: [
                        {
                            content:
                                "Wenn nur noch zwei Becher eines Teams stehen, kann das gegnerische Team sie dazu auffordern, die Becher hintereinander an die Spitze des Dreiecks zu stellen, welche in Richtung des gegnerischen Teams zeigt.",
                        },
                        {
                            content:
                                "Das Team mit den zwei verbleibenden Bechern kann das freiwillig machen, sobald der Fall eintritt und muss es machen, wenn das gegnerische Team es dazu auffordert.",
                        },
                    ],
                },
                {
                    id: "art-abfangen",
                    title: "Abfangen",
                    paragraphs: [
                        {
                            content:
                                "Wenn ein Ball, welcher kein [[ref:art-12-aufsetzer]] oder [[ref:art-air-ball]] ist, also noch kein Gegenstand berührt hat, sich vor der Tischkante befindet und sich somit in der Luft befindet, von einem gegnerischen Spieler berührt wird, so zählt das als Abfangen des Balls.",
                        },
                        {
                            content:
                                "Das Abfangen eines Balls stellt einen nicht regelkonformen, irreversiblen Eingriff in das Spiel dar und wird mit der sofortigen Niederlage des gegnerischen bzw. dem sofortigen Gewinn des werfenden Teams bestraft.",
                        },
                        {
                            content:
                                "Ein Ball zählt nicht als abgefangen, wenn ein Spieler gerade dabei ist die Becher [[ref:art-5-becher-richten]] oder ein Ball [[ref:art-6-ball-entfernen]]. Werfen während dieser Aktionen ist untersagt.",
                        },
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
                                "Insel mit Aufsetzer &rarr; Inselbecher + ein weiterer (Insel) + ein Becher Aufsetzer",
                        },
                        {
                            content:
                                "Bombe mit Insel &rarr; Bomben-/ Inselbecher + zwei weitere (Bombe) + ein weiterer (Insel)",
                        },
                        {
                            content:
                                "Bombe mit Doppel-Insel &rarr; Bomben-/ Inselbecher + zwei weitere (Bombe) + zwei weitere (Insel)",
                        },
                    ],
                },
            ],
        },
    ],
    combinations: [
        { flavorSlug: "3d", flavorName: "3D", status: "compatible" },
        { flavorSlug: "sniper", flavorName: "Sniper", status: "compatible" },
        { flavorSlug: "double-table", flavorName: "Double Table", status: "compatible" },
        { flavorSlug: "moritz", flavorName: "Moritz", status: "incompatible" },
        { flavorSlug: "marcel", flavorName: "Marcel", status: "incompatible" },
        { flavorSlug: "game-pigeon", flavorName: "Game Pigeon", status: "incompatible" },
        {
            flavorSlug: "mehr-baelle",
            flavorName: "Mehr Bälle",
            status: "restricted",
            notes: [{ content: "Art 11: Spielweise nach Flavor Felix" }],
        },
    ],
};
