import "./globals.css";
import "@/public/registry/themes.css"
import { fontSans, fontMono } from "@/lib/fonts"
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher"
import { cn } from "@/lib/utils";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { EraFilter } from "@/components/nav-era-filter";


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
        <div className="flex flex-col h-screen">
            <div className="sticky top-0 z-50 shadow px-4 py-2 w-full">
                {/* <MenuBar /> */}
                <EraFilter />
              </div>
              <main className="flex-1">
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
