"use client";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList  } from "recharts";
import { BarGraphOptions } from '@/components/graphics/Graphs/options';
import { useScreenWidth } from "@/hooks/screen-width";
import { useMediaQuery } from "@/hooks/use-media-query"
import { useThemeState } from "@/hooks/theme-state";
import { wrapWord, addEllipsis } from "@/components/graphics/Graphs/tick-wrapping";

const HistoryBarChart = ({data, categroyValue, searchKey}: {
    data: any,
    categroyValue: string,
    searchKey: string
}) => {
  const localSearchKeyRef = React.useRef("");
  const animationActiveRef = React.useRef(true);
  const renderCount = React.useRef(0);
  const offset = React.useRef(0);

  React.useEffect(() => {
    if (renderCount.current < 4) {
      renderCount.current += 1;
    }
    if (renderCount.current  == 2 ) {
      offset.current = 1;
      animationActiveRef.current = false;
      return
    } else if (renderCount.current === 3) {
      offset.current = 0;
      return
    }
  });
  
  React.useEffect(() => {
    if (localSearchKeyRef.current !== searchKey) {
      localSearchKeyRef.current = searchKey;
    }
  }, [searchKey])

  const option = BarGraphOptions.find(option => option.value === categroyValue) 

  const maxLabelLength = Math.max(...JSON.parse(data).map(item => item[option.value]?.length));

  const isDesktop = useMediaQuery("(min-width: 768px)")
  const isLargeDesktop = useMediaQuery("(min-width: 1024px)")
  const screenWidth = useScreenWidth();
  const themeCodes = useThemeState();

  let marginBottom;
  if (maxLabelLength < 10) {marginBottom = 15}
  else if (maxLabelLength < 20) {marginBottom = 65}
  else {marginBottom = 80}

  const CustomizedAxisTick = (props) => {
    // console.log('CustomizedAxisTick Rendered')
    
    const { x, y, stroke, payload, width } = props;

    const textAnchor = 'end';
    
    const xAxisStyle = {
      angle: isDesktop ? -40 : -70,
      fontSize: isDesktop ? '14' : '10',
    } 

    const textObjects = wrapWord({
      word: payload.value,
      fontSize: parseInt(xAxisStyle.fontSize),
      width: (width / props.visibleTicksCount) 
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
          >
            {addEllipsis(
              option.tickFormatter ? option.tickFormatter(text.word) : text.word, 
              text.maxCharWidth
            )}
          </text>
        ))
        }
      </g>
    );
  };

  const CustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
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

  return (
    <ResponsiveContainer>
      <BarChart
        data={JSON.parse(data)}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: isDesktop ? marginBottom : marginBottom + 20
        }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <Bar
          dataKey={'hours_played'}
          name={option.label}
          style={
            {
              fill: themeCodes['primary'],
              opacity: 1,
            } as React.CSSProperties
          }
          label={<CustomizedLabel  />}
          isAnimationActive={(offset.current === 1 ) ? true : (searchKey !== localSearchKeyRef.current)}
          // isAnimationActive={true}
        />
        <XAxis
          dataKey={option.value}
          padding={{ left: 5, right: 5, }}
          type="category"
          tickLine={false}
          tickCount={10}
          tick={<CustomizedAxisTick />}
          minTickGap={0}
          interval={0}
          allowDataOverflow={true}
        />
        <YAxis
          name="Test"
          domain={option.scale}
          tickFormatter={option.tickFormatter ? option.tickFormatter : undefined}
          padding={{ top: 5, bottom: 10 }}
          tick={{
              fontSize: '10',
              fill: themeCodes['accent-foreground'],
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};


  
  export default HistoryBarChart;
  