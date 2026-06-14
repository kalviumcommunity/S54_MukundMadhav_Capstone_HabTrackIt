import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HabTrackIt — Build Better Habits",
  description: "Track habits, build streaks, and get AI-powered coaching with HabAIt.",
  icons: { icon: "/favicon.svg", apple: "/icon-192.png" },
  manifest: "/manifest.json",
  openGraph: {
    title: "HabTrackIt — Build Better Habits",
    description: "Track habits, build streaks, and get AI-powered coaching with HabAIt.",
    siteName: "HabTrackIt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HabTrackIt — Build Better Habits",
    description: "Track habits, build streaks, and get AI-powered coaching with HabAIt.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ? `https://${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0]}.vercel.app` : "http://localhost:3000"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#07080e",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
