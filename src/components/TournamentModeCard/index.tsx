import {
    CardProps,
    isGroupPhaseDetailProps,
} from "@site/src/types/tournament_mode";
import Card from "../card-components/Card";
import CardBody from "../card-components/CardBody";
import CardHeader from "../card-components/CardHeader";
import { CSSProperties } from "react";
import TournamentModeCardFooter from "../TournamentModeCardFooter";
import { Icon } from "@iconify/react";
import "./style.css";

interface TournamentModeCardProps {
    item: CardProps;
    tables: number;
    maxDuration: number;
}

interface IconProps {
    title: string;
    icon: string;
}

export default function TournamentModeCard(props: TournamentModeCardProps) {
    const { item, tables, maxDuration } = props;

    const style: CSSProperties = {
        margin: "0rem 0rem 1rem 0rem",
    };
    if (item.details.totalDuration / tables > maxDuration) {
        style.backgroundColor = "rgba(255, 0, 0, 0.1)";
        style.border = "0.25rem solid rgba(255, 0, 0, 0.8)";
    } else {
        style.border = "0.25rem solid rgba(0, 0, 0, 0)";
    }

    let modeIcon: IconProps;
    if (isGroupPhaseDetailProps(item.details)) {
        modeIcon = {
            title: "Gruppenphase",
            icon: "lucide:network",
        };
    } else {
        modeIcon = {
            title: "Jeder gegen Jeden",
            icon: "lucide:swords",
        };
    }
    let teamIcon: IconProps;
    if (item.details.teamSize > 1) {
        teamIcon = {
            title: "Team",
            icon: "lucide:users",
        };
    } else {
        teamIcon = {
            title: "Einzel",
            icon: "lucide:user",
        };
    }

    return (
        <Card shadow="tl" style={style}>
            <CardHeader>
                <h3 className="mode-header">
                    <span>{item.title}</span>
                    <div className="mode-icon-list">
                        <span className="mode-icon" title={modeIcon.title}>
                            <Icon icon={modeIcon.icon} />
                        </span>
                        <span className="mode-icon" title={teamIcon.title}>
                            <Icon icon={teamIcon.icon} />
                        </span>
                    </div>
                </h3>
            </CardHeader>
            <CardBody>{item.description}</CardBody>
            <TournamentModeCardFooter details={item.details} tables={tables} />
        </Card>
    );
}
