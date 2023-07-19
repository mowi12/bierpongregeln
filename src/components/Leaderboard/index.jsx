import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Order = {
    Asc: 'ascending',
    Desc: 'descending',
};

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
 * @type {{
 *   name: string,
 *   order: Order
 * }[]}
 */
const keys = [
    {
        name: 'place',
        order: Order.Asc,
    },
    {
        name: 'name',
        order: Order.Asc,
    },
    {
        name: 'winrate',
        order: Order.Desc,
    },
    {
        name: 'pointsPerGame',
        order: Order.Desc,
    },
    {
        name: 'points',
        order: Order.Desc,
    },
    {
        name: 'wins',
        order: Order.Desc,
    },
    {
        name: 'participations',
        order: Order.Asc,
    },
];

function formatCellContent(content) {
    if (typeof content === 'number') {
        return content.toLocaleString('de-DE', { maximumFractionDigits: 2 });
    }
    return content;
}

let oldSortConfig = {
    field: headers[0],
    order: keys[0].order,
};

/**
 * @param {{
 *   field: string,
 *   order: Order
 * }} sortConfig
 * @returns {number}
 */
function sortFields(a, b, sortConfig) {
    const { name, order } = keys[headers.indexOf(sortConfig.field)];

    if (typeof a[name] === 'string') {
        return order === Order.Asc
            ? a[name].localeCompare(b[name])
            : a[name].localeCompare(b[name]);
    }

    return order === Order.Asc ? a[name] - b[name] : b[name] - a[name];
}

// https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
let once = false;

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
 * @param {{
 *   field: string,
 *   order: Order
 * }} sortConfig
 */
function sortLeaderBoard(leaderboard, sortConfig) {
    if (isDev && !once) {
        once = true;
        return;
    }

    if (sortConfig !== null) {
        if (sortConfig.order === Order.Desc) {
            leaderboard.sort((a, b) => sortFields(b, a, sortConfig));
        } else {
            leaderboard.sort((a, b) => sortFields(a, b, sortConfig));
        }
    }
}

function onHeaderClick(header, setSortConfig) {
    let newSortConfig;
    if (oldSortConfig.field === header) {
        const newOrder = oldSortConfig.order === Order.Asc ? Order.Desc : Order.Asc;
        newSortConfig = { field: header, order: newOrder };
    } else {
        newSortConfig = { field: header, order: Order.Asc };
    }
    oldSortConfig = newSortConfig;
    setSortConfig(newSortConfig);
}

/**
 * @param {{
 *   data: {
 *     name: string,
 *     pointsPerGame: number,
 *     points: number,
 *     wins: number,
 *     winrate: number,
 *     participations: number,
 *     place: number
 *   }[]
 * }} props
 */
export default function Leaderboard({ data }) {
    const [sortConfig, setSortConfig] = React.useState(oldSortConfig);

    React.useMemo(() => {
        sortLeaderBoard(data, sortConfig);
    }, [data, sortConfig]);

    return (
        <table className="leaderboard-table">
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>
                            <button
                                type="button"
                                onClick={() => onHeaderClick(header, setSortConfig)}
                                className={sortConfig.field === header ? sortConfig.order : ''}
                            >
                                {header}
                            </button>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((entry) => (
                    <tr key={entry.name}>
                        {keys.map(({ name }) => (
                            <td key={name}>{formatCellContent(entry[name])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

Leaderboard.propTypes = {
    data: PropTypes.arrayOf(
        {
            name: PropTypes.string,
            pointsPerGame: PropTypes.number,
            points: PropTypes.number,
            wins: PropTypes.number,
            winrate: PropTypes.number,
            participations: PropTypes.number,
            place: PropTypes.number,
        },

    ).isRequired,
};
