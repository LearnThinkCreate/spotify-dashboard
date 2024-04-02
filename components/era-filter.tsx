"use client";

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { themes, Theme } from "@/components/themes";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  // PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header"

export function EraFilter() {
  const [config, setConfig] = useConfig();
  const { resolvedTheme: mode } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PageHeader>
    <PageHeaderHeading>Themes</PageHeaderHeading>
    <PageHeaderDescription>This is a test page</PageHeaderDescription>
    <div className="flex items-center space-x-2">
      <div className="mr-2 items-center space-x-0.5 flex">
        {mounted ? (
          <>
            {["red", "yellow", "green"].map((color) => {
              const theme = themes.find((theme) => theme.name === color);
              const isActive = config.theme === color;

              if (!theme) {
                return null;
              }

              return (
                <Tooltip key={theme.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        setConfig({
                          ...config,
                          theme: theme.name,
                        })
                      }
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs",
                        isActive
                          ? "border-[--theme-primary]"
                          : "border-transparent"
                      )}
                      style={
                        {
                          "--theme-primary": `hsl(${
                            theme?.activeColor[
                              mode === "dark" ? "dark" : "light"
                            ]
                          })`,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]"
                        )}
                      >
                        {isActive && (
                          <CheckIcon className="h-4 w-4 text-white" />
                        )}
                      </span>
                      <span className="sr-only">{theme.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    className="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
                  >
                    {theme.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
    </PageHeader>
  );
}
