import { formatDuration, type TournamentMode } from "@/lib/tournament-generator";
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
        <div className="flex gap-1.5">
            <dt className="text-muted-foreground">{label}:</dt>
            <dd className="font-bold tabular-nums">{value}</dd>
        </div>
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
                "bg-card rounded-xl border p-5 lg:rounded-3xl lg:p-6",
                isBestFit && "border-primary ring-primary/30 ring-1",
                exceeds && "border-destructive/40 bg-destructive/5",
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-card-title">{title}</h3>
                        {isBestFit && (
                            <span className="bg-accent text-accent-foreground rounded-full px-2.5 py-1 text-xs font-bold">
                                Empfehlung
                            </span>
                        )}
                    </div>
                    <div className="text-muted-foreground mt-0.5 text-sm">{subtitle}</div>
                </div>
                <div
                    className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-sm font-bold tabular-nums",
                        exceeds
                            ? "bg-destructive/10 text-destructive"
                            : "bg-secondary text-secondary-foreground",
                    )}
                >
                    {formatDuration(mode.totalDuration)}
                </div>
            </div>

            {exceeds && (
                <p className="text-destructive mt-2 text-[0.8125rem] font-semibold">
                    Überschreitet die maximale Turnierdauer um{" "}
                    {formatDuration(mode.totalDuration - maxDuration)}.
                </p>
            )}

            <p className="text-muted-foreground mt-3 max-w-[68ch] text-[0.9375rem] leading-relaxed">
                {getModeDescription(mode)}
            </p>

            {hasUnevenTeams && (
                <p className="text-coral-ink mt-2 text-[0.8125rem] font-semibold">
                    Hinweis: Ein Team hat nur {players % mode.teamSize} statt {mode.teamSize}{" "}
                    Spieler.
                </p>
            )}

            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 border-t pt-4 text-sm min-[420px]:grid-cols-2 sm:flex sm:flex-wrap">
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
            </dl>
        </div>
    );
}
