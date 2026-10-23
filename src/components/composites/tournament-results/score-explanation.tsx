"use client";

import { Calculator } from "lucide-react";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    formatDate,
    QUALIFIED_MIN_PARTICIPATIONS,
    rating,
    type ScoreBreakdown,
    scoring,
    type TournamentType,
} from "@/lib/tournament-utils";

const oneDecimal = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const twoDecimals = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const plain = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

const decayPercent = Math.round((1 - scoring.inactivityDecay) * 100);

function Formula({ children }: { children: ReactNode }) {
    return (
        <p className="bg-card text-foreground rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold tabular-nums">
            {children}
        </p>
    );
}

function Step({ label, value }: { label: ReactNode; value: ReactNode }) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-1">
            <dt className="text-muted-foreground min-w-0">{label}</dt>
            <dd className="ml-auto text-right tabular-nums">{value}</dd>
        </div>
    );
}

function StepGroup({
    title,
    result,
    children,
}: {
    title: string;
    result: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between gap-4 border-b pb-1">
                <h4 className="font-bold">{title}</h4>
                <span className="font-extrabold tabular-nums">{result}</span>
            </div>
            <dl className="text-[0.8125rem]">{children}</dl>
        </div>
    );
}

/** Step-by-step score of one player with the board's actual numbers. */
function WorkedExample({
    breakdown,
    averagePoints,
}: {
    breakdown: ScoreBreakdown;
    averagePoints: number;
}) {
    const ratio = averagePoints > 0 ? breakdown.adjustedPointsPerTournament / averagePoints : 1;
    const penalisedDays = Math.max(0, breakdown.missedDays - scoring.inactivityGrace);

    return (
        <div className="flex flex-col gap-4">
            <StepGroup title="Punkte" result={oneDecimal.format(breakdown.points)}>
                <Step
                    label={`${breakdown.participations} Teilnahmen`}
                    value={`${breakdown.participations} × ${scoring.participationPoints} = ${oneDecimal.format(breakdown.participationPoints)}`}
                />
                {breakdown.podiums.map((podium) => (
                    <Step
                        key={`${podium.date}-${podium.place}-${podium.gamesToWin}`}
                        label={`${formatDate(podium.date)} · ${podium.place}. Platz · ${podium.gamesToWin} Spiele`}
                        value={`${podium.basePoints} × ${twoDecimals.format(podium.coefficient)} = ${oneDecimal.format(podium.points)}`}
                    />
                ))}
            </StepGroup>

            <StepGroup title="Form" result={`×${twoDecimals.format(breakdown.form)}`}>
                <Step
                    label="Angepasste Punkte pro Turnier"
                    value={`(${oneDecimal.format(breakdown.points)} + ${scoring.shrinkage} × ${twoDecimals.format(averagePoints)}) ÷ (${breakdown.participations} + ${scoring.shrinkage}) = ${twoDecimals.format(breakdown.adjustedPointsPerTournament)}`}
                />
                <Step
                    label="Im Vergleich zum Durchschnitt"
                    value={`${twoDecimals.format(breakdown.adjustedPointsPerTournament)} ÷ ${twoDecimals.format(averagePoints)} = ${twoDecimals.format(ratio)}`}
                />
                <Step
                    label="Abgeschwächt"
                    value={`${twoDecimals.format(ratio)} ^ ${plain.format(scoring.formExponent)} = ${twoDecimals.format(breakdown.form)}`}
                />
            </StepGroup>

            <StepGroup title="Aktivität" result={`×${twoDecimals.format(breakdown.activity)}`}>
                <Step
                    label="Letzte Teilnahme"
                    value={formatDate(breakdown.lastParticipationDate)}
                />
                <Step
                    label={`Verpasste Turniertage seitdem (${scoring.inactivityGrace} frei)`}
                    value={`${breakdown.missedDays} → ${penalisedDays} mit Abzug`}
                />
                <Step
                    label="Faktor"
                    value={`${plain.format(scoring.inactivityDecay)} ^ ${penalisedDays} = ${twoDecimals.format(breakdown.activity)}`}
                />
            </StepGroup>

            <StepGroup title="Score" result={oneDecimal.format(breakdown.score)}>
                <Step
                    label="Punkte × Form × Aktivität"
                    value={`${oneDecimal.format(breakdown.points)} × ${twoDecimals.format(breakdown.form)} × ${twoDecimals.format(breakdown.activity)} = ${oneDecimal.format(breakdown.score)}`}
                />
            </StepGroup>
        </div>
    );
}

