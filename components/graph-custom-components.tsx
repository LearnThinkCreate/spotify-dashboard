"use client";

import * as charts from "recharts";
import { toTitleCase } from "@/lib/utils";

export const calculateSize = ({
   maxMultiplier,
   minMultiplier,
   maxScreenWidth,
   minScreenWidth,
   screenWidth,
   steps = 10,
}) =>
   maxMultiplier -
   ((maxMultiplier - minMultiplier) / steps) *
      (steps / (maxScreenWidth - minScreenWidth)) *
      (maxScreenWidth - screenWidth);

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
         widthMultiplier = calculateSize({
            maxMultiplier,
            minMultiplier,
            maxScreenWidth,
            minScreenWidth,
            screenWidth,
         });
      }
   } else {
      let maxMultiplier = 0.3;
      let minMultiplier = 0.15;
      let maxScreenWidth = 768;
      let minScreenWidth = 375;

      if (screenWidth < minScreenWidth) {
         widthMultiplier = minMultiplier;
      }

      widthMultiplier = calculateSize({
         maxMultiplier,
         minMultiplier,
         maxScreenWidth,
         minScreenWidth,
         screenWidth,
      });
   }

   const charWidth = fontSize * widthMultiplier;
   const maxCharWidth = width / charWidth;

   const textObjects = [] as any;

   if (isDesktop) {
      const words = word.split(" ");
      let currentLine = words[0];

      words.slice(1).forEach((word) => {
         const possibleLine = `${currentLine} ${word}`;
         if (possibleLine.length > maxCharWidth) {
            textObjects.push({ word: currentLine, maxCharWidth: maxCharWidth });
            currentLine = word;
         } else {
            currentLine = possibleLine;
         }
      });
      textObjects.push({ word: currentLine, maxCharWidth: maxCharWidth });
   } else {
      textObjects.push({
         word: addEllipsis(word, maxCharWidth),
         maxCharWidth: maxCharWidth,
      });
   }

   return textObjects;
};

interface CustomXAxisTickProps extends charts.XAxisProps {
   // tickFormatter: (value: string) => string;
   customFormatter?: any;
   themeCodes?: any;
   screenWidth?: number;
   isDesktop?: boolean;
   visibleTicksCount?: number;
   width?: number;
   test?: string;
}
export const WrappedXAxisTick = ({
   isDesktop,
   themeCodes,
   screenWidth,
   customFormatter,
   test,
   ...props
}: CustomXAxisTickProps) => {
   const { x, y, payload, visibleTicksCount, width } = props as any;
   
   const textAnchor = "end";

   const xAxisStyle = {
      angle: isDesktop ? -40 : -70,
      fontSize: isDesktop ? "14" : "10",
   };


   const textObjects = wrapWord({
      word: customFormatter ? customFormatter(payload.value) : payload.value,
      fontSize: parseInt(xAxisStyle.fontSize),
      width: width / visibleTicksCount,
      isDesktop,
      screenWidth,
   });

   return (
      <g transform={`translate(${x},${y})`}>
         {textObjects.map((text, index) => (
            <text
               x={0}
               y={0 + index * 15}
               dy={10}
               textAnchor={textAnchor}
               fill={themeCodes["accent-foreground"]}
               fontSize={xAxisStyle.fontSize}
               transform={`rotate(${xAxisStyle.angle})`}
               key={index}
            >
               {addEllipsis(text.word, text.maxCharWidth)}
            </text>
         ))}
      </g>
   );
};

interface MobileBarLabelProps extends charts.LabelProps {
   themeCodes?: any;
}

export const MobileBarLabel = ({
   themeCodes,
   ...props
}: MobileBarLabelProps) => {
   const { x, y, width, value } = props as any;
   return (
      <g>
         <text
            x={x + width / 2}
            y={y + 10}
            fill={themeCodes["primary-foreground"]}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
         >
            {parseFloat(value).toFixed(0)}
         </text>
      </g>
   );
};

interface CircleBarLabelProps extends charts.LabelProps {
   isLargeDesktop: boolean;
   screenWidth: number;
   themeCodes?: any;
}

export const CircleBarLabel = ({
   isLargeDesktop,
   screenWidth,
   themeCodes,
   ...props
}: CircleBarLabelProps) => {
   const { x, y, width, height, value } = props as any;

   const radius = !isLargeDesktop ? 15 : 18;
   const heightAdjust = screenWidth < 500 ? 0 : height > 60 ? 40 : 0;
   let fontSize;
   if (screenWidth >= 1024) {
      fontSize = "14";
   } else if (screenWidth > 640) {
      fontSize = "10";
   } else {
      fontSize = "8";
   }

   return (
      <g>
         {
            <circle
               cx={x + width / 2}
               cy={y + heightAdjust - radius}
               r={radius}
               fill={themeCodes["background"]}
            />
         }
         <text
            x={x + width / 2}
            y={y + heightAdjust - radius}
            fill={themeCodes["accent-foreground"]}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
         >
            {parseFloat(value).toFixed(0)}
         </text>
      </g>
   );
};

export const PieLabel = ({
   x,
   y,
   cx,
   percent,
   name,
   fill,
   isMini,
   isDesktop,
   // middleRadius,
   // cy,
   // midAngle,
   // innerRadius,
   // outerRadius,
   // maxRadius,
}) => {
   const PieLabelText = ({
      word,
      ydelta = 0,
      xdelta = 0,
      x = 0,
      y = 0,
      cx = 0,
      fill = "",
      fontSize = 14,
   }: {
      word: string;
      ydelta?: number;
      xdelta?: number;
      x?: number;
      y?: number;
      cx?: number;
      fill?: string;
      fontSize?: number;
   }) => (
      <>
         <text
            x={x + xdelta}
            y={y - 8 + ydelta}
            fill={fill}
            textAnchor={x < cx ? "end" : "start"}
            dominantBaseline="middle"
            fontSize={fontSize}
         >
            {word}
         </text>
      </>
   );

   let fontSize;

   if (isDesktop) {
      fontSize = "14";
   } else if (isMini) {
      fontSize = "12";
   } else {
      fontSize = "16";
   }

   const charWidth = fontSize * 0.65;
   const labelWidth = (percent * 100).toFixed(0).length * 10;

   if (x < cx) {
      x += labelWidth / 2;
   } else {
      x -= labelWidth / 2;
   }

   let defaultDelta = 0;
   let nameDelta = 0;
   let nameLength = name.length * charWidth;
   if (x < cx) {
      if (x + 5 - nameLength < 0) {
         nameDelta = nameLength - x;
      }
   } else {
      if (nameLength + x + defaultDelta > cx * 2) {
         nameDelta = (nameLength + x + defaultDelta - cx * 2) * -1;
      }
   }

   return (
      <>
         <PieLabelText
            word={name as string}
            ydelta={-20}
            x={x}
            y={y}
            cx={cx}
            fill={fill}
            fontSize={fontSize}
            xdelta={nameDelta}
         />
         <PieLabelText
            word={`${((percent as number) * 100).toFixed(0)}%`}
            xdelta={0}
            x={x}
            y={y}
            cx={cx}
            fill={fill}
            fontSize={fontSize}
         />
      </>
   );
};
