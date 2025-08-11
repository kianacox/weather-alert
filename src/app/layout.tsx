// Next.js imports
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense, lazy } from "react";

// Local imports
import "./globals.css";

// Lazy load Navigation component
const Navigation = lazy(() => import("@/app/components/Navigation"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WindyDays - Wind Conditions Around the World",
  description:
    "Discover wind conditions around the world. Search for any location to see real-time wind data.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
        </Suspense>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
