import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import createLeaderboard from '../../helpers/createLeaderboard/index.jsx';

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
        <div>{createLeaderboard(teamLeaderboard)}</div>
    );
}
