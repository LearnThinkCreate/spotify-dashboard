"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebouncedCallback } from 'use-debounce';
import { toTitleCase } from "@/lib/utils"
import { prismaGenreOptions } from "@/lib/db/query-spotify-utils"

export type GenreResult = {
  genre: string
  genre_type: string
}

export type GenreSelectParams = (params: GenreResult) => void;

export function GenreSearch({ onGenreSelect }: { onGenreSelect: GenreSelectParams }) {
    const [genres, setGenres] = React.useState<{ genre: string, genre_type: string }[]>([]);
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [term, setTerm] = React.useState('')

    const handleSearch = useDebouncedCallback(async (term: string) => {
        try {
            const data = await prismaGenreOptions(term);
            setGenres(data);
            setTerm(term)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 200);

    const handleOpen = (value) => {
        setOpen(value);
        if (!value && term) {
            handleSearch('')
        }
    }

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) {
            handleSearch('');
        }
        return () => { ignore = true; }
    }, [])

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={handleOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start bg-card">
                + Set Genre
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <StatusList setOpen={setOpen} onSelect={onGenreSelect} handleSearch={handleSearch} genres={genres} />
            </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={handleOpen}>
            <DrawerTrigger asChild>
            <Button variant="outline" className="w-[136px] justify-start bg-card">
            + Set Genre
            </Button>
            </DrawerTrigger>
            <DrawerContent>
            <div className="mt-4 border-t">
                <StatusList setOpen={setOpen} onSelect={onGenreSelect} genres={genres} handleSearch={handleSearch} />
            </div>
            </DrawerContent>
        </Drawer>
    )
}

function StatusList({
    setOpen,
    onSelect,
    search,
    handleSearch,
    genres
}: {
    setOpen: (open: boolean) => void
    onSelect: GenreSelectParams;
    search?: string;
    handleSearch?: (term: string) => void;
    genres: { genre: string, genre_type: string }[];
}) {
    const main_genres = genres.filter(genre => genre.genre_type === 'main_genre');
    const sub_genres = genres.filter(genre => genre.genre_type === 'secondary_genre');

    const genreCommandList = ({ genres, heading }: { genres: { genre: string, genre_type: string }[], heading: string }) => (
    <CommandGroup heading={heading}>
    {genres.map((genre) => (
        <CommandItem
        key={genre.genre}
        value={genre.genre}
        onSelect={(value) => {
            onSelect({
                genre: value,
                genre_type: genre.genre_type
            })
            setOpen(false)
        }}
        >
        {toTitleCase(genre.genre)}
        </CommandItem>
    ))}
    </CommandGroup>
    )

    return (
    <Command>
        <CommandInput 
        placeholder="Filter status..." 
        value={search} 
        onValueChange={handleSearch}
        />
        <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {main_genres.length > 0 && genreCommandList({ genres: main_genres, heading: 'Main Genres' })}
        {sub_genres.length > 0 && genreCommandList({ genres: sub_genres, heading: 'Sub-Genres' })}
        </CommandList>
    </Command>
    )
}