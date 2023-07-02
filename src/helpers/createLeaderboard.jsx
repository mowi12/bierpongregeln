import React from 'react';

const headers = [
    'Platz',
    'Name',
    'Winrate',
    'PPG',
    'Punkte',
    'Siege',
    'Teilnahmen',
];

/**
 * @param {{
 *   name: string,
 *   pointsPerGame: number,
 *   points: number,
 *   wins: number,
 *   winrate: number,
 *   participations: number,
 *   place: number
 * }[]} leaderboard
 */
const createLeaderboard = (leaderboard) => {
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
                {leaderboard.map((entry) => (
                    <tr key={entry.name}>
                        <td>{entry.place}</td>
                        <td>{entry.name}</td>
                        <td>{entry.winrate}</td>
                        <td>{entry.pointsPerGame.toLocaleString('de-DE', { maximumFractionDigits: 2 })}</td>
                        <td>{entry.points}</td>
                        <td>{entry.wins}</td>
                        <td>{entry.participations}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default createLeaderboard;
