import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import Logo from "@site/static/img/logo.svg";
import styles from "./index.module.css";

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header
            className={clsx(
                "hero",
                styles.heroBanner,
                styles.homePageBackground
            )}
        >
            <div className="container">
                <Logo className={clsx(styles.heroLogo)} />
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/regelwerk"
                    >
                        Regelwerk
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Homepage of 'Bierpongregeln'"
        >
            <HomepageHeader />
        </Layout>
    );
}
