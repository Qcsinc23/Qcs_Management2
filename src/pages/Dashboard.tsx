import React from 'react'
import { Box, Grid, useTheme } from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'
import { StatCard, MetricCard, DataCard } from '../components/common/Card'
import { useNavigate } from 'react-router-dom'
import { LoggingService } from '../services/LoggingService'

const Dashboard: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const logger = LoggingService.getInstance()

  const handleNavigation = (path: string) => {
    logger.info(`Navigating to ${path}`)
    navigate(path)
  }

  const recentActivity = [
    {
      id: '1',
      type: 'delivery',
      description: 'Order #12345 delivered successfully',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'booking',
      description: 'New booking created #12346',
      timestamp: '3 hours ago',
    },
    {
      id: '3',
      type: 'inventory',
      description: 'Low stock alert: Item XYZ',
      timestamp: '4 hours ago',
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Stats Row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Deliveries"
            value="1,250"
            icon={<ShippingIcon />}
            trend={{
              value: 12,
              label: 'vs last month',
              direction: 'up',
            }}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value="94.4%"
            icon={<TrendingUpIcon />}
            trend={{
              value: 4,
              label: 'vs last month',
              direction: 'up',
            }}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Inventory"
            value="325"
            icon={<InventoryIcon />}
            trend={{
              value: 2,
              label: 'vs last month',
              direction: 'down',
            }}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Orders"
            value="48"
            icon={<AssignmentIcon />}
            trend={{
              value: 8,
              label: 'vs last month',
              direction: 'up',
            }}
            color="info"
          />
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} md={8}>
          <MetricCard
            title="Delivery Performance"
            value="1,180"
            subtitle="Total deliveries this month"
            chart={<Box sx={{ height: 300 }}>Chart Component Here</Box>}
            height={400}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Inventory Status"
            value="87%"
            subtitle="Current capacity utilization"
            chart={<Box sx={{ height: 300 }}>Chart Component Here</Box>}
            height={400}
          />
        </Grid>

        {/* Activity and Tasks Row */}
        <Grid item xs={12} md={6}>
          <DataCard
            title="Recent Activity"
            data={
              <Box>
                {recentActivity.map(activity => (
                  <Box
                    key={activity.id}
                    sx={{
                      p: 2,
                      '&:not(:last-child)': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Box sx={{ fontWeight: 500, mb: 0.5 }}>
                          {activity.description}
                        </Box>
                        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          {activity.timestamp}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            }
            height={400}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataCard
            title="Quick Actions"
            data={
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={6}>
                  <Box
                    onClick={() => handleNavigation('/booking')}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    New Booking
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    onClick={() => handleNavigation('/inventory')}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    Manage Inventory
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    onClick={() => handleNavigation('/tracking')}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    Track Deliveries
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    onClick={() => handleNavigation('/reports')}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    View Reports
                  </Box>
                </Grid>
              </Grid>
            }
            height={400}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
