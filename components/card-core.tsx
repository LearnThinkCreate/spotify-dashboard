import { getArtistCardData } from "@/lib/db/data-core-card";
import ArtistCard from "./card-core-artist";

export default async function CoreCards() {
    const artistData = await getArtistCardData();
    return (
        <>
        <ArtistCard {...artistData} />
        <ArtistCard {...artistData} />
        <ArtistCard {...artistData} />
        <ArtistCard {...artistData} />
        </>
    );
}

