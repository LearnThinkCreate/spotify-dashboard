import { getArtistCardData } from "@/lib/db/data";
import ArtistCard from "./Cards/ArtistCoreCard";

export default async function CoreCards() {
    const artistData = await getArtistCardData();
    // console.log(artistData.artistProfile);
    return (
        <>
        <ArtistCard {...artistData} />
        <ArtistCard {...artistData} />
        <ArtistCard {...artistData} />
        <ArtistCard {...artistData} />
        </>
    );
}

