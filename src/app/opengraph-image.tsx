import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pluser Game – Play. Win. Cash Out.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE_URL = "https://plusergame-web.vercel.app";

export default async function Image() {
  const logoSrc = `${SITE_URL}/images/icon.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0F1115 0%, #1B1F27 55%, #2a1f12 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "rgba(212, 175, 55, 0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-140px",
            left: "-60px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "rgba(154, 33, 33, 0.18)",
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "640px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              <img
                src={logoSrc}
                width={72}
                height={72}
                alt=""
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  objectFit: "cover",
                }}
              />
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#D4AF37",
                  letterSpacing: 0.5,
                }}
              >
                Pluser Game
              </span>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 800,
                color: "#F5F7FA",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Play. Win. Cash Out.
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "rgba(245, 247, 250, 0.72)",
                lineHeight: 1.35,
                marginBottom: 36,
                maxWidth: 560,
              }}
            >
              Spin, dice, coin flip & more — deposit, play, and withdraw your winnings.
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "14px 28px",
                  borderRadius: 999,
                  background: "#D4AF37",
                  color: "#0F1115",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                Tap to start winning
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 360,
              height: 360,
              borderRadius: 40,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212, 175, 55, 0.35)",
            }}
          >
            <img
              src={logoSrc}
              width={280}
              height={280}
              alt=""
              style={{
                width: 280,
                height: 280,
                borderRadius: 28,
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
