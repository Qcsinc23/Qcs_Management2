import { Card, CardContent } from '@mui/material'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { memo } from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

interface ChartProps {
  data: any
  options?: any
}

const Chart = memo(({ data, options }: ChartProps) => {
  return (
    <Card>
      <CardContent>
        <Line options={options} data={data} />
      </CardContent>
    </Card>
  )
})

Chart.displayName = 'Chart'

export default Chart
