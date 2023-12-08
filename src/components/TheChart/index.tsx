import { memo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface ITheChartProps {
  data: Array<{
    subject: string;
    A: number;
    B?: number;
    fullMark: number;
  }>;
}

const {
  theme: { colors },
} = require('../../../tailwind.config');

const TheChart = memo(function TheChart(props: ITheChartProps) {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <RadarChart cx='50%' cy='50%' outerRadius='80%' data={props.data}>
        <PolarGrid />
        <PolarAngleAxis dataKey='subject' />
        <PolarRadiusAxis />
        <Radar
          name='Champion Attributes'
          dataKey='A'
          stroke={colors.secondary}
          fill={colors.secondary}
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
});

export default TheChart;
