import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";

const montserrat = localFont({
  src: [
    { path: "../../public/fonts/Montserrat-Thin.ttf", weight: "100" },
    { path: "../../public/fonts/Montserrat-Light.ttf", weight: "300" },
    { path: "../../public/fonts/Montserrat-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Montserrat-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Montserrat-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Montserrat-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/Montserrat-Black.ttf", weight: "900" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

const SITE_URL = "https://plusergame-web.vercel.app";
const SITE_NAME = "Pluser Game";
const SITE_TITLE = "Pluser Game – Play Fun Games & Win Real Rewards";
/** Keep ≤125 chars so WhatsApp / mobile previews do not truncate mid-sentence. */
const SITE_DESCRIPTION =
  "Play spin, dice, coin flip & more. Deposit, withdraw, and win real rewards on Pluser Game.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Pluser Game",
    "online games",
    "spin to win",
    "dice game",
    "coin flip",
    "lottery",
    "virtual betting",
    "deposit withdraw",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Pluser Game – Play. Win. Cash Out.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#0F1115",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="antialiased bg-charcoal">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
