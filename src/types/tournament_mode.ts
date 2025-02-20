export interface CardProps {
    title: string;
    description: string;
    details: FFADetailProps | GroupPhaseDetailProps;
}

export class Range {
    min: number;
    max: number;
}

export interface FFADetailProps {
    numberOfGames: number;
    gamesPerTeam: number | Range;
    teamSize: number;
    totalDuration: number;
}

export interface GroupPhaseDetailProps extends FFADetailProps {
    numberOfGamesPerGroup: number;
    finalsType: number;
}

export const isGroupPhaseDetailProps = (
    details: FFADetailProps | GroupPhaseDetailProps
): details is GroupPhaseDetailProps => {
    return "numberOfGamesPerGroup" in details;
};
