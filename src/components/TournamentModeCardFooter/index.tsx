import {
    FFADetailProps,
    GroupPhaseDetailProps,
} from "@site/src/types/tournament_mode";
import CardFooter from "../card-components/CardFooter";
import Column from "../Column";
import Columns from "../Columns";

interface TournamentModeCardFooterProps {
    details: FFADetailProps | GroupPhaseDetailProps;
    tables: number;
}

export default function TournamentModeCardFooter(
    props: TournamentModeCardFooterProps
) {
    const { details, tables } = props;

    return (
        <CardFooter>
            <Columns>
                <Column>
                    <span>Anzahl Spiele: {details.numberOfGames}</span>
                </Column>
                {gamesPerTeamColumn(details)}
                {finalsTypeColumn(details as GroupPhaseDetailProps)}
                {totalDurationColumn(details.totalDuration, tables)}
            </Columns>
        </CardFooter>
    );
}

function gamesPerTeamColumn(details: FFADetailProps) {
    const teamType = details.teamSize > 1 ? "Team" : "Spieler";
    let gamesPerTeamText = "";
    if (typeof details.gamesPerTeam === "object") {
        gamesPerTeamText = `${details.gamesPerTeam.min}-${details.gamesPerTeam.max}`;
    } else {
        gamesPerTeamText = details.gamesPerTeam.toString();
    }

    return (
        <Column>
            <span>
                Spiele pro {teamType}: {gamesPerTeamText}
            </span>
        </Column>
    );
}

function finalsTypeColumn(details: GroupPhaseDetailProps) {
    if (!("finalsType" in details)) return null;
    return (
        <Column>
            <span>
                Typ:{" "}
                {getFinalsType((details as GroupPhaseDetailProps).finalsType)}
            </span>
        </Column>
    );
}

function totalDurationColumn(totalDuration: number, tables: number) {
    return (
        <Column>
            <span>
                Gesamtdauer: {minutesToDurationString(totalDuration / tables)}
            </span>
        </Column>
    );
}

function getFinalsType(type: number) {
    switch (type) {
    case 1:
        return "Finale";
    case 2:
        return "Halbfinale";
    case 4:
        return "Viertelfinale";
    case 8:
        return "Achtelfinale";
    case 16:
        return "Sechzehntelfinale";
    default:
        return `${type}tel Finale`;
    }
}

function minutesToDurationString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) return `${days}d ${remainingHours}h ${remainingMinutes}min`;
    return `${hours}h ${remainingMinutes}min`;
}
