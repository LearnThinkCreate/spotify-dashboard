import * as React from 'react';
export function useScreenWidth() {
    const [screenWidth, setScreenWidth] = React.useState<number>(0);
    React.useEffect(() => {
        setScreenWidth(window.innerWidth);
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        // console.log('useScreenWidth mounted')
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return screenWidth;
}