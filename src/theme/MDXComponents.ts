// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import Highlight from "@site/src/components/Highlight";
import Rating from "@site/src/components/Rating";
import TeamLeaderboard from "@site/src/components/TeamLeaderboard";
import SingleLeaderboard from "@site/src/components/SingleLeaderboard";
import TournamentTable from "@site/src/components/TournamentTable";
import FlavorPreamble from "@site/src/components/FlavorPreamble";
import Columns from "@site/src/components/Columns";
import Column from "@site/src/components/Column";
import InputRange from "../components/InputRange";
import Card from "../components/card-components/Card";
import CardHeader from "../components/card-components/CardHeader";
import CardBody from "../components/card-components/CardBody";
import CardFooter from "../components/card-components/CardFooter";

export default {
    // Re-use the default mapping
    ...MDXComponents,
    Highlight,
    Rating,
    TeamLeaderboard,
    SingleLeaderboard,
    TournamentTable,
    FlavorPreamble,
    Columns,
    Column,
    InputRange,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
};
