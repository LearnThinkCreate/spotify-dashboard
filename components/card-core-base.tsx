import { cn } from '@/lib/utils';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card';

import * as React from "react";

const CoreCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      `fancyCard font-thin 
      flex flex-col shadow-primary
      shadow-md hover:shadow-lg hover:shadow-primary
      sm:p-1 md:p-2 ${padding}
      `,
      className
    )}
    {...props}
  />
))
CoreCard.displayName = "CoreCard"

const CoreCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <CardContent
        ref={ref}
        className={cn(`flex flex-col flex-grow gap-4 ${padding} h-3/4`, className)}
        {...props}
    />
))
CoreCardContent.displayName = "CoreCardContent"

const CoreCardContentDiv = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            `basis-1/3 flex flex-row justify-between
             2xl:flex-row 2xl:justify-between 
            items-top space-y-0
            `,
            className
        )}
        {...props}
    />
));
CoreCardContentDiv.displayName = "ContentDiv"

const CoreCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> 
>(({ className, ...props }, ref) => (
    <CardHeader
        ref={ref}
        className={cn(
            `${padding}`,
            className
        )}
        {...props}
    />  
));
CoreCardHeader.displayName = "CoreCardHeader"

const padding = 'lg:max-xl:p-2';

const maxImageHeight = 'h-40 w-auto';

export { CoreCard, CoreCardContent, CoreCardContentDiv, padding, maxImageHeight, CoreCardHeader }