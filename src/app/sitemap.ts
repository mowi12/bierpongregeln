import type { MetadataRoute } from "next";
import { getRulesetSlugs } from "@/lib/ruleset-loader";
import { baseUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const slugs = await getRulesetSlugs();

    return [
        { url: baseUrl },
        { url: `${baseUrl}/tournament-results` },
        { url: `${baseUrl}/tournament-generator` },
        ...slugs.map((slug) => ({ url: `${baseUrl}/flavor/${slug}` })),
    ];
}
