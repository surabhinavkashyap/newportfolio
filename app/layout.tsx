import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abhinav-portfolio-umber.vercel.app"),
  title: "Abhinav Kashyap — Software Engineer",
  description:
    "B.Tech IT student at Jabalpur Engineering College. I build real, working software — encrypted tools, APIs, and interfaces — on a strong data structures and algorithms foundation.",
  openGraph: {
    title: "Abhinav Kashyap — Software Engineer",
    description:
      "B.Tech IT @ JEC. Full-stack projects built to be correct first: Secure Vault, a URL shortener, a queue manager, and a badminton scorer.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="grain relative min-h-screen bg-ink text-fog">
        <Providers>
          {children}
          <Toaster
            position="bottom-center"
            theme="dark"
            toastOptions={{
              style: {
                background: "#111418",
                border: "1px solid rgb(255 255 255 / 0.1)",
                color: "#eef1f5",
                fontFamily: "var(--font-geist-sans)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
