import { readFileSync } from "node:fs";
import { join } from "node:path";

export const socialImageSize = { width: 1200, height: 630 };
export const socialImageAlt = "Bierpongregeln – Die beste Bierpongregelsammlung!";

const logoDataUrl = `data:image/png;base64,${readFileSync(
    join(process.cwd(), "public", "logo-social.png"),
).toString("base64")}`;

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
                backgroundImage: "linear-gradient(135deg, #00b3aa 0%, #018273 100%)",
            }}
        >
            {/** biome-ignore lint/performance/noImgElement: next/og's ImageResponse requires a plain <img>, not next/image */}
            <img src={logoDataUrl} width={220} height={220} alt="" style={{ marginBottom: 40 }} />
            <div
                style={{
                    fontSize: 96,
                    fontWeight: 700,
                    color: "#fffafa",
                    display: "flex",
                }}
            >
                Bierpongregeln
            </div>
            <div
                style={{
                    fontSize: 36,
                    color: "#efeae0",
                    marginTop: 16,
                    display: "flex",
                }}
            >
                Die beste Bierpongregelsammlung!
            </div>
        </div>
    );
}
