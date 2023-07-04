import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';

const headers = [
    'Datum',
    '1. Platz',
    '2. Platz',
    '3. Platz',
    'Flavor',
];

/**
 * @param {{
 *   date: string,
 *   flavor: string,
 *   firstPlace: string[],
 *   secondPlace: string[],
 *   thirdPlace: string[],
 *   id: number
 * }[]} tournaments
 */
function createTournamentsTable(tournaments) {
    const tableStyle = {
        borderStyle: 'hidden',
        display: 'inline-table',
    };

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tournaments.map((entry) => (
                    <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>{entry.firstPlace.join(' & ')}</td>
                        <td>{entry.secondPlace.join(' & ')}</td>
                        <td>{entry.thirdPlace.join(' & ')}</td>
                        <td>{entry.flavor}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function TournamentTable() {
    /**
     * @type {{
     *   tournaments: {
     *     date: string,
     *     flavor: string,
     *     firstPlace: string[],
     *     secondPlace: string[],
     *     thirdPlace: string[],
     *     id: number
     *   }[]
     * }}
     */
    const { tournaments } = usePluginData('leaderboard-plugin');
    return (
        <div>{createTournamentsTable(tournaments)}</div>
    );
}
