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
     *   }[],
     *   minimumParticipationThreshold: number
     * }}
     */
    const { singleLeaderboard, minimumParticipationThreshold } = usePluginData('leaderboard-plugin');
    return (
        <Leaderboard
            data={singleLeaderboard}
            minimumParticipationThreshold={minimumParticipationThreshold}
        />
    );
}
