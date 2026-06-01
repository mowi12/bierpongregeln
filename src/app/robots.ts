import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: "https://mowi12.github.io/bierpongregeln/sitemap.xml",
    };
}
