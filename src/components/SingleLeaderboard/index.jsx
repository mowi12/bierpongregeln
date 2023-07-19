import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import Leaderboard from '../Leaderboard/index.jsx';

export default function SingleLeaderboard() {
    /**
     * @type {{
     *   singleLeaderboard: {
     *     name: string,
     *     pointsPerGame: number,
     *     points: number,
     *     wins: number,
     *     winrate: number,
     *     participations: number,
     *     place: number
     *   }[]
     * }}
     */
    const { singleLeaderboard } = usePluginData('leaderboard-plugin');
    return (
        <Leaderboard data={singleLeaderboard} />
    );
}
