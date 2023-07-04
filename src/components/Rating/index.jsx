import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';

/**
 * @param {number} rating
 */
function formatRating(rating) {
    return `${rating} Punkt${rating > 1 ? 'e' : ''}`;
}

export default function Rating() {
    /**
     * @type {{rating: {firstPlace: number, secondPlace: number, thirdPlace: number}}}
     */
    const { rating } = usePluginData('leaderboard-plugin');
    return (
        <div>
            <div>
                {`1. Platz: ${formatRating(rating.firstPlace)}`}
            </div>
            <div>
                {`2. Platz: ${formatRating(rating.secondPlace)}`}
            </div>
            <div>
                {`3. Platz: ${formatRating(rating.thirdPlace)}`}
            </div>
        </div>
    );
}
