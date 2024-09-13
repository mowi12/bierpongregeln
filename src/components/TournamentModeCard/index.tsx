import { CardProps } from "@site/src/types/tournament_mode";
import Card from "../card-components/Card";
import CardBody from "../card-components/CardBody";
import CardHeader from "../card-components/CardHeader";
import { CSSProperties } from "react";
import TournamentModeCardFooter from "../TournamentModeCardFooter";

interface TournamentModeCardProps {
    item: CardProps;
    tables: number;
    maxDuration: number;
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

    return (
        <Card shadow="tl" style={style}>
            <CardHeader>
                <h3>{item.title}</h3>
            </CardHeader>
            <CardBody>{item.description}</CardBody>
            <TournamentModeCardFooter details={item.details} tables={tables} />
        </Card>
    );
}
