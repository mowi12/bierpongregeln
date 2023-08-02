import React from 'react';
import Admonition from '@theme/Admonition';

export default function FlavorPreamble() {
    return (
        <div>
            <Admonition type="info">
                <span>Viel Spaß mit diesem Flavor!</span>
                <br />
                <span>Zu beachten ist, dass </span>
                <a href="../regelwerk#flavors">Flavors</a>
                <span> die Regeln des zugrunde liegenden Regelwerks abändern, entfernen </span>
                <span>und/oder um neue Regeln erweitern.</span>
                <br />
                <span>Es empfiehlt sich, vorher das </span>
                <a href="../regelwerk">Regelwerk</a>
                <span> durchzulesen.</span>
            </Admonition>
        </div>
    );
}
