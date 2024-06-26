"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { themes, getHexCodes } from "@/components/themes";
import { cn } from "@/lib/utils";
import {
  PageHeader,
  PageHeaderDescription,
} from "@/components/ui/page-header"
import { Button } from "@/components/ui/button";

export const EraFilter: React.FC = () => {
  const [config, setConfig] = useConfig();
  const { resolvedTheme: mode } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <PageHeader>
    <PageHeaderDescription>Era</PageHeaderDescription>
    <div className="flex items-center space-x-2">
      <div className="mr-2 items-center space-x-2 flex">
        {mounted ? (
          <>
            {themes.slice(0, 3).map((theme) => {
              const themeCodes = getHexCodes(theme, mode as string)
              const isActive = config.theme === theme.name;

              if (!theme) {
                return null;
              }

              return (
                <Button
                key={'era-filter-' + theme.name}
                onClick={() => {
                  if (isActive) {
                    setConfig({
                      ...config,
                      theme: 'default',
                    })
                    return;
                  }
                  setConfig({
                    ...config,
                    theme: theme.name,
                    era: theme.era,
                  })
                }
                }
                className={cn(
                  "bg-[--theme-primary] hover:bg-default",
                  isActive ? "transition-all shadow-md shadow-[--theme-primary] scale-110 duration-300" : "hover:opacity-80"
                )}
                style={
                  {
                    "--theme-primary": themeCodes["primary"],
                    "--theme-test": themeCodes["foreground"],
                  } as React.CSSProperties
                }

              >
                 <span
                    className={cn(
                      "text-white"
                    )}
                  >
                    {theme.eraName}
                  </span>
              </Button>
              );
            })}
          </>
        ) : (
          <Button
            disabled
            className="animate-pulse bg-transparent rounded-md opacity-0"
          />
        )}
      </div>
    </div>
    </PageHeader>
  );
}
