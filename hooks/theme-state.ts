import { useTheme } from 'next-themes';
import { useConfig } from '@/hooks/use-config';
import { themes, Theme, getHexCodes } from '@/components/themes';

export function useThemeState() {
    const { theme: mode } = useTheme()
    const [config] = useConfig()
    let currentTheme = themes.find((theme) => theme.name === config.theme) as Theme
    let themeCodes = getHexCodes(currentTheme, mode as string)
    
    return {
        themeCodes,
        currentTheme
    }
    // return {
    //     themeCodes: getHexCodes(themes[0], 'dark'),
    //     currentTheme: themes[0]
    // }
}