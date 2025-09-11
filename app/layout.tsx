import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Providers } from "./components/providers";
import { Footer } from "./components/footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Therapist Agent",
  description: "An AI-powered therapy assistant that helps users track activities, manage sessions, and receive personalized support for mental well-being.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <Providers>
          {/* Header */}
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}