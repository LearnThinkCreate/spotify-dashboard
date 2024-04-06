"use client";

import { useScreenWidth } from "@/hooks/screen-width";
import { useMediaQuery } from "@/hooks/use-media-query";

type TextWrap = {
    word: string,
    maxCharWidth: number,
}

const calculateMultiplier = (
  maxMultiplier,
  minMultiplier,
  maxScreenWidth,
  minScreenWidth,
  screenWidth
) => {
  return (
    maxMultiplier -
    ((maxMultiplier - minMultiplier) / 10) *
      (10 / (maxScreenWidth - minScreenWidth)) *
      (maxScreenWidth - screenWidth)
  );
};

export const addEllipsis = (text, maxCharWidth) => {
  if (text.length > maxCharWidth) {
    return text.substring(0, maxCharWidth - 3) + "...";
  }
  return text;
};

export const wrapWord = ({ word, fontSize, width, isDesktop, screenWidth }) => {


    let widthMultiplier;

    if (isDesktop) {
        let maxMultiplier = 0.8;
        let minMultiplier = 0.3;
        let maxScreenWidth = 1536;
        let minScreenWidth = 768;

        if (screenWidth > maxScreenWidth) {
        widthMultiplier = maxMultiplier;
        } else {
        widthMultiplier = calculateMultiplier(
            maxMultiplier,
            minMultiplier,
            maxScreenWidth,
            minScreenWidth,
            screenWidth
        );
        }
    } else {
        let maxMultiplier = 0.3;
        let minMultiplier = 0.15;
        let maxScreenWidth = 768;
        let minScreenWidth = 500;

        if (screenWidth < minScreenWidth) {
            widthMultiplier = minMultiplier;
        }

        widthMultiplier = calculateMultiplier(
        maxMultiplier,
        minMultiplier,
        maxScreenWidth,
        minScreenWidth,
        screenWidth
        );
    }

    const charWidth = fontSize * widthMultiplier;
    const maxCharWidth = (width / charWidth);

    const textObjects = [];

    if (isDesktop) {
        const words = word.split(" ");
        let currentLine = words[0];

        words.slice(1).forEach((word) => {
        const possibleLine = `${currentLine} ${word}`;
        if (possibleLine.length > maxCharWidth) {
            textObjects.push({ word: currentLine, maxCharWidth: maxCharWidth});
            currentLine = word;
        } else {
            currentLine = possibleLine;
        }
        });
        textObjects.push({ word: currentLine, maxCharWidth: maxCharWidth});
    } else {
        textObjects.push({ word: addEllipsis(word, maxCharWidth), maxCharWidth: maxCharWidth});
    }

  return textObjects;
};

////

// Width Multiplier
// (
//     MaxMultiplier - ((MaxMultiplier - MinMultipliaer) / 10) * (10 / MaxScreenWidth - MinScreenWidth) * (MaxScreenWidth - screenWidth)
// )
