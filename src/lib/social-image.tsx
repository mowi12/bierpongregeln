export const socialImageSize = { width: 1200, height: 630 };
export const socialImageAlt = "Bierpongregeln – Die beste Bierpongregelsammlung!";

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
            <div
                style={{
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    backgroundColor: "#ff786e",
                    display: "flex",
                    marginBottom: 40,
                }}
            />
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
