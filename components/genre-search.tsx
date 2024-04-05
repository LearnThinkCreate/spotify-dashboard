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
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { toTitleCase } from "@/lib/utils"

type Genre = {
  genre: string
  genre_type: string
}

export function GenreSearch({ genres }: { genres: { genre: string, genre_type: string }[]}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStatus, setSelectedStatus] = React.useState<Genre[] | null>(
    []
  )
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const addNewstatus = ({status, genreType}: {
    status: Genre,
    genreType: 'mainGenre' | 'secondaryGenre'
  }) => {
    const params = new URLSearchParams(searchParams);
    params.delete('genreQuery');
    setSelectedStatus([...selectedStatus, status])

    if (!params.get(genreType)) {
        params.set(genreType, status.genre);
        replace(`${pathname}?${params.toString()}`);
        return;
    }
    if (!params.getAll(genreType).includes(status.genre)) {
        params.append(genreType, status.genre);
        replace(`${pathname}?${params.toString()}`);
        return;
    }
    params.delete(genreType, status.genre);
    replace(`${pathname}?${params.toString()}`);
    // return;
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
        params.set('genreQuery', term);
      } else {
        params.delete('genreQuery');
      }
    replace(`${pathname}?${params.toString()}`);
  }, 200);

  const handleOpen = (value) => {
    setOpen(value);
    if (!value) {
      handleSearch('')
    }
  }


  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start bg-card">
            + Set status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} onSelect={addNewstatus} handleSearch={handleSearch} genres={genres} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start bg-card">
        + Set status
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} onSelect={addNewstatus} genres={genres} handleSearch={handleSearch} />
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
  onSelect: (params: { status: Genre | null, genreType: string }) => void;
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
            status: genres.find((genre) => genre.genre === value) || null,
            genreType: genre.genre_type
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