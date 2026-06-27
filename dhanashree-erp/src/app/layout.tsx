import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { APP_DESCRIPTION, APP_NAME } from "@/config/constants";
import { AppProviders } from "@/providers/app-providers";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  applicationName: APP_NAME,
  description: APP_DESCRIPTION,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