interface ScoreExplanationContextValue {
    /** Opens the calculation; with a player, jumps straight to that player's breakdown. */
    open: (player?: string) => void;
}

const ScoreExplanationContext = createContext<ScoreExplanationContextValue | null>(null);

/** Opener for the score dialog of the surrounding board, or `null` outside a provider. */
export function useScoreExplanation(): ScoreExplanationContextValue | null {
    return useContext(ScoreExplanationContext);
}

/**
 * Holds the score dialog of one board. Anything inside can open it, either with the general
 * explanation or directly at a player's breakdown.
 */
export function ScoreExplanationProvider({
    type,
    breakdowns,
    medianGamesToWin,
    averagePoints,
    children,
}: {
    type: TournamentType;
    /** All players of the board, best first. */
    breakdowns: ScoreBreakdown[];
    medianGamesToWin: number;
    averagePoints: number;
    children: ReactNode;
}) {
    const selectId = useId();
    const playerSectionRef = useRef<HTMLElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [jumpToPlayer, setJumpToPlayer] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(breakdowns[0]?.player ?? "");

    const open = useCallback((player?: string) => {
        if (player) setSelectedPlayer(player);
        setJumpToPlayer(Boolean(player));
        setIsOpen(true);
    }, []);
    const contextValue = useMemo(() => ({ open }), [open]);

    const selected = breakdowns.find((b) => b.player === selectedPlayer) ?? breakdowns[0];
    const ranked = breakdowns.filter((b) => b.participations >= QUALIFIED_MIN_PARTICIPATIONS);
    const unranked = breakdowns.filter((b) => b.participations < QUALIFIED_MIN_PARTICIPATIONS);
    const boardName = type === "team" ? "Team" : "Einzel";
    const longerGames = medianGamesToWin + 1;
    const longerCoefficient =
        medianGamesToWin > 1 ? Math.log(longerGames) / Math.log(medianGamesToWin) : 1;

    return (
        <ScoreExplanationContext.Provider value={contextValue}>
            {children}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    onOpenAutoFocus={(event) => {
                        if (!jumpToPlayer) return;
                        event.preventDefault();
                        playerSectionRef.current?.scrollIntoView({ block: "start" });
                        selectRef.current?.focus({ preventScroll: true });
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>So wird der Score berechnet</DialogTitle>
                        <DialogDescription>
                            Score = Punkte × Form × Aktivität. Alle Werte gelten für die {boardName}
                            -Rangliste.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-5 flex flex-col gap-6 text-sm">
                        <section className="flex flex-col gap-2">
                            <h3 className="font-bold">Punkte</h3>
                            <p className="text-muted-foreground">
                                Jede Teilnahme bringt {scoring.participationPoints} Punkt. Für einen
                                Podestplatz gibt es {rating.firstPlace} / {rating.secondPlace} /{" "}
                                {rating.thirdPlace} Punkte, multipliziert mit dem
                                Turnierkoeffizienten. Er hängt davon ab, wie viele Spiele der Sieger
                                bis einschließlich Finale spielt, egal ob gewonnen oder verloren,
                                und wächst logarithmisch: Ein Turnier mit{" "}
                                {plain.format(medianGamesToWin)} Spielen (Median) zählt 1,00×, eines
                                mit {plain.format(longerGames)} Spielen{" "}
                                {twoDecimals.format(longerCoefficient)}×.
                            </p>
                            <Formula>
                                Koeffizient = ln(Spiele des Siegers inkl. Finale) ÷ ln(
                                {plain.format(medianGamesToWin)})
                            </Formula>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h3 className="font-bold">Form</h3>
                            <p className="text-muted-foreground">
                                Die Form vergleicht die Punkte pro Turnier mit dem Durchschnitt
                                aller Spieler dieser Rangliste ({twoDecimals.format(averagePoints)}{" "}
                                Punkte pro Teilnahme). Damit ein einzelnes gutes Turnier nicht
                                überbewertet wird, zählen für jeden Spieler {scoring.shrinkage}{" "}
                                zusätzliche Turniere mit genau dem Durchschnitt. Bei wenigen
                                Teilnahmen rückt die Form dadurch näher an 1, bei vielen fällt das
                                kaum ins Gewicht. Der Exponent {plain.format(scoring.formExponent)}{" "}
                                schwächt den Effekt ab. Über 1 heißt besser als der Durchschnitt.
                            </p>
                            <Formula>
                                Form = ((Punkte + {scoring.shrinkage} × Ø) ÷ (Teilnahmen +{" "}
                                {scoring.shrinkage}) ÷ Ø) ^ {plain.format(scoring.formExponent)}
                            </Formula>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h3 className="font-bold">Aktivität</h3>
                            <p className="text-muted-foreground">
                                Gezählt werden die Turniertage dieser Rangliste seit der letzten
                                Teilnahme. Mehrere Turniere am selben Tag zählen als ein Tag. Die
                                ersten {scoring.inactivityGrace} verpassten Tage sind frei, danach
                                kostet jeder Tag {decayPercent}&nbsp;% des Scores.
                            </p>
                            <Formula>
                                Aktivität = {plain.format(scoring.inactivityDecay)} ^ max(0,
                                verpasste Turniertage − {scoring.inactivityGrace})
                            </Formula>
                        </section>

                        {selected && (
                            <section
                                ref={playerSectionRef}
                                className="flex scroll-mt-4 flex-col gap-3"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="font-bold">Rechnung für</h3>
                                    <label
                                        htmlFor={selectId}
                                        className="flex items-center gap-2 text-[0.8125rem]"
                                    >
                                        <span className="text-muted-foreground">Spieler</span>
                                        <select
                                            ref={selectRef}
                                            id={selectId}
                                            value={selected.player}
                                            onChange={(e) => setSelectedPlayer(e.target.value)}
                                            className="border-input bg-card focus-visible:border-ring focus-visible:ring-ring/50 h-11 rounded-lg border px-3 font-semibold outline-none focus-visible:ring-[3px]"
                                        >
                                            <optgroup label="Gewertet">
                                                {ranked.map((b, index) => (
                                                    <option key={b.player} value={b.player}>
                                                        {index + 1}. {b.player}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            {unranked.length > 0 && (
                                                <optgroup
                                                    label={`Weniger als ${QUALIFIED_MIN_PARTICIPATIONS} Teilnahmen`}
                                                >
                                                    {unranked.map((b) => (
                                                        <option key={b.player} value={b.player}>
                                                            {b.player}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}
                                        </select>
                                    </label>
                                </div>
                                <WorkedExample breakdown={selected} averagePoints={averagePoints} />
                                <p className="text-muted-foreground text-[0.8125rem]">
                                    Zwischenwerte sind gerundet, gerechnet wird mit den genauen
                                    Werten.
                                </p>
                            </section>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </ScoreExplanationContext.Provider>
    );
}

/** Opens the general score explanation of the surrounding board. */
export function ScoreExplanationButton() {
    const explanation = useScoreExplanation();

    return (
        <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => explanation?.open()}
        >
            <Calculator />
            Berechnung im Detail
        </Button>
    );
}

/** Button that opens a player's score breakdown; renders its children as content. */
export function PlayerScoreButton({
    player,
    className,
    children,
}: {
    player: string;
    className?: string;
    children: ReactNode;
}) {
    const explanation = useScoreExplanation();
    if (!explanation) return <span className={className}>{children}</span>;

    return (
        <button
            type="button"
            title={`Rechnung von ${player} anzeigen`}
            className={className}
            onClick={(event) => {
                event.stopPropagation();
                explanation.open(player);
            }}
        >
            {children}
        </button>
    );
}
