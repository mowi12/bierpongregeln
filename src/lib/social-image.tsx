import { readFileSync } from "node:fs";
import { join } from "node:path";

export const socialImageSize = { width: 1200, height: 630 };
export const socialImageAlt = "Bierpongregeln – Die beste Bierpongregelsammlung!";

export const logoDataUrl = `data:image/png;base64,${readFileSync(
    join(process.cwd(), "public", "logo-social.png"),
).toString("base64")}`;

// next/og can't use the variable web font, so static instances of Bricolage Grotesque are bundled.
const fontDir = join(process.cwd(), "assets", "fonts");

export const socialImageFonts = [
    {
        name: "Bricolage Grotesque",
        data: readFileSync(join(fontDir, "BricolageGrotesque-Regular.ttf")),
        style: "normal" as const,
        weight: 400 as const,
    },
    {
        name: "Bricolage Grotesque",
        data: readFileSync(join(fontDir, "BricolageGrotesque-ExtraBold.ttf")),
        style: "normal" as const,
        weight: 800 as const,
    },
];

/**
 * Mirrors the home page splash (light theme): the logo on an accent circle, title and lead below.
 */
export function SocialImageContent() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#fbf8f3",
                fontFamily: "Bricolage Grotesque",
            }}
        >
            <div
                style={{
                    width: 300,
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9999,
                    background: "#d9f2ef",
                }}
            >
                {/** biome-ignore lint/performance/noImgElement: next/og's ImageResponse requires a plain <img>, not next/image */}
                <img src={logoDataUrl} width={236} height={236} alt="" />
            </div>
            <div
                style={{
                    fontSize: 96,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "#0d2b29",
                    marginTop: 32,
                    display: "flex",
                }}
            >
                Bierpongregeln
            </div>
            <div
                style={{
                    fontSize: 36,
                    color: "#4f6664",
                    marginTop: 16,
                    display: "flex",
                }}
            >
                Die beste Bierpongregelsammlung!
            </div>
        </div>
    );
}
