import Admonition from "@theme/Admonition";
import Translate from "@docusaurus/Translate";

export default function FlavorPreamble(): JSX.Element {
    return (
        <div>
            <Admonition type="info">
                <Translate id="flavorPreamble.message" description="The message displayed at the top of a flavor page"
                    values={{
                        flavorsLink: (
                            <a href="../regelwerk#flavors">
                                <Translate id="flavorPreamble.flavors" description="String displayed in the flavor preamble link to the flavors page">Flavors</Translate>
                            </a>
                        ),
                        regelwerkLink: (
                            <a href="../regelwerk">
                                <Translate id="flavorPreamble.regelwerk" description="String displayed in the flavor preamble link to the regelwerk page">Regelwerk</Translate>
                            </a>
                        ),
                        br: <br />,
                    }}
                >
                    {`Viel Spaß mit diesem Flavor!{br}
                    Zu beachten ist, dass {flavorsLink} die Regeln des zugrunde liegenden Regelwerks abändern, entfernen und/oder um neue Regeln erweitern.{br}
                    Es empfiehlt sich, vorher das {regelwerkLink} durchzulesen.`}
                </Translate>
            </Admonition>
        </div>
    );
}
