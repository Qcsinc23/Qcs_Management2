import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Timeline as TimelineIcon,
  LocalShipping as DeliveryIcon,
  Inventory as InventoryIcon,
  Assignment as TaskIcon,
  TrendingUp as MetricsIcon,
} from '@mui/icons-material';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard = ({ title, value, icon, color }: DashboardCardProps) => (
  <Card 
    sx={{ 
      height: '100%',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ textAlign: 'center', mt: 2 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

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
      </Grid>
    </Box>
  );
}
