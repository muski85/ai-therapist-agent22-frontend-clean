"use client";

// 	A wrapper that makes sure the theme (and other global features) works everywhere in your app.

import { SessionProvider as NextauthSessionProvider } from "next-auth/react";

import { ThemeProvider } from "next-themes";
import { SessionProvider as CustomSessionProvider } from "@/lib/contexts/session-contexts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextauthSessionProvider>
      <CustomSessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </CustomSessionProvider>
    </NextauthSessionProvider>
  );
}
