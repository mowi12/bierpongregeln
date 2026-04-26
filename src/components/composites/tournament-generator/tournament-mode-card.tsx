import { TournamentMode, formatDuration } from "@/lib/tournament-generator";
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

interface Props {
    mode: TournamentMode;
    maxDuration: number;
}

export function TournamentModeCard({ mode, maxDuration }: Props) {
    const exceeds = mode.totalDuration > maxDuration;
    const isTeam = mode.teamSize > 1;
    const unitSingular = isTeam ? "Team" : "Spieler";
    const unitPlural = isTeam ? "Teams" : "Spieler";

    let title: string;
    let subtitle: string;
    if (mode.type === "freeForAll") {
        title = "Jeder gegen Jeden";
        subtitle = isTeam ? `Teams à ${mode.teamSize} Spieler` : "Einzel";
    } else {
        const groupUnit = isTeam ? `Teams à ${mode.teamSize} Spieler` : "Spieler";
        title = "Gruppenphase";
        subtitle = `${mode.groupCount} Gruppen à ${mode.groupSize} ${groupUnit}`;
    }

    return (
        <div
            className={cn(
                "rounded-lg border p-4",
                exceeds && "border-destructive/50 bg-destructive/5",
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="font-semibold">{title}</div>
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

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                {mode.type === "freeForAll" ? (
                    <>
                        <Stat label={unitPlural} value={mode.teams} />
                        <Stat label="Spiele" value={mode.numberOfGames} />
                        <Stat label={`Spiele/${unitSingular}`} value={mode.gamesPerTeam} />
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
