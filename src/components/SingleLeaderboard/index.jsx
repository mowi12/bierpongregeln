import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import createLeaderboard from '../../helpers/createLeaderboard/index.jsx';

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
        <div>{createLeaderboard(singleLeaderboard)}</div>
    );
}
