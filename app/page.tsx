import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FavoriteCard } from "@/components/card-favorite";
import { FavoriteGenre } from "@/components/card-favorite-genre";
import { getRandomImagePath } from "@/lib/query-era-image";
import { BarGraph } from "@/components/graph-main-bar";
import { queryHoursPlayed } from "@/lib/db/query-spotify-utils";

export default async function Page({ searchParams }) {
  const totalHoursPlayed = await queryHoursPlayed() as number;
  return (
    <div className="flex-none lg:flex lg:flex-col h-full p-6">
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <Card className="min-h-72 max-w-96 xl:h-full xl:max-w-full container order-first lg:order-2 flex p-0 border-none bg-transparent">
            <CardContent className="flex-1 relative">
              <Image
                className="rounded-lg"
                src={getRandomImagePath()}
                alt="Random Image"
                fill={true}
              />
            </CardContent>
          </Card>
          <FavoriteCard className="" />
          <FavoriteGenre totalHoursPlayed={totalHoursPlayed} />
          <ExampleCard />
          <ExampleCard />
        </div>
        <BarGraph className="flex flex-col h-full" />
      </React.Suspense>
    </div>
  );
}

const ExampleCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card ref={ref} className={cn(``, className)} {...props}>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter>
      <p>Card Footer</p>
    </CardFooter>
  </Card>
));
ExampleCard.displayName = "ExampleCard";
