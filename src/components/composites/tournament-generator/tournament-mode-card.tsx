import { type TournamentMode, formatDuration } from "@/lib/tournament-generator";
import { cn } from "@/lib/utils";

function koFirstRoundLabel(finalsType: number): string {
    switch (finalsType) {
        case 1:
            return "Finale";
        case 2:
            return "Halbfinale";
        case 4:
            return "Viertelfinale";
        case 8:
            return "Achtelfinale";
        default:
            return `Runde der letzten ${finalsType * 2}`;
    }
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <span>
            <span className="text-muted-foreground">{label}: </span>
            <span className="font-medium">{value}</span>
        </span>
    );
}

function getModeDescription(mode: TournamentMode): string {
    const isTeam = mode.teamSize > 1;
    const unit = isTeam ? "Team" : "Spieler";
    const unitPlural = isTeam ? "Teams" : "Spieler";

    switch (mode.type) {
        case "freeForAll":
            return (
                `Jede${isTeam ? "s" : "r"} ${unit} tritt gegen jede${isTeam ? "s" : "n"} andere${isTeam ? "s" : "n"} ${unit} an. ` +
                `D${isTeam ? "as" : "er"} ${unit} mit den meisten Siegen gewinnt – bei Gleichstand entscheidet die Trefferdifferenz. ` +
                `Geeignet für eine kleine Anzahl an ${unitPlural}.`
            );
        case "swiss":
            return (
                `Jede Runde werden ${unitPlural} mit ähnlichem Punktestand gegeneinander ausgelost. ` +
                `Alle ${unitPlural} bestreiten die gleiche Anzahl an Runden – es gibt keine Ausscheidung. ` +
                `Am Ende entscheidet die Gesamtpunktzahl über die Platzierung.`
            );
        case "groupPhase":
            return (
                `Die ${unitPlural} werden in ${mode.groupCount} Gruppen aufgeteilt, in denen jede${isTeam ? "s" : "r"} gegen jede${isTeam ? "s" : "n"} andere${isTeam ? "" : "n"} spielt. ` +
                `Die zwei Erstplatzierten jeder Gruppe qualifizieren sich für die K.O.-Runde ab ${koFirstRoundLabel(mode.finalsType)}, ` +
                `in der im direkten Duell der Sieger ermittelt wird.`
            );
    }
}

interface Props {
    mode: TournamentMode;
    players: number;
    maxDuration: number;
    isBestFit?: boolean;
}

export function TournamentModeCard({ mode, players, maxDuration, isBestFit }: Props) {
    const exceeds = mode.totalDuration > maxDuration;
    const isTeam = mode.teamSize > 1;
    const unitSingular = isTeam ? "Team" : "Spieler";
    const unitPlural = isTeam ? "Teams" : "Spieler";
    const hasUnevenTeams = isTeam && players % mode.teamSize !== 0;

    const teamLabel = isTeam ? `Teams à ${mode.teamSize} Spieler` : "Einzel";

    let title: string;
    let subtitle: string;
    if (mode.type === "freeForAll") {
        title = "Jeder gegen Jeden";
        subtitle = teamLabel;
    } else if (mode.type === "swiss") {
        const standardRounds = Math.ceil(Math.log2(mode.teams));
        title = "Schweizer System";
        subtitle = `${mode.rounds} Runden${mode.rounds === standardRounds ? " (Standard)" : ""}${isTeam ? ` · ${teamLabel}` : ""}`;
    } else {
        const groupUnit = isTeam ? `Teams à ${mode.teamSize} Spieler` : "Spieler";
        title = "Gruppenphase";
        subtitle = `${mode.groupCount} Gruppen à ${mode.groupSize} ${groupUnit}`;
    }

    return (
        <div
            className={cn(
                "rounded-lg border p-4",
                isBestFit && "border-primary",
                exceeds && "border-destructive/50 bg-destructive/5",
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{title}</span>
                        {isBestFit && (
                            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium">
                                Empfehlung
                            </span>
                        )}
                    </div>
                    <div className="text-muted-foreground text-sm">{subtitle}</div>
                </div>
                <div
                    className={cn(
                        "shrink-0 rounded-md px-2 py-1 text-sm font-medium tabular-nums",
                        exceeds
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground",
                    )}
                >
                    {formatDuration(mode.totalDuration)}
                </div>
            </div>

            {exceeds && (
                <p className="text-destructive mt-2 text-xs">
                    Überschreitet die maximale Turnierdauer um{" "}
                    {formatDuration(mode.totalDuration - maxDuration)}.
                </p>
            )}

            <p className="text-muted-foreground mt-3 text-sm">{getModeDescription(mode)}</p>

            {hasUnevenTeams && (
                <p className="mt-2 text-xs text-amber-600">
                    Hinweis: Ein Team hat nur {players % mode.teamSize} statt {mode.teamSize}{" "}
                    Spieler.
                </p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                {mode.type === "freeForAll" ? (
                    <>
                        <Stat label={unitPlural} value={mode.teams} />
                        <Stat label="Spiele" value={mode.numberOfGames} />
                        <Stat label={`Spiele/${unitSingular}`} value={mode.gamesPerTeam} />
                    </>
                ) : mode.type === "swiss" ? (
                    <>
                        <Stat label={unitPlural} value={mode.teams} />
                        <Stat label="Runden" value={mode.rounds} />
                        <Stat label="Spiele" value={mode.numberOfGames} />
                        <Stat
                            label={`Spiele/${unitSingular}`}
                            value={
                                mode.hasOddTeams
                                    ? `${mode.gamesPerTeam - 1}–${mode.gamesPerTeam}`
                                    : mode.gamesPerTeam
                            }
                        />
                    </>
                ) : (
                    <>
                        <Stat label={unitPlural} value={mode.teams} />
                        <Stat label="GP-Spiele" value={mode.gamesInGP} />
                        <Stat
                            label={`K.O. ab ${koFirstRoundLabel(mode.finalsType)}`}
                            value={`${mode.gamesInKP} Spiele`}
                        />
                        <Stat label="Spiele gesamt" value={mode.numberOfGames} />
                        <Stat
                            label={`Spiele/${unitSingular}`}
                            value={`${mode.gamesPerTeamMin}–${mode.gamesPerTeamMax}`}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
