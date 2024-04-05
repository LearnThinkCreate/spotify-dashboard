"use client"
import * as React from "react";
import clsx from 'clsx';
import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/lib/utils";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';



export function GenreBadges({}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const [mainGenre, setMainGenre] = React.useState<string[]>(searchParams.getAll('main_genre'));
    const [secondaryGenre, setSecondaryGenre] = React.useState<string[]>(searchParams.getAll('secondary_genre'));
    const [removingBadge, setRemovingBadge] = React.useState(null);

    const genreCount = React.useRef(mainGenre.length + secondaryGenre.length);

    React.useEffect(() => {
        // Reset the main genre if there's a differnce between the search params and the state
        if (searchParams.getAll('main_genre').join(',') !== mainGenre.join(',')) {
            genreCount.current = (
                genreCount.current - mainGenre.length + searchParams.getAll('main_genre').length
            )
            setMainGenre(searchParams.getAll('main_genre'));
        }
        // Reset the secondary genre if there's a differnce between the search params and the state
        if (searchParams.getAll('secondary_genre').join(',') !== secondaryGenre.join(',')) {
            genreCount.current = (
                genreCount.current - secondaryGenre.length + searchParams.getAll('secondary_genre').length
            )
            setSecondaryGenre(searchParams.getAll('secondary_genre'));
        }
    }, [searchParams])

    const handleBadgeClick = (genre, genreType) => {
        setRemovingBadge(genre);
        setTimeout(() => {
          // remove the genre from the state
            if (genreType === 'main_genre') {
                setMainGenre(mainGenre.filter((g) => g !== genre));
            } else {
                setSecondaryGenre(secondaryGenre.filter((g) => g !== genre));
            }
            setRemovingBadge(null);
            genreCount.current -= 1;

            // remove the genre from the search params
            const params = new URLSearchParams(searchParams);
            params.delete(genreType, genre);
            replace(`${pathname}?${params.toString()}`);
        }, 200); 
      };
      

    if (genreCount.current === 0) {
        return null;
    }
    return (
        <div className="flex flex-row gap-2 order-2 lg:order-1">
            {mainGenre.map((genre, index) => (
                <Badge
                    key={genre}
                    variant="default"
                    onClick={() => handleBadgeClick(genre, 'main_genre')}
                    className={clsx("badge", {
                        'animate-shrink-disappear': removingBadge === genre,
                    })}
                >
                    {toTitleCase(genre)}
                </Badge>
            ))}
            {secondaryGenre.map((genre, index) => (
                <Badge
                    key={genre}
                    variant="secondary"
                    onClick={() => handleBadgeClick(genre, 'secondary_genre')}
                    className={clsx("badge", {
                        'animate-shrink-disappear': removingBadge === genre,
                    })}
                >
                    {toTitleCase(genre)}
                </Badge>
            ))}
        </div>
    )
}