"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const CoreCardWrapper = ({ className, children }: {
    className?: string;
    children: React.ReactNode;

}) => {
    const container = React.useRef();
    const tl = React.useRef();

    useGSAP(() => {
        gsap.set('.fancyCard', { y: 100, opacity: 0 });
        gsap.to('.fancyCard', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut",
            stagger: 0.4,
        });
        }, { scope: container});
    return (
        <div ref={container.current} className={cn(
            "",
            className
        )}>
            {children}
        </div>
    );
}