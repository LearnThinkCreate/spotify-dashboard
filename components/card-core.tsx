import { getArtistCardData } from "@/lib/db/data-core-card";
import ArtistCard from "./card-core-artist";
import { AlbumCard } from "./card-core-album";

export default async function CoreCards() {
    const artistData = await getArtistCardData();
    return (
        <>
        <ArtistCard {...artistData} />
        <ArtistCard {...artistData} />
        <AlbumCard />
        <AlbumCard />
        </>
    );
}

