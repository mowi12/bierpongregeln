/* eslint-disable react/prop-types */
import React from 'react';

export default function Highlight(props) {
    const { children } = props;
    return (
        <span style={{ color: 'rgb(253, 119, 110)' }}>
            {children}
        </span>
    );
}
