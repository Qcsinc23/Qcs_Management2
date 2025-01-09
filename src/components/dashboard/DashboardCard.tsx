import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

const DashboardCard = ({ title, value, icon, color, progress }: DashboardCardProps) => (
  <Card sx={{ height: '100%' }}>
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
      {progress && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </CardContent>
  </Card>
);

export default DashboardCard;
