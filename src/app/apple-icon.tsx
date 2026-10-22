import { ImageResponse } from "next/og";
import { logoDataUrl } from "@/lib/social-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS ignores SVG icons and fills transparent pixels with black, so the home screen icon is an
// opaque PNG: the logo on the dark page background, which suits light and dark home screens.
export default function AppleIcon() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0b1d1c",
            }}
        >
            {/** biome-ignore lint/performance/noImgElement: next/og's ImageResponse requires a plain <img>, not next/image */}
            <img src={logoDataUrl} width={168} height={168} alt="" />
        </div>,
        size,
    );
}
