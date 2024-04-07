import * as React from 'react';
import { cn } from '@/lib/utils';
import { RxAvatar } from 'react-icons/rx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    CoreCard, 
    CoreCardContent, 
    CoreCardContentDiv,
    CoreCardHeader,
    padding,
    maxImageHeight
} from '@/components/card-core-base';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import GradientBarChart from '@/components/graph-vm-meter';



export default function ArtistCard({
  topArtist,
  topSong,
  topAlbum,
  artistProfile,
  className
}: any) {
    const cardClasses = {
      content: "flex-1",
      footer: "mt-auto",
    };

    return (
      <CoreCard className="">

        <CoreCardHeader>
          <div className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-md">Top Artist</CardTitle>
            <Avatar>
              <AvatarImage
                src={topArtist.image_md.url}
                alt={topArtist.artist}
              />
              <AvatarFallback>
                <RxAvatar className="text-xl" />
              </AvatarFallback>
            </Avatar>
          </div>
          <CardDescription className="text-sm italic">
            {topArtist.artist}
          </CardDescription>
        </CoreCardHeader>
        
        <CoreCardContent >

          <CoreCardContentDiv>
            <div className={`flex flex-col gap-2 ${padding}`}>
              <span className="font-bold">Favorite Album</span>
              <p className="italic"> {topAlbum.album}</p>
            </div>
            <div>
              <img
                className={`hidden md:block ${maxImageHeight}`}
                src={topAlbum.image_md.url}
                alt={topAlbum.album}
              />
              <img
                className="md:hidden"
                src={topAlbum.image_sm.url}
                alt={topAlbum.album}
              />
            </div>
          </CoreCardContentDiv>

          <CoreCardContentDiv>
            <div className="">
              <img
                className={`hidden md:block ${maxImageHeight}`}
                src={topSong.image_md.url}
                alt={topSong.song}
              />
              <img
                className="md:hidden"
                src={topSong.image_sm.url}
                alt={topSong.song}
              />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="block text-right font-bold">Favorite Song</span>
              <span className="block text-right italic text-pretty"> {topSong.song}</span>
            </div>
          </CoreCardContentDiv>

          <CoreCardContentDiv >
            {/* <div className={`
                h-full
                w-full
                grid
                grid-cols-2 lg:grid-rows-2
                text-lg md:text-3xl lg:text-4xl 
                gap-2 md:py-8 lg:py-6
            `}>
              <div className="lg:col-span-2 font-smibold align-top antialiased">
                <span className="lg:block">Hours </span>
                <span className="lg:block">Listened</span>
              </div>
              <div className={`lg:col-span-2 flex flex-col justify-end items-end`}><p className="">{totalHours.toFixed(2)}</p></div>
            </div> */}
            <GradientBarChart data={artistProfile} />
            
          </CoreCardContentDiv>

        </CoreCardContent>
      </CoreCard>
    );
  }





