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
};
