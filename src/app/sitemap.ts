import type { MetadataRoute } from "next";
import { getRulesetSlugs } from "@/lib/ruleset-loader";

const baseUrl = "https://mowi12.github.io/bierpongregeln";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const slugs = await getRulesetSlugs();

    return [
        { url: baseUrl, lastModified: new Date() },
        { url: `${baseUrl}/tournament-results`, lastModified: new Date() },
        { url: `${baseUrl}/tournament-generator`, lastModified: new Date() },
        ...slugs.map((slug) => ({
            url: `${baseUrl}/flavor/${slug}`,
            lastModified: new Date(),
        })),
    ];
}
