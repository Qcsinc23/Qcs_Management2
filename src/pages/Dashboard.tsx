import { Grid, Typography, Box } from '@mui/material';
import {
  Timeline as TimelineIcon,
  LocalShipping as DeliveryIcon,
  Inventory as InventoryIcon,
  Assignment as TaskIcon,
  TrendingUp as MetricsIcon,
} from '@mui/icons-material';
import { useMemo } from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import Chart from '../components/dashboard/Chart';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Key Performance Indicators',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export default function Dashboard() {
  // Memoize chart data to prevent regeneration on every render
  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Sales',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Expenses',
        data: labels.map(() => Math.floor(Math.random() * 500)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }), []); // Empty dependency array since we want this data to remain constant

  // Memoize cards data
  const cards = useMemo(() => [
    {
      title: "Upcoming Events",
      value: "12",
      icon: <TimelineIcon sx={{ color: '#2196f3' }} />,
      color: "#2196f3"
    },
    {
      title: "Active Deliveries",
      value: "8",
      icon: <DeliveryIcon sx={{ color: '#4caf50' }} />,
      color: "#4caf50",
      progress: 60
    },
    {
      title: "Inventory Alerts",
      value: "3",
      icon: <InventoryIcon sx={{ color: '#f44336' }} />,
      color: "#f44336"
    },
    {
      title: "Task Assignments",
      value: "15",
      icon: <TaskIcon sx={{ color: '#ff9800' }} />,
      color: "#ff9800",
      progress: 80
    },
    {
      title: "Performance Metrics",
      value: "92%",
      icon: <MetricsIcon sx={{ color: '#9c27b0' }} />,
      color: "#9c27b0"
    }
  ], []); // Empty dependency array since this data is static

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.slice(0, 3).map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DashboardCard {...card} />
          </Grid>
        ))}

        {cards.slice(3).map((card, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <DashboardCard {...card} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Box sx={{ height: 400 }}>
            <Chart options={options} data={chartData} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
