// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Highlight from '@site/src/components/Highlight';
import Rating from '@site/src/components/Rating';
import TeamLeaderboard from '@site/src/components/TeamLeaderboard';
import SingleLeaderboard from '@site/src/components/SingleLeaderboard';
import TournamentTable from '@site/src/components/TournamentTable';

export default {
    // Re-use the default mapping
    ...MDXComponents,
    // Map the "<Highlight>" tag to our Highlight component
    // `Highlight` will receive all props that were passed to `<Highlight>` in MDX
    Highlight,
    Rating,
    TeamLeaderboard,
    SingleLeaderboard,
    TournamentTable,
};
