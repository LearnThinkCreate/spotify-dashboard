"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';



const CustomBarShape = (props) => {
  const { fill, x, y, width, height, value } = props;
  const totalBars = 14;
  const segmentHeight = Math.floor(props.background.height / totalBars);
  const segmentStroke = '#000'; // This is the border color; you can change it as needed
  let segments = [];

  // Calculate the number of segments that should be displayed for this value
  const valueSegments = calculateSegments(value, totalBars);

  // Define the segment colors based on the number of segments
  const segmentColors = [
    ...Array(6).fill('green'), // First 6 segments are green
    ...Array(4).fill('yellow'), // Next 4 are yellow
    ...Array(4).fill('red'), // Last 4 are red
  ];

  // Create the segments
  for (let i = 0; i < valueSegments; i++) {
    // Get the color for the current segment
    let segmentFill = segmentColors[i];
    // Calculate the Y position for each segment
    let segmentY = y + height - (i + 1) * segmentHeight;
    segments.push(
      <rect 
        x={x} 
        y={segmentY} 
        width={width} 
        height={segmentHeight - 1} // Subtract a small number to create a gap for the border
        fill={segmentFill} 
        stroke={segmentStroke} // Add a stroke here
        strokeWidth={.1} // This defines the thickness of the border
        key={i + props.name}
      />
    );
  }

  return <g>{segments}</g>;
};

const GradientBarChart = ({data}) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data}>
    <CartesianGrid horizontal={false} vertical={false} />
      <XAxis dataKey="name" axisLine={false} tickLine={false} />
      <YAxis hide domain={[0, 1]} />
      <Bar dataKey="value" shape={CustomBarShape}>
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);


const calculateSegments = (value, totalBars) => {
  // Calculate the number of segments based on the value
  const segments = Math.ceil(value * totalBars);
  return segments;
};

export default GradientBarChart;
