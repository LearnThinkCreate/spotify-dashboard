"use client";

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { themes, Theme } from "@/components/themes";
import { cn } from "@/lib/utils";
import {
  // PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header"
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getHexCodes } from "@/components/graphics/Graphs/utils";

export const EraFilter: React.FC = () => {
  const [config, setConfig] = useConfig();
  const { resolvedTheme: mode } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updateEra = (era: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("era", era);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <PageHeader>
    <PageHeaderHeading>Themes</PageHeaderHeading>
    <PageHeaderDescription>This is a test page</PageHeaderDescription>
    <div className="flex items-center space-x-2">
      <div className="mr-2 items-center space-x-2 flex">
        {mounted ? (
          <>
            {["red", "yellow", "green"].map((color) => {
              const theme = themes.find((theme) => theme.name === color);
              const themeCodes = getHexCodes(theme, mode)
              const isActive = config.theme === color;

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
                    updateEra('');
                    return;
                  }
                  setConfig({
                    ...config,
                    theme: theme.name,
                  })
                  updateEra(theme.era);
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
          <div></div>
        )}
      </div>
    </div>
    </PageHeader>
  );
}
