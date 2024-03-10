import { 
    FaMicrophone, FaHatCowboy, 
    FaHeadphonesAlt, 
    FaCity, 
    FaStar,
    FaRandom, 
    FaMusic, 
    FaMask,
    FaTree, 
    FaCanadianMapleLeaf,
    FaHeart, 
    FaSprayCan, 
    FaWaveSquare, 
    FaGuitar,
    FaHeadphones, FaFeather,
 } from 'react-icons/fa';

// export const genreIcons = {
//     "funk": FaHeadphonesAlt,
//     "conscious hip hop": FaMicrophone,
//     "southern hip hop": FaHatCowboy,
//     "classic rock": FaGuitar,
//     "dance": FaStar,
//     "lofi": FaHeadphones,
//     "atl hip hop": FaCity,
//     "east coast hip hop": FaCity,
//     "melodic rap": FaStar,
//     "chicago rap": FaRandom,
//     "alternative rock": FaGuitar,
//     "canadian hip hop": FaCanadianMapleLeaf,
//     "white noise": FaWaveSquare,
//     "new orleans rap": FaMask,
//     "west coast rap": FaCity,
//     "modern rock": FaFeather,
//     "english indie rock": FaFeather,
//     "mellow gold": FaMusic,
//     "uk contemporary r&b": FaStar,
//     "alternative hip hop": FaRandom,
//     "classical": FaMusic,
//     "permanent wave": FaWaveSquare,
//     "hard rock": FaGuitar,
//     "folk": FaTree,
//     "hurdy-gurdy": FaMusic,
//     "ambient worship": FaSprayCan,
//     "british indie rock": FaFeather,
//     "north carolina hip hop": FaCity,
//     "binaural": FaHeadphones,
//     "indie soul": FaHeart,
//     "soft rock": FaStar,
// }

export default function getGenreIcon(genre: string) {
    switch(genre) {
        case "funk":
            return <FaHeadphonesAlt className="h-12 w-12" />
        case "conscious hip hop":
            return <FaMicrophone />
        case "southern hip hop":
            return <FaHatCowboy />
        case "classic rock":
            return <FaGuitar />
        case "dance":
            return <FaStar />
        case "lofi":
            return <FaHeadphones />
        case "atl hip hop":
            return <FaCity />
        case "east coast hip hop":
            return <FaCity />
        case "melodic rap":
            return <FaStar />
        case "chicago rap":
            return <FaCity />
        case "alternative rock":
            return <FaGuitar />
        case "canadian hip hop":
            return <FaCanadianMapleLeaf />
        case "white noise":
            return <FaWaveSquare />
        case "new orleans rap":
            return <FaMask />
        case "west coast rap":
            return <FaCity />
        case "modern rock":
            return <FaGuitar />
        case "english indie rock":
            return <FaGuitar />
        case "mellow gold":
            return <FaMusic />
        case "uk contemporary r&b":
            return <FaStar />
        case "alternative hip hop":
            return <FaRandom />
        case "classical":
            return <FaMusic />
        case "permanent wave":
            return <FaWaveSquare />
        case "hard rock":
            return <FaGuitar />
        case "folk":
            return <FaTree />
        case "hurdy-gurdy":
            return <FaMusic />
        case "ambient worship":
            return <FaSprayCan />
        case "british indie rock":
            return <FaGuitar />
        case "north carolina hip hop":
            return <FaCity />
        case "binaural":
            return <FaHeadphones />
        case "indie soul":
            return <FaHeart />
        case "soft rock":
            return <FaStar />
    }
}
