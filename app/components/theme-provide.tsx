import { ThemeProvider as NextThemesProvider} from "next-themes";
import { ReactNode } from "react";

// Sets up the system to remember and apply light/dark mode across your app.

export function ThemeProvider ({ children }: {
  children: ReactNode}) {
    return (
      <NextThemesProvider attribute="class"
      defaultTheme="system" enableSystem
      >
        {children}
      </NextThemesProvider>
    );
  }

