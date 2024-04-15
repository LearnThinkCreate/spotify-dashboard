import * as React from "react";
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
import { BarGraph } from "@/components/graph-main-bar";
import { EraImage } from "@/components/media-era-image";
import { EnergyCard } from "@/components/graph-energy";

export default async function Page({  }) {
  return (
    <div className="flex-none lg:flex lg:flex-col h-full p-6">
      {/* <div className=""> */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          <EraImage />
          <FavoriteCard className="" />
          <FavoriteGenre className="flex flex-col"/>
          <EnergyCard />
          <ExampleCard className="block lg:hidden xl:block"/>
        </div>
        <BarGraph className="flex flex-col h-full" />
    {/* </div> */}
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
