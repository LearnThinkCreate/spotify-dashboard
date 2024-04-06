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


export const WrappedXAxisTick = (props) => {
    
  const { x, y, stroke, payload, width, isDesktop, themeCodes, screenWidth, tickFormatter } = props;

  const textAnchor = 'end';
  
  const xAxisStyle = {
    angle: isDesktop ? -40 : -70,
    fontSize: isDesktop ? '14' : '10',
  } 

  const textObjects = wrapWord({
    word: payload.value,
    fontSize: parseInt(xAxisStyle.fontSize),
    width: (width / props.visibleTicksCount),
    isDesktop,
    screenWidth,
  });

  
  return (
    <g transform={`translate(${x},${y})`}>
      {textObjects.map((text, index) => (
        <text
          x={0}
          y={0 + (index * 15)}
          dy={10}
          textAnchor={textAnchor}
          fill={themeCodes['accent-foreground']}
          fontSize={xAxisStyle.fontSize}
          transform={`rotate(${xAxisStyle.angle})`}
          key={index}
        >
          {addEllipsis(
            tickFormatter ? tickFormatter(text.word) : text.word, 
            text.maxCharWidth
          )}
        </text>
      ))
      }
    </g>
  );
};

export const CircleBarLabel = (props) => {
  const { x, y, width, height, value, isLargeDesktop, screenWidth, themeCodes } = props;
  const radius = !(isLargeDesktop) ? 15 : 18;
  const heightAdjust = screenWidth < 500 ? 0 : height > 60 ? 40 : 0;
  let fontSize;
  if (screenWidth >= 1024) {
      fontSize = '14';
  } else if (screenWidth > 640) {
      fontSize = '10';
  } else {
      fontSize = '8';
  }
  
  return (
    <g>
      {
        <circle cx={x + width / 2} cy={y + heightAdjust - radius} r={radius} fill={themeCodes['background']} />
      }
      <text 
        x={x + width / 2} 
        y={y + heightAdjust - radius} 
        fill={themeCodes['accent-foreground']} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fontSize={fontSize}
        >
        {parseFloat(value).toFixed(0)
      }
      </text>
    </g>
  );
}
////

// Width Multiplier
// (
//     MaxMultiplier - ((MaxMultiplier - MinMultipliaer) / 10) * (10 / MaxScreenWidth - MinScreenWidth) * (MaxScreenWidth - screenWidth)
// )
