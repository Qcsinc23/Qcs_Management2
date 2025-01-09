import { Grid, Typography, Box } from '@mui/material';
import {
  Timeline as TimelineIcon,
  LocalShipping as DeliveryIcon,
  Inventory as InventoryIcon,
  Assignment as TaskIcon,
  TrendingUp as MetricsIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import Chart from '../components/dashboard/Chart';

const options = {
  responsive: true,
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

const chartData = {
  labels,
  datasets: [
    {
      label: 'Sales',
      data: labels.map(() => Math.random() * 1000),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Expenses',
      data: labels.map(() => Math.random() * 500),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export default function Dashboard() {

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Upcoming Events"
            value="12"
            icon={<TimelineIcon sx={{ color: '#2196f3' }} />}
            color="#2196f3"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Active Deliveries"
            value="8"
            icon={<DeliveryIcon sx={{ color: '#4caf50' }} />}
            color="#4caf50"
            progress={60}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Inventory Alerts"
            value="3"
            icon={<InventoryIcon sx={{ color: '#f44336' }} />}
            color="#f44336"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <DashboardCard
            title="Task Assignments"
            value="15"
            icon={<TaskIcon sx={{ color: '#ff9800' }} />}
            color="#ff9800"
            progress={80}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <DashboardCard
            title="Performance Metrics"
            value="92%"
            icon={<MetricsIcon sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>

        <Grid item xs={12}>
          <Chart options={options} data={chartData} />
        </Grid>
      </Grid>
    </Box>
  );
}
