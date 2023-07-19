import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import Leaderboard from '../Leaderboard/index.jsx';

export default function TeamLeaderboard() {
    /**
     * @type {{
     *   teamLeaderboard: {
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
    const { teamLeaderboard } = usePluginData('leaderboard-plugin');
    return (
        <Leaderboard data={teamLeaderboard} />
    );
}
