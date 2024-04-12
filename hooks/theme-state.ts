import * as React from 'react';
import { useTheme } from 'next-themes';
import { useConfig } from '@/hooks/use-config';
import { themes, Theme, getHexCodes } from '@/components/themes';

export function useThemeState() {
    const { theme: mode } = useTheme()
    const [config] = useConfig()
    const [currentTheme, setCurrentTheme] = React.useState<Theme>(themes.find((theme) => theme.name === config.theme) as Theme)
    const [themeCodes, setThemeCodes] = React.useState<Object>(getHexCodes(currentTheme, mode as string));
    
    React.useEffect(() => {
        let newTheme = themes.find((theme) => theme.name === config.theme) as Theme
        setCurrentTheme(newTheme)
        setThemeCodes(getHexCodes(newTheme, mode as string));
    } , [config])

    return {
        themeCodes,
        currentTheme
    }
}