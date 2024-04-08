import * as React from "react"

// import { CoreCardWrapper } from "@/components/card-core-animation";
// import CoreCards from "@/components/card-core";

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


export default async function Page() {
  return (
    <div className="h-full grid grid-cols-3 gap-4 p-6">
      <React.Suspense fallback={<div>Loading...</div>}>
        <FavoriteCard className=""/>
        {/* <ExampleCard /> */}
        <FavoriteGenre />
        <ExampleCard />

        <ExampleCard />
        <ExampleCard />
        <ExampleCard />

        <ExampleCard />
        <ExampleCard />
        <ExampleCard />
      </React.Suspense>
    </div>
  );
}

const ExampleCard = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      ``,
      className
    )}
    {...props}
  >
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