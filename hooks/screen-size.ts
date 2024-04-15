import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query";

export function useScreenWidth() {
    const isXlDesktop = useMediaQuery("(min-width: 1536px)");
    const isDesktop = useMediaQuery("(min-width: 1024px) && (max-width: 1535px)");
    const isTablet = useMediaQuery("(min-width: 768px) && (max-width: 1023px)");
    const isMobile = useMediaQuery("(max-width: 767px) && (min-width: 400px)");
    const isMini = useMediaQuery("(max-width: 399px)");

    const [screenWidth, setScreenWidth] = React.useState((
        isXlDesktop ? "xl-desktop" :
        isDesktop ? "desktop" :
        isTablet ? "tablet" :
        isMobile ? "mobile" :
        isMini ? "mini" :
        ""
    ));

    React.useEffect(() => {
        if (isXlDesktop) {
            setScreenWidth("xl-desktop");
        } else if (isDesktop) {
            setScreenWidth("desktop");
        } else if (isTablet) {
            setScreenWidth("tablet");
        } else if (isMobile) {
            setScreenWidth("mobile");
        } else if (isMini) {
            setScreenWidth("mini");
        }
    }, [isXlDesktop, isDesktop, isTablet, isMobile, isMini]);

    return screenWidth;
}