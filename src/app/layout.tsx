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

export const metadata: Metadata = {
  title: "Pluser Game",
  description: "Play virtual games, deposit, withdraw and win big on Pluser Game.",
  icons: { icon: "/images/favicon.png" },
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
