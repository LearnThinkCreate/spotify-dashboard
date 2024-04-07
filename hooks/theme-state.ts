import * as React from 'react';
import { useTheme } from 'next-themes';
import { useConfig } from '@/hooks/use-config';
import { themes, Theme, getHexCodes } from '@/components/themes';

export function useThemeState() {
    const { theme: mode } = useTheme()
    const [config] = useConfig()
    const [currentTheme, setCurrentTheme] = React.useState<Theme | null>(themes.find((theme) => theme.name === config.theme))
    const [themeCodes, setThemeCodes] = React.useState<Object>(getHexCodes(currentTheme, mode));
    
    React.useEffect(() => {
        let newTheme = themes.find((theme) => theme.name === config.theme)
        setCurrentTheme(newTheme)
        setThemeCodes(getHexCodes(newTheme, mode));
    } , [config])

    return {
        themeCodes,
        currentTheme
    }
}