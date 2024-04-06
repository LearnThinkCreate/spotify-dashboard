import "./globals.css";
import "@/public/registry/themes.css"
import { fontSans, fontMono } from "@/lib/fonts"
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher"
import { cn } from "@/lib/utils";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { MenuBar } from "@/components/menu-bar";


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontMono.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"></header>
            <main className="flex-1 flex flex-col p-4 md:p-2 2xl:p-6">
              <MenuBar />
              {children}
            </main>
          </div>
          <TailwindIndicator />
          <SpeedInsights />
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
