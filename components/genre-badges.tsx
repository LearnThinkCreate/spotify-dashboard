"use client"
import * as React from "react";
import clsx from 'clsx';
import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/lib/utils";

import { GenreResult, GenreSelectParams } from '@/components/genre-search'

export interface Genre extends GenreResult {
    removed?: boolean;
}

export const GenreBadges = ({
    mainGenre,
    secondaryGenre,
    onBadgeClick
}: {
    mainGenre: Genre[],
    secondaryGenre: Genre[],
    onBadgeClick: GenreSelectParams
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {mainGenre.map((genre, index) => (
                <Badge
                    key={genre.genre + index}
                    variant="default"
                    onClick={() => onBadgeClick({genre: genre.genre, genre_type: 'main_genre'})}
                    className={clsx("badge", {
                        'animate-shrink-disappear': genre.removed,
                    })}
                >
                    {toTitleCase(genre.genre)}
                </Badge>
            ))}
            {secondaryGenre.map((genre, index) => (
                <Badge
                    key={genre.genre + index}
                    variant="secondary"
                    onClick={() => onBadgeClick({genre: genre.genre, genre_type: 'secondary_genre'})}
                    className={clsx("badge", {
                        'animate-shrink-disappear': genre.removed,
                    })}
                >
                    {toTitleCase(genre.genre)}
                </Badge>
            ))}
        </div>
    );
}