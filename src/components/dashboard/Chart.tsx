import { Card, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { memo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: any;
  options?: any;
}

const Chart = memo(({ data, options }: ChartProps) => {
  return (
    <Card>
      <CardContent>
        <Line options={options} data={data} />
      </CardContent>
    </Card>
  );
});

Chart.displayName = 'Chart';

export default Chart;
