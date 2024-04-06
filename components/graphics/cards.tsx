import { getArtistCardData } from "@/lib/db/card-data";
import ArtistCard from "./CoreCards/ArtistCoreCard";

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

